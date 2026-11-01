import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import sharp from "sharp";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getDb, closeDb } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

// ─── Security headers ──────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }),
);

// ─── CORS ──────────────────────────────────────────
function isLocalhost(origin) {
  if (!origin || process.env.NODE_ENV === "production") return false;
  try {
    const u = new URL(origin);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1" || u.hostname === "::1";
  } catch {
    return false;
  }
}

const STATIC_ORIGINS = ["https://muhaddil.github.io"];
if (process.env.NODE_ENV !== "production") {
  STATIC_ORIGINS.push("null");
}

if (process.env.CORS_ORIGINS) {
  for (const o of process.env.CORS_ORIGINS.split(",")) {
    const t = o.trim();
    if (t) STATIC_ORIGINS.push(t);
  }
}

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || isLocalhost(origin) || STATIC_ORIGINS.includes(origin)) {
        cb(null, true);
      } else {
        console.warn(`[CORS] Bloqueado: "${origin}"`);
        cb(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "bypass-tunnel-reminder"],
  }),
);

app.use(express.json({ limit: "1mb" }));

const db = getDb();

// ─── Auth Middleware ──────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error("█████████████████████████████████████████████████████████████████");
  console.error("  ERROR CRÍTICO: ADMIN_PASSWORD no está configurado.");
  console.error("  Crea un archivo server/.env con:");
  console.error("    ADMIN_PASSWORD=tu_contraseña_segura");
  console.error("  O configúralo como variable de entorno.");
  console.error("█████████████████████████████████████████████████████████████████");
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 16) {
  console.error("ERROR CRÍTICO: ADMIN_PASSWORD debe tener al menos 16 caracteres.");
  process.exit(1);
}

const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function createAdminToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + ADMIN_SESSION_TTL_MS, nonce: crypto.randomUUID() }),
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", ADMIN_PASSWORD).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifyAdminToken(token) {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return false;
    const expected = crypto
      .createHmac("sha256", ADMIN_PASSWORD)
      .update(payload)
      .digest("base64url");
    const receivedBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (receivedBuffer.length !== expectedBuffer.length) return false;
    if (!crypto.timingSafeEqual(receivedBuffer, expectedBuffer)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

function passwordMatches(candidate) {
  const valid = Buffer.from(ADMIN_PASSWORD);
  const received = Buffer.from(candidate || "");
  return valid.length === received.length && crypto.timingSafeEqual(valid, received);
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No se proporcionó token de autenticación" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: "Sesión de administración inválida o expirada" });
  }
  next();
};

// ─── Forum Auth Middleware ──────────────────────────
function forumAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.substring(7)
    : req.headers.authorization;

  if (!token) {
    req.forumUser = null;
    return next();
  }

  if (verifyAdminToken(token)) {
    req.forumUser = {
      id: null,
      username: "admin",
      role: "admin",
      displayName: "Admin",
    };
    return next();
  }

  try {
    const session = db
      .prepare(
        `
      SELECT s.user_id, u.username, u.role, u.display_name
      FROM forum_sessions s
      JOIN forum_users u ON u.id = s.user_id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `,
      )
      .get(token);

    if (session) {
      req.forumUser = {
        id: session.user_id,
        username: session.username,
        role: session.role,
        displayName: session.display_name,
      };
    } else {
      req.forumUser = null;
    }
  } catch (e) {
    req.forumUser = null;
  }
  next();
}

function requireForumAuth(req, res, next) {
  if (!req.forumUser) {
    return res.status(401).json({ error: "Debes iniciar sesión" });
  }
  next();
}

function requireForumRole(...roles) {
  return (req, res, next) => {
    if (!req.forumUser) {
      return res.status(401).json({ error: "Debes iniciar sesión" });
    }
    if (!roles.includes(req.forumUser.role)) {
      return res.status(403).json({ error: "No tienes permisos para esta acción" });
    }
    next();
  };
}

// ─── Rate limiting ────────────────────────────────
const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
});

const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Espera un minuto." },
});

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de acceso. Espera 15 minutos." },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Has alcanzado el límite de subidas. Intenta en una hora." },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de autenticación. Espera un minuto." },
});

app.use("/api", publicLimiter);
app.use("/api/admin", adminLimiter);
app.use("/api/gallery/submit", uploadLimiter);

// Serve static assets for guide images
app.use("/assets", express.static(join(__dirname, "..", "..", "src", "assets")));

// File upload config for gallery
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];

const storage = multer.diskStorage({
  destination: join(__dirname, "..", "uploads"),
  filename: (req, file, cb) => {
    const ext = (file.originalname.split(".").pop() || "jpg").toLowerCase();
    const safeExt = ALLOWED_EXTS.includes(ext) ? ext : "jpg";
    cb(null, `gallery-${crypto.randomUUID()}.${safeExt}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(new Error("Tipo de archivo no soportado. Usa JPG, PNG, WebP o GIF."));
    }
    const ext = (file.originalname.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return cb(new Error("Extensión de archivo no soportada."));
    }
    cb(null, true);
  },
});

app.use("/uploads", express.static(join(__dirname, "..", "uploads")));

async function compressToWebp(filePath) {
  const ext = filePath.split(".").pop().toLowerCase();
  const fs = await import("fs/promises");
  try {
    const image = sharp(filePath, { failOn: "error", limitInputPixels: 50_000_000 });
    const meta = await image.metadata();
    const allowedFormats = ["jpeg", "png", "webp", "gif"];
    if (!meta.format || !allowedFormats.includes(meta.format)) {
      throw new Error("El archivo no es una imagen válida.");
    }
    if (!meta.width || !meta.height) {
      throw new Error("La imagen no tiene dimensiones válidas.");
    }
    if (ext === "webp") return filePath;
    const webpPath = filePath.replace(/\.[^.]+$/, ".webp");
    await image.webp({ quality: 80 }).toFile(webpPath);
    await fs.unlink(filePath);
    return webpPath;
  } catch (err) {
    await fs.unlink(filePath).catch(() => undefined);
    const webpPath = filePath.replace(/\.[^.]+$/, ".webp");
    await fs.unlink(webpPath).catch(() => undefined);
    throw err;
  }
}

// ─── Stats ────────────────────────────────────────────
app.get("/api/stats", (req, res) => {
  try {
    const row = db
      .prepare(
        `
      SELECT
        (SELECT COUNT(*) FROM parts) AS parts,
        (SELECT COUNT(*) FROM compatibilities) AS compatibilities,
        (SELECT COUNT(*) FROM compatibilities WHERE verified = 1) AS verified,
        (SELECT COUNT(*) FROM guides) AS guides,
        (SELECT COUNT(*) FROM submissions) AS submissions,
        (SELECT COUNT(*) FROM gallery) AS gallery,
        (SELECT COUNT(*) FROM problems) AS problems,
        COALESCE((SELECT SUM(contributions) FROM members), 0) AS memberContribs
    `,
      )
      .get();

    res.json({
      partsCatalog: row.parts,
      partsDocumented: row.compatibilities,
      verifiedEquivalences: row.verified,
      repairGuides: row.guides || 0,
      registeredProblems: row.problems,
      totalContributions: row.memberContribs + row.submissions,
      galleryEntries: row.gallery,
    });
  } catch (err) {
    console.error("Stats error:", err.message);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

function safeJson(val, fallback = "[]") {
  try {
    return JSON.parse(val || fallback);
  } catch {
    return JSON.parse(fallback);
  }
}

// ─── Members ──────────────────────────────────────────
app.get("/api/members", (req, res) => {
  try {
    const members = db
      .prepare(
        "SELECT id, name, country, avatar_color, contributions, speciality, joined_year FROM members ORDER BY contributions DESC",
      )
      .all();
    res.json(members);
  } catch (err) {
    console.error("Members error:", err.message);
    res.status(500).json({ error: "Error al obtener miembros" });
  }
});

// ─── Submissions ──────────────────────────────────────
app.post("/api/submissions", (req, res) => {
  const { type, username, email, title, description, data } = req.body;

  if (!type || !username || !email || !title) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  if (!["comp", "part", "guide", "problem", "bug", "partwrong"].includes(type)) {
    return res.status(400).json({ error: "Tipo de propuesta inválido" });
  }

  const s = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  if (s(username, 100).length < 2) return res.status(400).json({ error: "Nombre muy corto" });
  if (!/^[^\s@]+@[^\s@]+$/.test(s(email, 254)))
    return res.status(400).json({ error: "Email inválido" });
  if (s(title, 200).length < 3) return res.status(400).json({ error: "Título muy corto" });

  const desc = s(description || "", 5000);
  const extraData = JSON.stringify(data || {});

  try {
    const stmt = db.prepare(
      "INSERT INTO submissions (type, username, email, title, description, data) VALUES (?, ?, ?, ?, ?, ?)",
    );
    const result = stmt.run(type, s(username, 100), s(email, 254), s(title, 200), desc, extraData);

    res.status(201).json({
      id: result.lastInsertRowid,
      message: "Propuesta registrada correctamente",
    });
  } catch (err) {
    console.error("Submissions insert error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/submissions", authMiddleware, (req, res) => {
  const subs = db.prepare("SELECT * FROM submissions ORDER BY created_at DESC").all();
  res.json(subs);
});

// ─── Compatibilities ──────────────────────────────────
app.get("/api/compatibilities", (req, res) => {
  try {
    const rows = db
      .prepare(
        "SELECT id, rocsta_part_es, rocsta_part_en, donor_vehicle_es, donor_vehicle_en, donor_ref, type, difficulty, motor, verified, confirmations, notes_es, notes_en, category FROM compatibilities ORDER BY id",
      )
      .all();

    const list = rows.map((r) => ({
      id: r.id,
      rocstaPart: { es: r.rocsta_part_es, en: r.rocsta_part_en },
      donorVehicle: { es: r.donor_vehicle_es, en: r.donor_vehicle_en },
      donorRef: r.donor_ref,
      type: r.type,
      difficulty: r.difficulty,
      motor: r.motor,
      verified: Boolean(r.verified),
      confirmations: r.confirmations,
      notes: r.notes_es ? { es: r.notes_es, en: r.notes_en } : undefined,
      category: r.category,
    }));

    res.json(list);
  } catch (err) {
    console.error("Compatibilities error:", err.message);
    res.status(500).json({ error: "Error al obtener compatibilidades" });
  }
});

app.post("/api/compatibilities/:id/confirm", (req, res) => {
  const { id } = req.params;
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  const existing = db.prepare("SELECT * FROM compatibilities WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Compatibilidad no encontrada" });
  }

  const updated = db.transaction(() => {
    const info = db
      .prepare("INSERT OR IGNORE INTO confirmations (compatibility_id, ip) VALUES (?, ?)")
      .run(id, ip);
    if (info.changes === 0) return null;
    db.prepare("UPDATE compatibilities SET confirmations = confirmations + 1 WHERE id = ?").run(id);
    return db.prepare("SELECT confirmations FROM compatibilities WHERE id = ?").get(id);
  })();

  if (!updated) {
    return res.status(409).json({ error: "Ya has confirmado esta compatibilidad" });
  }

  res.json({
    id,
    confirmations: updated.confirmations,
    message: "Confirmación registrada",
  });
});

app.get("/api/compatibilities/:id/confirmations/count", (req, res) => {
  try {
    const { id } = req.params;
    const ip = req.ip || req.socket.remoteAddress || "unknown";

    const confirmed = db
      .prepare("SELECT COUNT(*) as c FROM confirmations WHERE compatibility_id = ? AND ip = ?")
      .get(id, ip);

    const total = db.prepare("SELECT confirmations FROM compatibilities WHERE id = ?").get(id);

    res.json({
      id,
      confirmations: total?.confirmations || 0,
      userConfirmed: confirmed.c > 0,
    });
  } catch (err) {
    console.error("Confirm count error:", err.message);
    res.status(500).json({ error: "Error al obtener estado de confirmación" });
  }
});

// ─── Parts ─────────────────────────────────────────────
app.get("/api/parts", (req, res) => {
  try {
    const { category, motor, status } = req.query;
    let query =
      "SELECT id, name_es, name_en, category, description_es, description_en, oem, equiv, status, motor, notes_es, notes_en, refs FROM parts WHERE 1=1";
    const params = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (motor) {
      query += " AND motor = ?";
      params.push(motor);
    }
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY id";

    const rows = db.prepare(query).all(...params);

    const list = rows.map((r) => ({
      id: r.id,
      name: { es: r.name_es, en: r.name_en },
      category: r.category,
      description: { es: r.description_es, en: r.description_en },
      oem: r.oem,
      equiv: safeJson(r.equiv),
      status: r.status,
      motor: r.motor,
      notes: r.notes_es ? { es: r.notes_es, en: r.notes_en } : undefined,
      refs: safeJson(r.refs),
    }));

    res.json(list);
  } catch (err) {
    console.error("Parts error:", err.message);
    res.status(500).json({ error: "Error al obtener piezas" });
  }
});

// ─── Problems ─────────────────────────────────────────────
app.get("/api/problems", (req, res) => {
  try {
    const { category, motor, severity } = req.query;
    let query = "SELECT * FROM problems WHERE 1=1";
    const params = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (motor) {
      query += " AND motor = ?";
      params.push(motor);
    }
    if (severity) {
      query += " AND severity = ?";
      params.push(severity);
    }

    query += " ORDER BY id";

    const rows = db.prepare(query).all(...params);

    const list = rows.map((r) => ({
      id: r.id,
      title: { es: r.title_es, en: r.title_en },
      severity: r.severity,
      motor: r.motor,
      km: r.km,
      symptom: { es: r.symptom_es, en: r.symptom_en },
      cause: { es: r.cause_es, en: r.cause_en },
      solution: { es: r.solution_es, en: r.solution_en },
      cost: r.cost,
      difficulty: r.difficulty,
      category: r.category,
      reports: r.reports,
    }));

    res.json(list);
  } catch (err) {
    console.error("Problems error:", err.message);
    res.status(500).json({ error: "Error al obtener problemas" });
  }
});

app.post("/api/problems/:id/confirm", (req, res) => {
  const { id } = req.params;
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  const existing = db.prepare("SELECT * FROM problems WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Problema no encontrado" });
  }

  const updated = db.transaction(() => {
    const info = db
      .prepare("INSERT OR IGNORE INTO problem_confirmations (problem_id, ip) VALUES (?, ?)")
      .run(id, ip);
    if (info.changes === 0) return null;
    db.prepare("UPDATE problems SET reports = reports + 1 WHERE id = ?").run(id);
    return db.prepare("SELECT reports FROM problems WHERE id = ?").get(id);
  })();

  if (!updated) {
    return res.status(409).json({ error: "Ya has reportado este problema" });
  }

  res.json({
    id,
    reports: updated.reports,
    message: "Reporte registrado",
  });
});

app.get("/api/problems/:id/confirmations/count", (req, res) => {
  try {
    const { id } = req.params;
    const ip = req.ip || req.socket.remoteAddress || "unknown";

    const confirmed = db
      .prepare("SELECT COUNT(*) as c FROM problem_confirmations WHERE problem_id = ? AND ip = ?")
      .get(id, ip);

    const total = db.prepare("SELECT reports FROM problems WHERE id = ?").get(id);

    res.json({
      id,
      reports: total?.reports || 0,
      userConfirmed: confirmed.c > 0,
    });
  } catch (err) {
    console.error("Problem confirm count error:", err.message);
    res.status(500).json({ error: "Error al obtener estado de reporte" });
  }
});

// ─── Guides ─────────────────────────────────────────────
app.get("/api/guides", (req, res) => {
  try {
    const rows = db
      .prepare(
        "SELECT id, slug, title_es, title_en, description_es, description_en, level, time, image, motor, category, tools, steps, tags, contributions FROM guides ORDER BY id",
      )
      .all();

    const list = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: { es: r.title_es, en: r.title_en },
      description: { es: r.description_es, en: r.description_en },
      level: r.level,
      time: r.time,
      image: r.image || undefined,
      motor: r.motor,
      category: r.category,
      tools: safeJson(r.tools),
      steps: safeJson(r.steps),
      tags: safeJson(r.tags),
      contributions: r.contributions,
    }));

    res.json(list);
  } catch (err) {
    console.error("Guides error:", err.message);
    res.status(500).json({ error: "Error al obtener guías" });
  }
});

// ─── Forum Auth ──────────────────────────────────────
app.post("/api/forum/register", authLimiter, (req, res) => {
  try {
    const { username, password, display_name } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username y password son obligatorios" });
    }

    const cleanUsername = username.trim().toLowerCase().slice(0, 30);
    const cleanDisplayName = (display_name || username).trim().slice(0, 50);

    if (cleanUsername.length < 3)
      return res.status(400).json({ error: "El username debe tener al menos 3 caracteres" });
    if (!/^[a-z0-9_-]+$/.test(cleanUsername))
      return res.status(400).json({
        error: "El username solo puede contener letras, números, guiones y guiones bajos",
      });
    if (password.length < 8)
      return res.status(400).json({ error: "El password debe tener al menos 8 caracteres" });
    if (password.length > 128)
      return res.status(400).json({ error: "El password no puede superar los 128 caracteres" });

    const existing = db.prepare("SELECT id FROM forum_users WHERE username = ?").get(cleanUsername);
    if (existing) {
      return res.status(409).json({ error: "Este username ya está en uso" });
    }

    const hash = bcrypt.hashSync(password, 12);
    db.prepare("DELETE FROM forum_sessions WHERE expires_at <= datetime('now')").run();
    const result = db
      .prepare(
        "INSERT INTO forum_users (username, password_hash, role, display_name) VALUES (?, ?, ?, ?)",
      )
      .run(cleanUsername, hash, "user", cleanDisplayName);

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare("INSERT INTO forum_sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(
      token,
      result.lastInsertRowid,
      expiresAt,
    );

    res.status(201).json({
      token,
      user: {
        id: result.lastInsertRowid,
        username: cleanUsername,
        role: "user",
        displayName: cleanDisplayName,
      },
    });
  } catch (err) {
    console.error("Forum register error:", err.message);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

app.post("/api/forum/login", authLimiter, (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username y password son obligatorios" });
    }

    const cleanUsername = username.trim().toLowerCase();
    const user = db.prepare("SELECT * FROM forum_users WHERE username = ?").get(cleanUsername);
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    db.prepare("UPDATE forum_users SET last_login = datetime('now') WHERE id = ?").run(user.id);
    db.prepare("DELETE FROM forum_sessions WHERE expires_at <= datetime('now')").run();

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare("INSERT INTO forum_sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(
      token,
      user.id,
      expiresAt,
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        displayName: user.display_name,
      },
    });
  } catch (err) {
    console.error("Forum login error:", err.message);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

app.post("/api/forum/logout", forumAuth, requireForumAuth, (req, res) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.substring(7)
      : req.headers.authorization;
    db.prepare("DELETE FROM forum_sessions WHERE token = ?").run(token);
    res.json({ message: "Sesión cerrada" });
  } catch (err) {
    console.error("Forum logout error:", err.message);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
});

app.get("/api/forum/me", forumAuth, (req, res) => {
  if (!req.forumUser) {
    return res.json({ user: null });
  }
  res.json({ user: req.forumUser });
});

// ─── Forum ──────────────────────────────────────────────
app.get("/api/forum/threads", forumAuth, (req, res) => {
  try {
    const { category, includePending } = req.query;
    const limit = Math.min(
      Math.max(Number.parseInt(String(req.query.limit || ""), 10) || 30, 1),
      100,
    );
    const offset = Math.max(Number.parseInt(String(req.query.offset || ""), 10) || 0, 0);
    const isAdminOrMod =
      req.forumUser && (req.forumUser.role === "admin" || req.forumUser.role === "moderator");
    const userId = req.forumUser?.id || null;

    let query = `SELECT t.id, t.category, t.author_name, t.user_id, t.title, t.content, t.status, t.created_at, t.views, t.replies_count, t.last_activity,
      (SELECT COUNT(*) FROM forum_likes WHERE thread_id = t.id) as likes_count
      ${userId ? ", (SELECT 1 FROM forum_likes WHERE thread_id = t.id AND user_id = ?) IS NOT NULL as liked" : ", 0 as liked"}
      FROM forum_threads t`;
    const conditions = [];
    const params = userId ? [userId] : [];

    if (category) {
      conditions.push("t.category = ?");
      params.push(category);
    }

    if (!isAdminOrMod || includePending !== "true") {
      conditions.push("t.status = 'approved'");
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY t.last_activity DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    console.error("Forum threads error:", err.message);
    res.status(500).json({ error: "Error al obtener hilos del foro" });
  }
});

app.get("/api/forum/threads/:id", forumAuth, (req, res) => {
  try {
    const { id } = req.params;
    const thread = db.prepare("SELECT * FROM forum_threads WHERE id = ?").get(id);
    if (!thread) {
      return res.status(404).json({ error: "Hilo no encontrado" });
    }

    const isAdminOrMod =
      req.forumUser && (req.forumUser.role === "admin" || req.forumUser.role === "moderator");
    if (thread.status !== "approved" && !isAdminOrMod) {
      return res.status(404).json({ error: "Hilo no encontrado" });
    }

    // Count view per IP (max once per 24h)
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";
    const userId = req.forumUser?.id || null;
    const existing = db
      .prepare("SELECT last_viewed FROM forum_view_log WHERE thread_id = ? AND ip = ?")
      .get(id, clientIp);
    const now = new Date();
    const canView =
      !existing || now - new Date(existing.last_viewed.replace(" ", "T")) > 24 * 60 * 60 * 1000;
    if (canView) {
      db.prepare("UPDATE forum_threads SET views = views + 1 WHERE id = ?").run(id);
      thread.views += 1;
      if (existing) {
        db.prepare(
          "UPDATE forum_view_log SET last_viewed = datetime('now'), user_id = ? WHERE thread_id = ? AND ip = ?",
        ).run(userId, id, clientIp);
      } else {
        db.prepare("INSERT INTO forum_view_log (thread_id, ip, user_id) VALUES (?, ?, ?)").run(
          id,
          clientIp,
          userId,
        );
      }
    }

    let postsQuery = `SELECT p.*,
      (SELECT COUNT(*) FROM forum_post_likes WHERE post_id = p.id) as likes_count
      ${userId ? ", (SELECT 1 FROM forum_post_likes WHERE post_id = p.id AND user_id = ?) IS NOT NULL as liked" : ", 0 as liked"}
      FROM forum_posts p WHERE p.thread_id = ?`;
    const postsParams = userId ? [userId, id] : [id];
    if (!isAdminOrMod) {
      postsQuery += " AND p.status = 'approved'";
    }
    postsQuery += " ORDER BY p.created_at ASC";
    const posts = db.prepare(postsQuery).all(...postsParams);

    const likesCount = db
      .prepare("SELECT COUNT(*) as c FROM forum_likes WHERE thread_id = ?")
      .get(id).c;
    const liked = userId
      ? !!db
          .prepare("SELECT 1 FROM forum_likes WHERE thread_id = ? AND user_id = ?")
          .get(id, userId)
      : false;

    res.json({ thread: { ...thread, likes_count: likesCount, liked }, posts });
  } catch (err) {
    console.error("Forum thread detail error:", err.message);
    res.status(500).json({ error: "Error al obtener el hilo" });
  }
});

app.post("/api/forum/threads", forumAuth, (req, res) => {
  try {
    const { category, author_name, title, content } = req.body;
    if (!category || !author_name || !title || !content) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios", errorCode: "MISSING_FIELDS" });
    }
    if (!["general", "mechanical", "electrical", "body", "marketplace"].includes(category)) {
      return res
        .status(400)
        .json({ error: "Categoría de foro inválida", errorCode: "INVALID_CATEGORY" });
    }

    const cleanAuthor = (req.forumUser?.display_name || author_name).trim().slice(0, 100);
    const cleanTitle = title.trim().slice(0, 200);
    const cleanContent = content.trim().slice(0, 5000);

    if (cleanAuthor.length < 2)
      return res
        .status(400)
        .json({ error: "Nombre de autor muy corto", errorCode: "AUTHOR_TOO_SHORT" });
    if (cleanTitle.length < 3)
      return res.status(400).json({ error: "Título muy corto", errorCode: "TITLE_TOO_SHORT" });
    if (cleanContent.length < 5)
      return res
        .status(400)
        .json({ error: "Contenido del hilo muy corto", errorCode: "CONTENT_TOO_SHORT" });

    const isRegistered = req.forumUser && req.forumUser.role === "user";
    const status = isRegistered ? "approved" : "pending";
    const userId = req.forumUser ? req.forumUser.id : null;

    const stmt = db.prepare(
      "INSERT INTO forum_threads (category, author_name, user_id, title, content, status) VALUES (?, ?, ?, ?, ?, ?)",
    );
    const result = stmt.run(category, cleanAuthor, userId, cleanTitle, cleanContent, status);

    res.status(201).json({
      id: result.lastInsertRowid,
      status,
      message: isRegistered
        ? "Hilo creado correctamente"
        : "Hilo enviado. Será visible tras aprobación del administrador.",
    });
  } catch (err) {
    console.error("Forum create thread error:", err.message);
    res.status(500).json({ error: "Error al crear el hilo" });
  }
});

app.post("/api/forum/threads/:id/posts", forumAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { author_name, content } = req.body;
    if (!author_name || !content) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios", errorCode: "MISSING_FIELDS" });
    }

    const thread = db.prepare("SELECT id, status FROM forum_threads WHERE id = ?").get(id);
    if (!thread) {
      return res.status(404).json({ error: "Hilo no encontrado", errorCode: "THREAD_NOT_FOUND" });
    }

    const cleanAuthor = (req.forumUser?.display_name || author_name).trim().slice(0, 100);
    const cleanContent = content.trim().slice(0, 5000);

    if (cleanAuthor.length < 2)
      return res
        .status(400)
        .json({ error: "Nombre de autor muy corto", errorCode: "AUTHOR_TOO_SHORT" });
    if (cleanContent.length < 2)
      return res.status(400).json({ error: "Respuesta muy corta", errorCode: "REPLY_TOO_SHORT" });

    if (thread.status !== "approved") {
      return res
        .status(403)
        .json({ error: "Este hilo no admite respuestas", errorCode: "THREAD_CLOSED" });
    }

    const isRegistered = Boolean(req.forumUser);
    const status = isRegistered ? "approved" : "pending";
    const userId = req.forumUser ? req.forumUser.id : null;

    db.transaction(() => {
      db.prepare(
        "INSERT INTO forum_posts (thread_id, author_name, user_id, content, status) VALUES (?, ?, ?, ?, ?)",
      ).run(id, cleanAuthor, userId, cleanContent, status);
      if (status === "approved") {
        db.prepare(
          "UPDATE forum_threads SET replies_count = replies_count + 1, last_activity = datetime('now') WHERE id = ?",
        ).run(id);
      }
    })();

    res.status(201).json({
      status,
      message: isRegistered
        ? "Respuesta publicada correctamente"
        : "Respuesta enviada. Será visible tras aprobación del administrador.",
    });
  } catch (err) {
    console.error("Forum reply error:", err.message);
    res.status(500).json({ error: "Error al publicar la respuesta" });
  }
});

// ─── Forum Likes ────────────────────────────────────────
app.post("/api/forum/threads/:id/like", forumAuth, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.forumUser?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Debes iniciar sesión para dar me gusta", errorCode: "AUTH_REQUIRED" });
    }

    const thread = db.prepare("SELECT id FROM forum_threads WHERE id = ?").get(id);
    if (!thread)
      return res.status(404).json({ error: "Hilo no encontrado", errorCode: "THREAD_NOT_FOUND" });

    const existing = db
      .prepare("SELECT 1 FROM forum_likes WHERE thread_id = ? AND user_id = ?")
      .get(id, userId);
    if (existing) {
      db.prepare("DELETE FROM forum_likes WHERE thread_id = ? AND user_id = ?").run(id, userId);
    } else {
      db.prepare("INSERT INTO forum_likes (thread_id, user_id) VALUES (?, ?)").run(id, userId);
    }

    const count = db.prepare("SELECT COUNT(*) as c FROM forum_likes WHERE thread_id = ?").get(id).c;
    res.json({ liked: !existing, likes: count });
  } catch (err) {
    console.error("Forum like error:", err.message);
    res.status(500).json({ error: "Error al procesar me gusta" });
  }
});

app.post("/api/forum/posts/:id/like", forumAuth, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.forumUser?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Debes iniciar sesión para dar me gusta", errorCode: "AUTH_REQUIRED" });
    }

    const post = db.prepare("SELECT id FROM forum_posts WHERE id = ?").get(id);
    if (!post)
      return res.status(404).json({ error: "Post no encontrado", errorCode: "POST_NOT_FOUND" });

    const existing = db
      .prepare("SELECT 1 FROM forum_post_likes WHERE post_id = ? AND user_id = ?")
      .get(id, userId);
    if (existing) {
      db.prepare("DELETE FROM forum_post_likes WHERE post_id = ? AND user_id = ?").run(id, userId);
    } else {
      db.prepare("INSERT INTO forum_post_likes (post_id, user_id) VALUES (?, ?)").run(id, userId);
    }

    const count = db
      .prepare("SELECT COUNT(*) as c FROM forum_post_likes WHERE post_id = ?")
      .get(id).c;
    res.json({ liked: !existing, likes: count });
  } catch (err) {
    console.error("Forum post like error:", err.message);
    res.status(500).json({ error: "Error al procesar me gusta" });
  }
});

// ─── Forum Moderation ──────────────────────────────────
app.delete(
  "/api/forum/threads/:id",
  forumAuth,
  requireForumRole("admin", "moderator"),
  (req, res) => {
    try {
      const { id } = req.params;
      const thread = db.prepare("SELECT id FROM forum_threads WHERE id = ?").get(id);
      if (!thread) return res.status(404).json({ error: "Hilo no encontrado" });

      db.prepare("DELETE FROM forum_threads WHERE id = ?").run(id);
      res.json({ message: "Hilo eliminado correctamente" });
    } catch (err) {
      console.error("Forum delete thread error:", err.message);
      res.status(500).json({ error: "Error al eliminar el hilo" });
    }
  },
);

app.delete(
  "/api/forum/posts/:id",
  forumAuth,
  requireForumRole("admin", "moderator"),
  (req, res) => {
    try {
      const { id } = req.params;
      const post = db.prepare("SELECT id, thread_id FROM forum_posts WHERE id = ?").get(id);
      if (!post) return res.status(404).json({ error: "Post no encontrado" });

      db.transaction(() => {
        db.prepare("DELETE FROM forum_posts WHERE id = ?").run(id);
        db.prepare(
          "UPDATE forum_threads SET replies_count = replies_count - 1 WHERE id = ? AND replies_count > 0",
        ).run(post.thread_id);
      })();

      res.json({ message: "Post eliminado correctamente" });
    } catch (err) {
      console.error("Forum delete post error:", err.message);
      res.status(500).json({ error: "Error al eliminar el post" });
    }
  },
);

app.patch(
  "/api/forum/threads/:id/status",
  forumAuth,
  requireForumRole("admin", "moderator"),
  (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const thread = db.prepare("SELECT id FROM forum_threads WHERE id = ?").get(id);
      if (!thread) return res.status(404).json({ error: "Hilo no encontrado" });

      if (req.forumUser?.id) {
        db.prepare(
          "UPDATE forum_threads SET status = ?, approved_by = ?, approved_at = datetime('now') WHERE id = ?",
        ).run(status, req.forumUser.id, id);
      } else {
        db.prepare(
          "UPDATE forum_threads SET status = ?, approved_at = datetime('now') WHERE id = ?",
        ).run(status, id);
      }

      if (status === "approved") {
        db.prepare(
          "UPDATE forum_threads SET replies_count = (SELECT COUNT(*) FROM forum_posts WHERE thread_id = ? AND status = 'approved') WHERE id = ?",
        ).run(id, id);
      }

      res.json({
        message: `Hilo ${status === "approved" ? "aprobado" : status === "rejected" ? "rechazado" : "marcado como pendiente"}`,
      });
    } catch (err) {
      console.error("Forum moderate thread error:", err.message);
      res.status(500).json({ error: "Error al moderar el hilo" });
    }
  },
);

app.patch(
  "/api/forum/posts/:id/status",
  forumAuth,
  requireForumRole("admin", "moderator"),
  (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const post = db.prepare("SELECT id, thread_id FROM forum_posts WHERE id = ?").get(id);
      if (!post) return res.status(404).json({ error: "Post no encontrado" });

      if (req.forumUser?.id) {
        db.prepare(
          "UPDATE forum_posts SET status = ?, approved_by = ?, approved_at = datetime('now') WHERE id = ?",
        ).run(status, req.forumUser.id, id);
      } else {
        db.prepare(
          "UPDATE forum_posts SET status = ?, approved_at = datetime('now') WHERE id = ?",
        ).run(status, id);
      }

      db.prepare(
        "UPDATE forum_threads SET replies_count = (SELECT COUNT(*) FROM forum_posts WHERE thread_id = ? AND status = 'approved') WHERE id = ?",
      );

      res.json({
        message: `Post ${status === "approved" ? "aprobado" : status === "rejected" ? "rechazado" : "marcado como pendiente"}`,
      });
    } catch (err) {
      console.error("Forum moderate post error:", err.message);
      res.status(500).json({ error: "Error al moderar el post" });
    }
  },
);

app.get(
  "/api/forum/admin/pending",
  forumAuth,
  requireForumRole("admin", "moderator"),
  (req, res) => {
    try {
      const pendingThreads = db
        .prepare(
          "SELECT id, category, author_name, title, content, created_at FROM forum_threads WHERE status = 'pending' ORDER BY created_at ASC",
        )
        .all();
      const pendingPosts = db
        .prepare(
          `
      SELECT p.id, p.thread_id, t.title as thread_title, p.author_name, p.content, p.created_at
      FROM forum_posts p
      JOIN forum_threads t ON t.id = p.thread_id
      WHERE p.status = 'pending'
      ORDER BY p.created_at ASC
    `,
        )
        .all();

      res.json({ threads: pendingThreads, posts: pendingPosts });
    } catch (err) {
      console.error("Forum pending error:", err.message);
      res.status(500).json({ error: "Error al obtener contenido pendiente" });
    }
  },
);

app.get("/api/forum/admin/posts", forumAuth, requireForumRole("admin", "moderator"), (req, res) => {
  try {
    const posts = db
      .prepare(
        `
      SELECT p.id, p.thread_id, t.title as thread_title, p.author_name, p.content, p.status, p.created_at,
        (SELECT COUNT(*) FROM forum_post_likes WHERE post_id = p.id) as likes_count
      FROM forum_posts p
      JOIN forum_threads t ON t.id = p.thread_id
      ORDER BY p.created_at DESC
    `,
      )
      .all();
    res.json(posts);
  } catch (err) {
    console.error("Forum admin posts error:", err.message);
    res.status(500).json({ error: "Error al obtener respuestas" });
  }
});

app.get("/api/forum/admin/users", forumAuth, requireForumRole("admin"), (req, res) => {
  try {
    const users = db
      .prepare(
        "SELECT id, username, role, display_name, created_at, last_login FROM forum_users ORDER BY created_at DESC",
      )
      .all();
    res.json(users);
  } catch (err) {
    console.error("Forum users error:", err.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.patch("/api/forum/admin/users/:id/role", forumAuth, requireForumRole("admin"), (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["admin", "moderator", "user"].includes(role)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    const user = db.prepare("SELECT id, role FROM forum_users WHERE id = ?").get(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.role === "admin" && role !== "admin") {
      const adminCount = db
        .prepare("SELECT COUNT(*) as c FROM forum_users WHERE role = 'admin'")
        .get();
      if (adminCount.c <= 1) {
        return res.status(400).json({ error: "No puedes degradar al único admin" });
      }
    }

    db.prepare("UPDATE forum_users SET role = ? WHERE id = ?").run(role, id);
    res.json({ message: `Rol actualizado a ${role}` });
  } catch (err) {
    console.error("Forum update role error:", err.message);
    res.status(500).json({ error: "Error al actualizar el rol" });
  }
});

app.delete("/api/forum/admin/users/:id", forumAuth, requireForumRole("admin"), (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare("SELECT id, role FROM forum_users WHERE id = ?").get(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.role === "admin") {
      const adminCount = db
        .prepare("SELECT COUNT(*) as c FROM forum_users WHERE role = 'admin'")
        .get();
      if (adminCount.c <= 1)
        return res.status(400).json({ error: "No puedes eliminar el único admin" });
    }
    const cleanup = db.transaction(() => {
      db.prepare("UPDATE forum_threads SET approved_by = NULL WHERE approved_by = ?").run(id);
      db.prepare("UPDATE forum_posts SET approved_by = NULL WHERE approved_by = ?").run(id);
      db.prepare("DELETE FROM forum_sessions WHERE user_id = ?").run(id);
      db.prepare("DELETE FROM forum_users WHERE id = ?").run(id);
    });
    cleanup();
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error("Forum delete user error:", err.message);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

// ─── Gallery ────────────────────────────────────────────
app.get("/api/gallery", (req, res) => {
  try {
    const rows = db
      .prepare(
        "SELECT id, image, year, motor, country, owner, verified FROM gallery ORDER BY created_at DESC",
      )
      .all();
    const list = rows.map((r) => ({
      id: r.id,
      image: r.image,
      year: r.year,
      motor: r.motor,
      country: r.country,
      owner: r.owner,
      verified: Boolean(r.verified),
    }));
    res.json(list);
  } catch (err) {
    console.error("Gallery error:", err.message);
    res.status(500).json({ error: "Error al obtener galería" });
  }
});

// ─── Gallery upload (public, rate-limited) ────────
app.post("/api/gallery/submit", upload.single("photo"), async (req, res) => {
  const { owner, year, motor, country } = req.body;
  if (!owner || !req.file) {
    return res.status(400).json({ error: "Faltan campos obligatorios: owner y photo" });
  }
  if (!["F8", "R2", "ambos"].includes(motor)) {
    return res.status(400).json({ error: "Motor inválido" });
  }
  const last = db
    .prepare(
      "SELECT id FROM gallery WHERE id LIKE 'gal-%' ORDER BY CAST(SUBSTR(id, 5) AS INTEGER) DESC LIMIT 1",
    )
    .get();
  let nextNum = 1;
  if (last) {
    const match = last.id.match(/^gal-(\d+)$/);
    if (match) nextNum = parseInt(match[1]) + 1;
  }
  const id = `gal-${String(nextNum).padStart(3, "0")}`;
  let uploadedPath = null;
  try {
    const compressed = await compressToWebp(join(__dirname, "..", "uploads", req.file.filename));
    uploadedPath = compressed;
    const imagePath = `/uploads/${compressed.split(/[\\/]/).pop()}`;
    db.prepare(
      "INSERT INTO gallery (id, image, year, motor, country, owner, verified) VALUES (?, ?, ?, ?, ?, ?, 0)",
    ).run(id, imagePath, year || "", motor || "ambos", country || "", owner);
    res.status(201).json({
      id,
      image: imagePath,
      message: "Foto enviada correctamente. Pendiente de revisión.",
    });
  } catch (err) {
    if (uploadedPath) {
      const fs = await import("fs/promises");
      await fs.unlink(uploadedPath).catch(() => undefined);
    }
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/login", adminLoginLimiter, (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== "string" || !passwordMatches(password)) {
    return res.status(401).json({ error: "Contraseña de administrador incorrecta" });
  }
  res.json({ token: createAdminToken(), expiresIn: ADMIN_SESSION_TTL_MS / 1000 });
});

app.use("/api/admin", authMiddleware);

// ─── Admin: list all ────────────────────────────────────
app.get("/api/admin/compatibilities", (req, res) => {
  const rows = db.prepare("SELECT * FROM compatibilities ORDER BY id").all();
  res.json(rows);
});

app.get("/api/admin/submissions", (req, res) => {
  const rows = db.prepare("SELECT * FROM submissions ORDER BY created_at DESC").all();
  res.json(rows);
});

app.get("/api/admin/members", (req, res) => {
  const rows = db.prepare("SELECT * FROM members ORDER BY contributions DESC").all();
  res.json(rows);
});

app.get("/api/admin/confirmations", (req, res) => {
  const rows = db
    .prepare(
      `SELECT c.id, c.compatibility_id, c.ip, c.created_at, co.rocsta_part_es
     FROM confirmations c
     LEFT JOIN compatibilities co ON c.compatibility_id = co.id
     ORDER BY c.created_at DESC`,
    )
    .all();
  res.json(rows);
});

app.get("/api/admin/problem_confirmations", (req, res) => {
  const rows = db
    .prepare(
      `SELECT pc.id, pc.problem_id, pc.ip, pc.created_at, p.title_es
     FROM problem_confirmations pc
     LEFT JOIN problems p ON pc.problem_id = p.id
     ORDER BY pc.created_at DESC`,
    )
    .all();
  res.json(rows);
});

app.get("/api/admin/parts", (req, res) => {
  const rows = db.prepare("SELECT * FROM parts ORDER BY id").all();
  res.json(rows);
});

app.get("/api/admin/guides", (req, res) => {
  const rows = db.prepare("SELECT * FROM guides ORDER BY id").all();
  res.json(rows);
});

app.get("/api/admin/problems", (req, res) => {
  const rows = db.prepare("SELECT * FROM problems ORDER BY id").all();
  res.json(rows);
});

app.get("/api/admin/gallery", (req, res) => {
  const rows = db.prepare("SELECT * FROM gallery ORDER BY created_at DESC").all();
  res.json(rows);
});

// ─── Admin: create & edit ───────────────────────────────
app.post("/api/admin/compatibilities", (req, res) => {
  let {
    id,
    rocsta_part_es,
    rocsta_part_en,
    donor_vehicle_es,
    donor_vehicle_en,
    donor_ref,
    type,
    difficulty,
    motor,
    verified,
    confirmations,
    notes_es,
    notes_en,
    category,
  } = req.body;

  if (
    !rocsta_part_es ||
    !rocsta_part_en ||
    !donor_vehicle_es ||
    !donor_vehicle_en ||
    !donor_ref ||
    !type ||
    !difficulty ||
    !motor ||
    !category
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  if (!id) {
    const last = db
      .prepare(
        "SELECT id FROM compatibilities WHERE id LIKE 'c-%' ORDER BY CAST(SUBSTR(id, 3) AS INTEGER) DESC LIMIT 1",
      )
      .get();
    let nextNum = 1;
    if (last) {
      const match = last.id.match(/^c-(\d+)$/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    id = `c-${String(nextNum).padStart(3, "0")}`;
  }

  const stmt = db.prepare(
    `INSERT INTO compatibilities (id, rocsta_part_es, rocsta_part_en, donor_vehicle_es, donor_vehicle_en, donor_ref, type, difficulty, motor, verified, confirmations, notes_es, notes_en, category)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  try {
    stmt.run(
      id,
      rocsta_part_es,
      rocsta_part_en,
      donor_vehicle_es,
      donor_vehicle_en,
      donor_ref,
      type,
      difficulty,
      motor,
      verified ? 1 : 0,
      confirmations || 0,
      notes_es || null,
      notes_en || null,
      category,
    );
    res.status(201).json({ id, message: "Compatibilidad creada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/compatibilities/:id", (req, res) => {
  const { id } = req.params;
  const {
    rocsta_part_es,
    rocsta_part_en,
    donor_vehicle_es,
    donor_vehicle_en,
    donor_ref,
    type,
    difficulty,
    motor,
    verified,
    confirmations,
    notes_es,
    notes_en,
    category,
  } = req.body;

  if (
    !rocsta_part_es ||
    !rocsta_part_en ||
    !donor_vehicle_es ||
    !donor_vehicle_en ||
    !donor_ref ||
    !type ||
    !difficulty ||
    !motor ||
    !category
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const existing = db.prepare("SELECT id FROM compatibilities WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Compatibilidad no encontrada" });

  const stmt = db.prepare(
    `UPDATE compatibilities 
     SET rocsta_part_es = ?, rocsta_part_en = ?, donor_vehicle_es = ?, donor_vehicle_en = ?, donor_ref = ?, type = ?, difficulty = ?, motor = ?, verified = ?, confirmations = ?, notes_es = ?, notes_en = ?, category = ?
     WHERE id = ?`,
  );

  try {
    stmt.run(
      rocsta_part_es,
      rocsta_part_en,
      donor_vehicle_es,
      donor_vehicle_en,
      donor_ref,
      type,
      difficulty,
      motor,
      verified ? 1 : 0,
      confirmations || 0,
      notes_es || null,
      notes_en || null,
      category,
      id,
    );
    res.json({ id, message: "Compatibilidad actualizada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/admin/compatibilities/:id/verify", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT verified FROM compatibilities WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "No encontrado" });

  const nextVal = existing.verified === 1 ? 0 : 1;
  db.prepare("UPDATE compatibilities SET verified = ? WHERE id = ?").run(nextVal, id);
  res.json({ id, verified: Boolean(nextVal), message: "Estado de verificación cambiado" });
});

app.post("/api/admin/members", (req, res) => {
  let { id, name, country, avatar_color, contributions, speciality, joined_year } = req.body;
  if (!name) return res.status(400).json({ error: "El nombre es obligatorio" });

  if (!id) {
    const count = db.prepare("SELECT COUNT(*) as c FROM members").get().c;
    id = `cm-${String(count + 1).padStart(3, "0")}`;
  }

  const stmt = db.prepare(
    `INSERT INTO members (id, name, country, avatar_color, contributions, speciality, joined_year)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  try {
    stmt.run(
      id,
      name,
      country || "🌍",
      avatar_color || "bg-rocsta-green text-white",
      contributions || 0,
      speciality || "",
      joined_year || 2024,
    );
    res.status(201).json({ id, message: "Miembro creado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/members/:id", (req, res) => {
  const { id } = req.params;
  const { name, country, avatar_color, contributions, speciality, joined_year } = req.body;
  if (!name) return res.status(400).json({ error: "El nombre es obligatorio" });

  const existing = db.prepare("SELECT id FROM members WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Miembro no encontrado" });

  const stmt = db.prepare(
    `UPDATE members
     SET name = ?, country = ?, avatar_color = ?, contributions = ?, speciality = ?, joined_year = ?
     WHERE id = ?`,
  );
  try {
    stmt.run(
      name,
      country || "🌍",
      avatar_color || "bg-rocsta-green text-white",
      contributions || 0,
      speciality || "",
      joined_year || 2024,
      id,
    );
    res.json({ id, message: "Miembro actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin: Parts CRUD ─────────────────────────────────
app.post("/api/admin/parts", (req, res) => {
  let {
    id,
    name_es,
    name_en,
    category,
    description_es,
    description_en,
    oem,
    equiv,
    status,
    motor,
    notes_es,
    notes_en,
    refs,
  } = req.body;

  if (!name_es || !name_en || !category || !description_es || !description_en || !oem || !motor) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  if (!id) {
    const last = db
      .prepare(
        "SELECT id FROM parts WHERE id LIKE 'p-%' ORDER BY CAST(SUBSTR(id, 3) AS INTEGER) DESC LIMIT 1",
      )
      .get();
    let nextNum = 1;
    if (last) {
      const match = last.id.match(/^p-(\d+)$/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    id = `p-${String(nextNum).padStart(3, "0")}`;
  }

  const stmt = db.prepare(
    `INSERT INTO parts (id, name_es, name_en, category, description_es, description_en, oem, equiv, status, motor, notes_es, notes_en, refs)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  try {
    stmt.run(
      id,
      name_es,
      name_en,
      category,
      description_es,
      description_en,
      oem,
      JSON.stringify(equiv || []),
      status || "unverified",
      motor,
      notes_es || null,
      notes_en || null,
      JSON.stringify(refs || []),
    );
    res.status(201).json({ id, message: "Parte creada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/parts/:id", (req, res) => {
  const { id } = req.params;
  const {
    name_es,
    name_en,
    category,
    description_es,
    description_en,
    oem,
    equiv,
    status,
    motor,
    notes_es,
    notes_en,
    refs,
  } = req.body;

  if (!name_es || !name_en || !category || !description_es || !description_en || !oem || !motor) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const existing = db.prepare("SELECT id FROM parts WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Parte no encontrada" });

  const stmt = db.prepare(
    `UPDATE parts
     SET name_es = ?, name_en = ?, category = ?, description_es = ?, description_en = ?, oem = ?, equiv = ?, status = ?, motor = ?, notes_es = ?, notes_en = ?, refs = ?
     WHERE id = ?`,
  );

  try {
    stmt.run(
      name_es,
      name_en,
      category,
      description_es,
      description_en,
      oem,
      JSON.stringify(equiv || []),
      status || "unverified",
      motor,
      notes_es || null,
      notes_en || null,
      JSON.stringify(refs || []),
      id,
    );
    res.json({ id, message: "Parte actualizada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admin/parts/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT id FROM parts WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Parte no encontrada" });
  db.prepare("DELETE FROM parts WHERE id = ?").run(id);
  res.json({ message: "Parte borrada" });
});

// ─── Admin: Guides CRUD ──────────────────────────────────
app.post("/api/admin/guides", (req, res) => {
  let {
    id,
    slug,
    title_es,
    title_en,
    description_es,
    description_en,
    level,
    time,
    image,
    motor,
    category,
    tools,
    steps,
    tags,
    contributions,
  } = req.body;

  if (
    !slug ||
    !title_es ||
    !title_en ||
    !description_es ||
    !description_en ||
    !level ||
    !time ||
    !motor ||
    !category
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  if (!id) {
    const last = db
      .prepare(
        "SELECT id FROM guides WHERE id LIKE 'g-%' ORDER BY CAST(SUBSTR(id, 3) AS INTEGER) DESC LIMIT 1",
      )
      .get();
    let nextNum = 1;
    if (last) {
      const match = last.id.match(/^g-(\d+)$/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    id = `g-${String(nextNum).padStart(3, "0")}`;
  }

  const stmt = db.prepare(
    `INSERT INTO guides (id, slug, title_es, title_en, description_es, description_en, level, time, image, motor, category, tools, steps, tags, contributions)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  try {
    stmt.run(
      id,
      slug,
      title_es,
      title_en,
      description_es,
      description_en,
      level,
      time,
      image || null,
      motor,
      category,
      JSON.stringify(tools || []),
      JSON.stringify(steps || []),
      JSON.stringify(tags || []),
      contributions || 0,
    );
    res.status(201).json({ id, message: "Guía creada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/guides/:id", (req, res) => {
  const { id } = req.params;
  const {
    slug,
    title_es,
    title_en,
    description_es,
    description_en,
    level,
    time,
    image,
    motor,
    category,
    tools,
    steps,
    tags,
    contributions,
  } = req.body;

  if (
    !slug ||
    !title_es ||
    !title_en ||
    !description_es ||
    !description_en ||
    !level ||
    !time ||
    !motor ||
    !category
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const existing = db.prepare("SELECT id FROM guides WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Guía no encontrada" });

  const stmt = db.prepare(
    `UPDATE guides
     SET slug = ?, title_es = ?, title_en = ?, description_es = ?, description_en = ?, level = ?, time = ?, image = ?, motor = ?, category = ?, tools = ?, steps = ?, tags = ?, contributions = ?
     WHERE id = ?`,
  );

  try {
    stmt.run(
      slug,
      title_es,
      title_en,
      description_es,
      description_en,
      level,
      time,
      image || null,
      motor,
      category,
      JSON.stringify(tools || []),
      JSON.stringify(steps || []),
      JSON.stringify(tags || []),
      contributions || 0,
      id,
    );
    res.json({ id, message: "Guía actualizada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin: Problems CRUD ─────────────────────────────────
app.post("/api/admin/problems", (req, res) => {
  let {
    id,
    title_es,
    title_en,
    severity,
    motor,
    km,
    symptom_es,
    symptom_en,
    cause_es,
    cause_en,
    solution_es,
    solution_en,
    cost,
    difficulty,
    category,
    reports,
  } = req.body;

  if (
    !title_es ||
    !title_en ||
    !severity ||
    !motor ||
    !km ||
    !symptom_es ||
    !symptom_en ||
    !cause_es ||
    !cause_en ||
    !solution_es ||
    !solution_en ||
    !cost ||
    !difficulty ||
    !category
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  if (!id) {
    const last = db
      .prepare(
        "SELECT id FROM problems WHERE id LIKE 'pr-%' ORDER BY CAST(SUBSTR(id, 4) AS INTEGER) DESC LIMIT 1",
      )
      .get();
    let nextNum = 1;
    if (last) {
      const match = last.id.match(/^pr-(\d+)$/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    id = `pr-${String(nextNum).padStart(3, "0")}`;
  }

  const stmt = db.prepare(
    `INSERT INTO problems (id, title_es, title_en, severity, motor, km, symptom_es, symptom_en, cause_es, cause_en, solution_es, solution_en, cost, difficulty, category, reports)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  try {
    stmt.run(
      id,
      title_es,
      title_en,
      severity,
      motor,
      km,
      symptom_es,
      symptom_en,
      cause_es,
      cause_en,
      solution_es,
      solution_en,
      cost,
      difficulty,
      category,
      reports || 0,
    );
    res.status(201).json({ id, message: "Problema creado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/problems/:id", (req, res) => {
  const { id } = req.params;
  const {
    title_es,
    title_en,
    severity,
    motor,
    km,
    symptom_es,
    symptom_en,
    cause_es,
    cause_en,
    solution_es,
    solution_en,
    cost,
    difficulty,
    category,
    reports,
  } = req.body;

  if (
    !title_es ||
    !title_en ||
    !severity ||
    !motor ||
    !km ||
    !symptom_es ||
    !symptom_en ||
    !cause_es ||
    !cause_en ||
    !solution_es ||
    !solution_en ||
    !cost ||
    !difficulty ||
    !category
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const existing = db.prepare("SELECT id FROM problems WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Problema no encontrado" });

  const stmt = db.prepare(
    `UPDATE problems
     SET title_es = ?, title_en = ?, severity = ?, motor = ?, km = ?, symptom_es = ?, symptom_en = ?, cause_es = ?, cause_en = ?, solution_es = ?, solution_en = ?, cost = ?, difficulty = ?, category = ?, reports = ?
     WHERE id = ?`,
  );

  try {
    stmt.run(
      title_es,
      title_en,
      severity,
      motor,
      km,
      symptom_es,
      symptom_en,
      cause_es,
      cause_en,
      solution_es,
      solution_en,
      cost,
      difficulty,
      category,
      reports || 0,
      id,
    );
    res.json({ id, message: "Problema actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admin/problems/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT id FROM problems WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Problema no encontrado" });
  db.prepare("DELETE FROM problem_confirmations WHERE problem_id = ?").run(id);
  db.prepare("DELETE FROM problems WHERE id = ?").run(id);
  res.json({ message: "Problema borrado" });
});

// ─── Admin: Gallery CRUD ─────────────────────────────────
app.post("/api/admin/gallery", upload.single("photo"), async (req, res) => {
  let { id, owner, year, motor, country, verified } = req.body;
  if (!owner) return res.status(400).json({ error: "El propietario es obligatorio" });
  if (!id) {
    const last = db
      .prepare(
        "SELECT id FROM gallery WHERE id LIKE 'gal-%' ORDER BY CAST(SUBSTR(id, 5) AS INTEGER) DESC LIMIT 1",
      )
      .get();
    let nextNum = 1;
    if (last) {
      const match = last.id.match(/^gal-(\d+)$/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    id = `gal-${String(nextNum).padStart(3, "0")}`;
  }
  let imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.existing_image || "";
  if (!imagePath) return res.status(400).json({ error: "Se requiere una foto" });
  try {
    if (req.file) {
      const compressed = await compressToWebp(join(__dirname, "..", "uploads", req.file.filename));
      imagePath = `/uploads/${compressed.split(/[\\/]/).pop()}`;
    }
    db.prepare(
      "INSERT INTO gallery (id, image, year, motor, country, owner, verified) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).run(id, imagePath, year || "", motor || "ambos", country || "", owner, verified ? 1 : 0);
    res.status(201).json({ id, message: "Entrada de galería creada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/gallery/:id", upload.single("photo"), async (req, res) => {
  const { id } = req.params;
  const { owner, year, motor, country, verified, existing_image } = req.body;
  if (!owner) return res.status(400).json({ error: "El propietario es obligatorio" });
  const existing = db.prepare("SELECT id FROM gallery WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Entrada no encontrada" });
  let imagePath = req.file ? `/uploads/${req.file.filename}` : existing_image;
  try {
    if (req.file) {
      const compressed = await compressToWebp(join(__dirname, "..", "uploads", req.file.filename));
      imagePath = `/uploads/${compressed.split(/[\\/]/).pop()}`;
    }
    db.prepare(
      "UPDATE gallery SET image = ?, year = ?, motor = ?, country = ?, owner = ?, verified = ? WHERE id = ?",
    ).run(imagePath, year || "", motor || "ambos", country || "", owner, verified ? 1 : 0, id);
    res.json({ id, message: "Entrada de galería actualizada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admin/gallery/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT id FROM gallery WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Entrada no encontrada" });
  db.prepare("DELETE FROM gallery WHERE id = ?").run(id);
  res.json({ message: "Entrada de galería borrada" });
});

// ─── Admin: delete ──────────────────────────────────────
app.delete("/api/admin/compatibilities/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT id FROM compatibilities WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "No encontrado" });
  db.prepare("DELETE FROM confirmations WHERE compatibility_id = ?").run(id);
  db.prepare("DELETE FROM compatibilities WHERE id = ?").run(id);
  res.json({ message: "Borrado" });
});

app.delete("/api/admin/confirmations/:id", (req, res) => {
  const { id } = req.params;
  const existing = db
    .prepare("SELECT id, compatibility_id FROM confirmations WHERE id = ?")
    .get(id);
  if (!existing) return res.status(404).json({ error: "Confirmación no encontrada" });
  db.prepare("DELETE FROM confirmations WHERE id = ?").run(id);
  db.prepare(
    "UPDATE compatibilities SET confirmations = MAX(0, confirmations - 1) WHERE id = ?",
  ).run(existing.compatibility_id);
  res.json({ message: "Confirmación eliminada" });
});

app.delete("/api/admin/submissions/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT id FROM submissions WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "No encontrado" });
  db.prepare("DELETE FROM submissions WHERE id = ?").run(id);
  res.json({ message: "Borrado" });
});

app.delete("/api/admin/members/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT id FROM members WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "No encontrado" });
  db.prepare("DELETE FROM members WHERE id = ?").run(id);
  res.json({ message: "Borrado" });
});

app.delete("/api/admin/problem_confirmations/:id", (req, res) => {
  const { id } = req.params;
  const existing = db
    .prepare("SELECT id, problem_id FROM problem_confirmations WHERE id = ?")
    .get(id);
  if (!existing) return res.status(404).json({ error: "Reporte no encontrado" });
  db.prepare("DELETE FROM problem_confirmations WHERE id = ?").run(id);
  db.prepare("UPDATE problems SET reports = MAX(0, reports - 1) WHERE id = ?").run(
    existing.problem_id,
  );
  res.json({ message: "Reporte eliminado" });
});

app.delete("/api/admin/guides/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT id FROM guides WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Guía no encontrada" });
  db.prepare("DELETE FROM guides WHERE id = ?").run(id);
  res.json({ message: "Guía borrada" });
});

app.delete("/api/admin/forum/threads/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT id FROM forum_threads WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Hilo no encontrado" });
  db.prepare("DELETE FROM forum_threads WHERE id = ?").run(id);
  res.json({ message: "Hilo eliminado" });
});

// ─── Admin page ─────────────────────────────────────────
app.get("/admin", (req, res) => {
  res.sendFile(join(__dirname, "admin.html"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "La imagen supera el límite de 10 MB."
        : "No se pudo procesar el archivo.";
    return res.status(400).json({ error: message });
  }
  if (err?.message?.includes("Tipo de archivo") || err?.message?.includes("Extensión")) {
    return res.status(400).json({ error: err.message });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido." });
  }
  console.error("Unhandled error:", err?.message || err);
  res.status(500).json({ error: "Error interno del servidor." });
});

async function cleanupOrphanUploads() {
  const fs = await import("fs/promises");
  const uploadsDir = join(__dirname, "..", "uploads");
  let entries;
  try {
    entries = await fs.readdir(uploadsDir, { withFileTypes: true });
  } catch {
    return;
  }
  const referenced = new Set(
    db
      .prepare("SELECT image FROM gallery WHERE image LIKE '/uploads/%'")
      .all()
      .map((row) => row.image.split("/").pop()),
  );
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const entry of entries) {
    if (!entry.isFile() || referenced.has(entry.name)) continue;
    const fullPath = join(uploadsDir, entry.name);
    try {
      const stat = await fs.stat(fullPath);
      if (stat.mtimeMs < cutoff) await fs.unlink(fullPath);
    } catch {
      /* ignore */
    }
  }
}

cleanupOrphanUploads().catch((err) => console.error("Upload cleanup error:", err.message));

app.get("/healthz", (req, res) => {
  try {
    getDb().prepare("SELECT 1").get();
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "error" });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Rocsta API running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});

// ─── Graceful shutdown ──────────────────────────
let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${signal} recibido, cerrando el servidor...`);
  server.close(() => {
    try {
      closeDb();
      console.log("Base de datos cerrada. Hasta luego.");
      process.exit(0);
    } catch (err) {
      console.error("Error al cerrar la base de datos:", err.message);
      process.exit(1);
    }
  });
  setTimeout(() => {
    console.error("Cierre forzado tras 10s.");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
