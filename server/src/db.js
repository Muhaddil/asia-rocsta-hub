import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "data.db");

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema();
    runMigrations();
    seedIfEmpty();
  }
  return db;
}

export function closeDb() {
  if (!db) return;
  try {
    db.close();
  } finally {
    db = undefined;
  }
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT '🌍',
      avatar_color TEXT NOT NULL DEFAULT 'bg-rocsta-green text-white',
      contributions INTEGER NOT NULL DEFAULT 0,
      speciality TEXT NOT NULL DEFAULT '',
      joined_year INTEGER NOT NULL DEFAULT 2024
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('comp','part','guide','problem','bug','partwrong')),
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      data TEXT DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS compatibilities (
      id TEXT PRIMARY KEY,
      rocsta_part_es TEXT NOT NULL,
      rocsta_part_en TEXT NOT NULL,
      donor_vehicle_es TEXT NOT NULL,
      donor_vehicle_en TEXT NOT NULL,
      donor_ref TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('directo','adaptación')),
      difficulty TEXT NOT NULL CHECK(difficulty IN ('Fácil','Media','Alta')),
      motor TEXT NOT NULL CHECK(motor IN ('F8','R2','ambos')),
      verified INTEGER NOT NULL DEFAULT 0,
      confirmations INTEGER NOT NULL DEFAULT 0,
      notes_es TEXT,
      notes_en TEXT,
      category TEXT NOT NULL CHECK(category IN ('engine','transmission','suspension','electrical','brakes','tires','body'))
    );

    CREATE TABLE IF NOT EXISTS confirmations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      compatibility_id TEXT NOT NULL REFERENCES compatibilities(id),
      ip TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS parts (
      id TEXT PRIMARY KEY,
      name_es TEXT NOT NULL,
      name_en TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('engine','transmission','suspension','electrical','brakes','tires','body')),
      description_es TEXT NOT NULL,
      description_en TEXT NOT NULL,
      oem TEXT NOT NULL,
      equiv TEXT DEFAULT '[]',
      status TEXT NOT NULL CHECK(status IN ('verified','mod','unverified')),
      motor TEXT NOT NULL CHECK(motor IN ('F8','R2','ambos')),
      notes_es TEXT,
      notes_en TEXT,
      refs TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      image TEXT NOT NULL,
      year TEXT DEFAULT '',
      motor TEXT DEFAULT 'ambos',
      country TEXT DEFAULT '',
      owner TEXT NOT NULL,
      verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS problems (
      id TEXT PRIMARY KEY,
      title_es TEXT NOT NULL,
      title_en TEXT NOT NULL,
      severity TEXT NOT NULL CHECK(severity IN ('critical','warn','info')),
      motor TEXT NOT NULL CHECK(motor IN ('F8','R2','ambos')),
      km TEXT NOT NULL,
      symptom_es TEXT NOT NULL,
      symptom_en TEXT NOT NULL,
      cause_es TEXT NOT NULL,
      cause_en TEXT NOT NULL,
      solution_es TEXT NOT NULL,
      solution_en TEXT NOT NULL,
      cost TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('Fácil','Media','Alta')),
      category TEXT NOT NULL CHECK(category IN ('engine','transmission','suspension','electrical','brakes','tires','body')),
      reports INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS problem_confirmations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      problem_id TEXT NOT NULL REFERENCES problems(id),
      ip TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS guides (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      title_es TEXT NOT NULL,
      title_en TEXT NOT NULL,
      description_es TEXT NOT NULL,
      description_en TEXT NOT NULL,
      level TEXT NOT NULL CHECK(level IN ('Principiante','Intermedio','Avanzado')),
      time TEXT NOT NULL,
      image TEXT,
      motor TEXT NOT NULL CHECK(motor IN ('F8','R2','ambos')),
      category TEXT NOT NULL CHECK(category IN ('engine','transmission','suspension','electrical','brakes','tires','body')),
      tools TEXT DEFAULT '[]',
      steps TEXT DEFAULT '[]',
      tags TEXT DEFAULT '[]',
      contributions INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS forum_threads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL CHECK(category IN ('general','mechanical','electrical','body','marketplace')),
      author_name TEXT NOT NULL,
      user_id INTEGER REFERENCES forum_users(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved' CHECK(status IN ('pending','approved','rejected')),
      approved_by INTEGER REFERENCES forum_users(id) ON DELETE SET NULL,
      approved_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      views INTEGER NOT NULL DEFAULT 0,
      replies_count INTEGER NOT NULL DEFAULT 0,
      last_activity TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS forum_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thread_id INTEGER NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
      author_name TEXT NOT NULL,
      user_id INTEGER REFERENCES forum_users(id) ON DELETE SET NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved' CHECK(status IN ('pending','approved','rejected')),
      approved_by INTEGER REFERENCES forum_users(id) ON DELETE SET NULL,
      approved_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS forum_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin','moderator','user')),
      display_name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS forum_sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES forum_users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    );
  `);

  // ─── Indexes ────────────────────────────────────
  // Elimina duplicados históricos antes de crear los índices únicos.
  db.exec(`
    DELETE FROM confirmations
    WHERE ip IS NOT NULL
      AND id NOT IN (
        SELECT MIN(id) FROM confirmations WHERE ip IS NOT NULL GROUP BY compatibility_id, ip
      );
    DELETE FROM problem_confirmations
    WHERE ip IS NOT NULL
      AND id NOT IN (
        SELECT MIN(id) FROM problem_confirmations WHERE ip IS NOT NULL GROUP BY problem_id, ip
      );
  `);
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_confirmations_compatibility ON confirmations(compatibility_id);
    CREATE INDEX IF NOT EXISTS idx_confirmations_ip ON confirmations(ip);
    CREATE INDEX IF NOT EXISTS idx_confirmations_compat_ip ON confirmations(compatibility_id, ip);
    CREATE UNIQUE INDEX IF NOT EXISTS uq_confirmations_compat_ip
      ON confirmations(compatibility_id, ip) WHERE ip IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at);
    CREATE INDEX IF NOT EXISTS idx_gallery_created ON gallery(created_at);
    CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category);
    CREATE INDEX IF NOT EXISTS idx_compatibilities_category ON compatibilities(category);
    CREATE INDEX IF NOT EXISTS idx_problem_confirmations_problem ON problem_confirmations(problem_id);
    CREATE INDEX IF NOT EXISTS idx_problem_confirmations_ip ON problem_confirmations(ip);
    CREATE INDEX IF NOT EXISTS idx_problem_confirmations_problem_ip ON problem_confirmations(problem_id, ip);
    CREATE UNIQUE INDEX IF NOT EXISTS uq_problem_confirmations_problem_ip
      ON problem_confirmations(problem_id, ip) WHERE ip IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_forum_threads_category ON forum_threads(category);
    CREATE INDEX IF NOT EXISTS idx_forum_threads_last_activity ON forum_threads(last_activity);
    CREATE INDEX IF NOT EXISTS idx_forum_posts_thread ON forum_posts(thread_id);
    CREATE INDEX IF NOT EXISTS idx_forum_sessions_user ON forum_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_forum_sessions_expires ON forum_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_forum_threads_status ON forum_threads(status);
    CREATE INDEX IF NOT EXISTS idx_forum_posts_status ON forum_posts(status);

    CREATE TABLE IF NOT EXISTS forum_view_log (
      thread_id INTEGER NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
      ip TEXT NOT NULL,
      user_id INTEGER,
      last_viewed TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (thread_id, ip)
    );
    CREATE INDEX IF NOT EXISTS idx_forum_view_log_thread ON forum_view_log(thread_id);

    CREATE TABLE IF NOT EXISTS forum_likes (
      thread_id INTEGER NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES forum_users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (thread_id, user_id)
    );
    CREATE INDEX IF NOT EXISTS idx_forum_likes_thread ON forum_likes(thread_id);
    CREATE INDEX IF NOT EXISTS idx_forum_likes_user ON forum_likes(user_id);

    CREATE TABLE IF NOT EXISTS forum_post_likes (
      post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES forum_users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (post_id, user_id)
    );
    CREATE INDEX IF NOT EXISTS idx_forum_post_likes_post ON forum_post_likes(post_id);
  `);
}

function runMigrations() {
  // Migraciones de columnas anteriores
  try {
    db.exec("ALTER TABLE submissions ADD COLUMN data TEXT DEFAULT '{}'");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE submissions ADD COLUMN description TEXT NOT NULL DEFAULT ''");
  } catch (e) {}

  // ← Añade esto: recrea la tabla si el CHECK constraint está desactualizado
  const tableInfo = db
    .prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='submissions'")
    .get();

  const needsUpdate = tableInfo && !tableInfo.sql.includes("'partwrong'");

  if (needsUpdate) {
    console.log("Migrando tabla submissions con nuevos tipos...");
    db.exec(`
      BEGIN;

      CREATE TABLE submissions_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('comp','part','guide','problem','bug','partwrong')),
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        data TEXT DEFAULT '{}',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      INSERT INTO submissions_new
        SELECT id, type, username, email, title, description, data, created_at
        FROM submissions
        WHERE type IN ('comp','part','guide','problem','bug','partwrong');

      DROP TABLE submissions;
      ALTER TABLE submissions_new RENAME TO submissions;

      COMMIT;
    `);
    console.log("Migración completada.");
  }

  // Migración: convertir herramientas de guías al nuevo formato
  migrateGuideToolsToNewFormat();

  // Migraciones del foro: columnas de status y user_id
  try {
    db.exec("ALTER TABLE forum_threads ADD COLUMN status TEXT NOT NULL DEFAULT 'approved'");
  } catch (e) {}
  try {
    db.exec(
      "ALTER TABLE forum_threads ADD COLUMN user_id INTEGER REFERENCES forum_users(id) ON DELETE SET NULL",
    );
  } catch (e) {}
  try {
    db.exec(
      "ALTER TABLE forum_threads ADD COLUMN approved_by INTEGER REFERENCES forum_users(id) ON DELETE SET NULL",
    );
  } catch (e) {}
  try {
    db.exec("ALTER TABLE forum_threads ADD COLUMN approved_at TEXT");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE forum_posts ADD COLUMN status TEXT NOT NULL DEFAULT 'approved'");
  } catch (e) {}
  try {
    db.exec(
      "ALTER TABLE forum_posts ADD COLUMN user_id INTEGER REFERENCES forum_users(id) ON DELETE SET NULL",
    );
  } catch (e) {}
  try {
    db.exec(
      "ALTER TABLE forum_posts ADD COLUMN approved_by INTEGER REFERENCES forum_users(id) ON DELETE SET NULL",
    );
  } catch (e) {}
  try {
    db.exec("ALTER TABLE forum_posts ADD COLUMN approved_at TEXT");
  } catch (e) {}

  // Crear admin por defecto si no existe
  createDefaultAdmin();
}

function migrateGuideToolsToNewFormat() {
  const guides = db.prepare("SELECT id, tools FROM guides").all();

  for (const guide of guides) {
    try {
      const tools = JSON.parse(guide.tools || "[]");

      // Verificar si las herramientas ya tienen el nuevo formato
      if (tools.length > 0 && tools[0].name) {
        continue; // Ya tiene el nuevo formato
      }

      // Convertir del formato antiguo {es, en} al nuevo {name: {es, en}, quantity, image}
      const newTools = tools.map((tool) => ({
        name: {
          es: tool.es || "",
          en: tool.en || "",
        },
        quantity: 1,
        image: undefined,
      }));

      db.prepare("UPDATE guides SET tools = ? WHERE id = ?").run(
        JSON.stringify(newTools),
        guide.id,
      );

      console.log(`Migrated guide ${guide.id} tools to new format`);
    } catch (e) {
      console.error(`Error migrating guide ${guide.id}:`, e);
    }
  }
}

function createDefaultAdmin() {
  const username = (process.env.FORUM_ADMIN_USERNAME || "").trim().toLowerCase();
  const password = process.env.FORUM_ADMIN_PASSWORD || "";
  if (!username || password.length < 12) {
    return;
  }
  if (!/^[a-z0-9_-]+$/.test(username)) {
    console.warn(
      "FORUM_ADMIN_USERNAME ignorado: solo se permiten letras, números, guiones y guiones bajos",
    );
    return;
  }

  const existing = db.prepare("SELECT id FROM forum_users WHERE username = ?").get(username);
  if (!existing) {
    const hash = bcrypt.hashSync(password, 12);
    db.prepare(
      "INSERT INTO forum_users (username, password_hash, role, display_name) VALUES (?, ?, ?, ?)",
    ).run(username, hash, "admin", "Admin");
    console.log(`Forum admin "${username}" created from environment variables.`);
  }
}

function seedIfEmpty() {
  const count = db.prepare("SELECT COUNT(*) as c FROM compatibilities").get();
  const partsCount = db.prepare("SELECT COUNT(*) as c FROM parts").get();

  // ---- COMPATIBILITIES ----
  if (count.c === 0) {
    const jsonPath = join(__dirname, "..", "..", "src", "data", "compatibility.json");

    try {
      const raw = fs.readFileSync(jsonPath, "utf8");
      const compsData = JSON.parse(raw);

      const insertComp = db.prepare(
        `INSERT INTO compatibilities (id, rocsta_part_es, rocsta_part_en, donor_vehicle_es, donor_vehicle_en, donor_ref, type, difficulty, motor, verified, confirmations, notes_es, notes_en, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );

      db.transaction((rows) => {
        for (const item of rows) {
          insertComp.run(
            item.id,
            item.rocstaPart?.es || "",
            item.rocstaPart?.en || "",
            item.donorVehicle?.es || "",
            item.donorVehicle?.en || "",
            item.donorRef || "",
            item.type || "directo",
            item.difficulty || "Media",
            item.motor || "ambos",
            item.verified ? 1 : 0,
            item.confirmations || 0,
            item.notes?.es || null,
            item.notes?.en || null,
            item.category || "engine",
          );
        }
      })(compsData);

      console.log(`Seeded ${compsData.length} compatibilities`);
    } catch (err) {
      console.error("Compatibility seed failed:", err);
    }
  }

  // ---- PARTS ----
  if (partsCount.c === 0) {
    const partsJsonPath = join(__dirname, "..", "..", "src", "data", "parts.json");

    try {
      const raw = fs.readFileSync(partsJsonPath, "utf8");
      const partsData = JSON.parse(raw);

      const insertPart = db.prepare(
        `INSERT INTO parts (
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
    refs
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );

      db.transaction((rows) => {
        for (const item of rows) {
          insertPart.run(
            item.id,
            item.name?.es || "",
            item.name?.en || "",
            item.category || "engine",
            item.description?.es || "",
            item.description?.en || "",
            item.oem || "",
            JSON.stringify(item.equiv || []),
            item.status || "unverified",
            item.motor || "ambos",
            item.notes?.es || null,
            item.notes?.en || null,
            JSON.stringify(item.refs || []),
          );
        }
      })(partsData);

      console.log(`Seeded ${partsData.length} parts`);
    } catch (err) {
      console.error("Parts seed failed:", err);
    }
  }

  // ---- PROBLEMS ----
  const problemsCount = db.prepare("SELECT COUNT(*) as c FROM problems").get();
  if (problemsCount.c === 0) {
    const problemsJsonPath = join(__dirname, "..", "..", "src", "data", "problems.json");

    try {
      const raw = fs.readFileSync(problemsJsonPath, "utf8");
      const problemsData = JSON.parse(raw);

      const insertProblem = db.prepare(
        `INSERT INTO problems (id, title_es, title_en, severity, motor, km, symptom_es, symptom_en, cause_es, cause_en, solution_es, solution_en, cost, difficulty, category, reports)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );

      db.transaction((rows) => {
        for (const item of rows) {
          insertProblem.run(
            item.id,
            item.title?.es || "",
            item.title?.en || "",
            item.severity || "info",
            item.motor || "ambos",
            item.km || "",
            item.symptom?.es || "",
            item.symptom?.en || "",
            item.cause?.es || "",
            item.cause?.en || "",
            item.solution?.es || "",
            item.solution?.en || "",
            item.cost || "",
            item.difficulty || "Media",
            item.category || "engine",
            item.reports || 0,
          );
        }
      })(problemsData);

      console.log(`Seeded ${problemsData.length} problems`);
    } catch (err) {
      console.error("Problems seed failed:", err);
    }
  }

  // ---- GUIDES ----
  const guidesCount = db.prepare("SELECT COUNT(*) as c FROM guides").get();
  if (guidesCount.c === 0) {
    const insertGuide = db.prepare(
      `INSERT INTO guides (id, slug, title_es, title_en, description_es, description_en, level, time, image, motor, category, tools, steps, tags, contributions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );

    const guidesData = [
      {
        id: "g-001",
        slug: "correa-distribucion-r2",
        title_es: "Sustitución de la correa de distribución (Mazda R2)",
        title_en: "Timing Belt Replacement (Mazda R2)",
        description_es:
          "Guía paso a paso para alinear las marcas de distribución del Mazda R2 2.2D y ajustar el tensor.",
        description_en:
          "Step-by-step guide to align the timing marks on the Mazda R2 2.2D and adjust the tensioner.",
        level: "Intermedio",
        time: "2.5 h",
        image: "/assets/guide-timing-belt.jpg",
        motor: "R2",
        category: "engine",
        tools: JSON.stringify([
          {
            name: {
              es: "Llave de carraca con vasos de 10, 12, 14 y 17 mm",
              en: "Ratchet wrench with 10, 12, 14 and 17 mm sockets",
            },
            quantity: 1,
          },
          {
            name: { es: "Llave dinamométrica (20-120 Nm)", en: "Torque wrench (20-120 Nm)" },
            quantity: 1,
          },
          {
            name: {
              es: "Pasador de bloqueo de bomba inyectora (o broca de 6 mm)",
              en: "Injection pump locking pin (or 6 mm drill bit)",
            },
            quantity: 1,
          },
          {
            name: {
              es: "Destornillador plano grande o palanca",
              en: "Large flat-head screwdriver or pry bar",
            },
            quantity: 1,
          },
          {
            name: {
              es: "Rotulador permanente o corrector blanco (para marcar)",
              en: "Permanent marker or white correction pen (for marking)",
            },
            quantity: 1,
          },
        ]),
        steps: JSON.stringify([
          {
            title: {
              es: "Paso 1: Desmontaje de componentes periféricos",
              en: "Step 1: Remove peripheral components",
            },
            content: {
              es: "Desconectar la batería por seguridad. Vaciar parcialmente el refrigerante y retirar el radiador para ganar espacio de trabajo óptimo en el frente del motor. Desmontar las correas de accesorios (alternador, bomba de dirección) y retirar el ventilador viscoso junto con su polea (4 tuercas de 10 mm).",
              en: "Disconnect the battery for safety. Partially drain the coolant and remove the radiator to gain optimal working space at the front of the engine. Remove the accessory belts (alternator, power steering pump) and remove the viscous fan together with its pulley (4 x 10 mm nuts).",
            },
          },
          {
            title: {
              es: "Paso 2: Retirada de las tapas de distribución",
              en: "Step 2: Remove the timing covers",
            },
            content: {
              es: "Quitar los tornillos de 10 mm de las carcasas plásticas superior e inferior de la distribución. Examinar el estado de las juntas de goma de las carcasas y reemplazarlas si están agrietadas o empapadas en aceite.",
              en: "Remove the 10 mm screws from the upper and lower plastic timing covers. Inspect the condition of the rubber gaskets on the covers and replace them if they are cracked or soaked in oil.",
            },
          },
          {
            title: {
              es: "Paso 3: Alineación de las marcas de tiempo",
              en: "Step 3: Align the timing marks",
            },
            content: {
              es: "Girar el cigüeñal manualmente en el sentido de las agujas del reloj usando un vaso de 17 mm en el perno de la polea del cigüeñal. Alinear las marcas de sincronización:\n1. Marca del árbol de levas alineada con la muesca de la culata a las 12 en punto.\n2. Marca del cigüeñal alineada con la flecha del bloque a las 12 en punto.\n3. Insertar una broca o pasador de 6 mm en el orificio de la polea de la bomba inyectora para bloquearla contra el soporte.",
              en: "Rotate the crankshaft clockwise by hand using a 17 mm socket on the crankshaft pulley bolt. Align the timing marks:\n1. Camshaft mark aligned with the cylinder head notch at 12 o'clock.\n2. Crankshaft mark aligned with the block arrow at 12 o'clock.\n3. Insert a 6 mm drill bit or pin into the injection pump pulley hole to lock it against the bracket.",
            },
          },
          {
            title: {
              es: "Paso 4: Aflojar el tensor y retirar la correa vieja",
              en: "Step 4: Loosen the tensioner and remove the old belt",
            },
            content: {
              es: "Aflojar el perno del rodillo tensor (14 mm). Empujar el rodillo tensor hacia atrás para comprimir el muelle y apretar ligeramente el perno para mantenerlo bloqueado en la posición floja. Deslizar la correa de distribución hacia afuera con cuidado de no mover los engranajes.",
              en: "Loosen the tensioner pulley bolt (14 mm). Push the tensioner pulley back to compress the spring and lightly tighten the bolt to keep it locked in the loose position. Slide the timing belt off, being careful not to move the gears.",
            },
          },
          {
            title: {
              es: "Paso 5: Instalación de la nueva correa y tensión",
              en: "Step 5: Install the new belt and tension",
            },
            content: {
              es: "Instalar la correa comenzando por el cigüeñal, pasando por el rodillo guía, el engranaje de la bomba inyectora, el árbol de levas y finalmente sobre el rodillo tensor. Asegurarse de que el lado de tracción (derecho) quede completamente tenso.\nAflojar el perno del tensor para permitir que el muelle aplique presión automática. Girar el cigüeñal dos vueltas completas para asentar la correa. Verificar que todas las marcas sigan perfectamente alineadas y apretar el perno del rodillo tensor a 38 Nm.",
              en: "Install the belt starting at the crankshaft, passing around the guide pulley, the injection pump gear, the camshaft, and finally over the tensioner pulley. Make sure the traction side (right side) is completely taut.\nLoosen the tensioner bolt to allow the spring to apply automatic pressure. Rotate the crankshaft two full turns to seat the belt. Verify that all marks remain perfectly aligned and tighten the tensioner pulley bolt to 38 Nm.",
            },
          },
          {
            title: { es: "Paso 6: Reensamblado completo", en: "Step 6: Complete reassembly" },
            content: {
              es: "Montar las tapas de la distribución (apriete suave a 9 Nm). Volver a instalar la polea del cigüeñal, polea de ventilador, correas auxiliares (ajustar la tensión adecuada) y el radiador. Rellenar refrigerante, purgar el circuito y arrancar el motor para verificar el funcionamiento suave.",
              en: "Install the timing covers (gently tighten to 9 Nm). Reinstall the crankshaft pulley, fan pulley, accessory belts (adjust to proper tension) and the radiator. Refill coolant, bleed the system and start the engine to verify smooth operation.",
            },
          },
        ]),
        tags: JSON.stringify(["distribución", "mantenimiento", "mazda r2", "motor"]),
        contributions: 124,
      },
      {
        id: "g-002",
        slug: "mantenimiento-cubos-manuales",
        title_es: "Mantenimiento de los cubos de bloqueo manual delanteros",
        title_en: "Manual Front Locking Hub Maintenance",
        description_es:
          "Limpieza, engrase y reconstrucción de los cubos libres (free-wheel hubs) delanteros mecánicos AVM / Warn.",
        description_en:
          "Cleaning, greasing and rebuilding of mechanical AVM / Warn front free-wheel hubs.",
        level: "Intermedio",
        time: "1.0 h",
        image: "/assets/guide-4wd-hubs.jpg",
        motor: "ambos",
        category: "transmission",
        tools: JSON.stringify([
          {
            name: {
              es: "Llave Allen de 4 mm (para tapa del cubo)",
              en: "4 mm Allen key (for hub cover)",
            },
            quantity: 1,
          },
          {
            name: { es: "Llave de vaso o estrella de 12 mm", en: "12 mm socket or wrench" },
            quantity: 1,
          },
          {
            name: {
              es: "Alicates para circlips (anillos elásticos)",
              en: "Circlip pliers (snap ring pliers)",
            },
            quantity: 1,
          },
          {
            name: { es: "Desengrasante / Limpiador de frenos", en: "Degreaser / Brake cleaner" },
            quantity: 1,
          },
          {
            name: {
              es: "Grasa de litio EP2 de alta calidad",
              en: "High-quality EP2 lithium grease",
            },
            quantity: 1,
          },
          { name: { es: "Trapos limpios", en: "Clean rags" }, quantity: 1 },
        ]),
        steps: JSON.stringify([
          {
            title: {
              es: "Paso 1: Desmontaje de la tapa del cubo",
              en: "Step 1: Remove the hub cover",
            },
            content: {
              es: "Poner el vehículo en superficie plana y aplicar freno de mano. Girar el dial del cubo a la posición 'FREE'. Retirar los 6 tornillos Allen pequeños de la tapa externa. Retirar la tapa con cuidado; si está pegada, dar pequeños golpes con un martillo de goma.",
              en: "Park the vehicle on a level surface and engage the parking brake. Turn the hub dial to the 'FREE' position. Remove the 6 small Allen screws from the outer cover. Carefully remove the cover; if it is stuck, tap it gently with a rubber mallet.",
            },
          },
          {
            title: {
              es: "Paso 2: Extracción del cuerpo interno",
              en: "Step 2: Remove the internal body",
            },
            content: {
              es: "Retirar el circlip grande del extremo del palier utilizando los alicates de anillos elásticos. A continuación, retirar los 6 pernos de 12 mm que sujetan el cuerpo del cubo al buje de la rueda. Retirar todo el conjunto mecánico interno deslizándolo hacia afuera.",
              en: "Remove the large circlip from the end of the axle shaft using snap ring pliers. Then remove the 6 x 12 mm bolts securing the hub body to the wheel hub. Slide the entire internal mechanical assembly outward.",
            },
          },
          {
            title: {
              es: "Paso 3: Limpieza profunda y desengrase",
              en: "Step 3: Deep cleaning and degreasing",
            },
            content: {
              es: "Sumergir todas las piezas mecánicas (engranaje deslizante, muelle, anillo estriado) en desengrasante o limpiador de frenos. Limpiar con un cepillo hasta eliminar por completo la grasa vieja reseca, óxido, tierra y partículas metálicas. Dejar secar completamente al aire.",
              en: "Submerge all mechanical parts (sliding gear, spring, splined ring) in degreaser or brake cleaner. Scrub with a brush until all old dried grease, rust, dirt and metal particles are completely removed. Allow to air dry completely.",
            },
          },
          {
            title: { es: "Paso 4: Inspección de desgaste", en: "Step 4: Wear inspection" },
            content: {
              es: "Verificar visualmente que los dientes de engranaje no estén astillados o excesivamente redondeados. Asegurarse de que el muelle interno mantenga una buena tensión y que el dial de selección gire libremente entre FREE y LOCK sin atascos.",
              en: "Visually check that the gear teeth are not chipped or excessively rounded. Make sure the internal spring maintains good tension and that the selector dial rotates freely between FREE and LOCK without binding.",
            },
          },
          {
            title: {
              es: "Paso 5: Engrase moderado e instalación",
              en: "Step 5: Moderate greasing and installation",
            },
            content: {
              es: "Aplicar una capa **fina** de grasa EP2 en los dientes deslizantes y estrías. **¡Atención!** No rellenar el cubo de grasa en exceso; demasiada grasa densa impedirá que el muelle empuje el engranaje correctamente en invierno y causará fallos de tracción 4x4.\nDeslizar el cuerpo interno en el buje, apretar los 6 pernos de 12 mm a 25 Nm en estrella. Instalar el circlip del palier.",
              en: "Apply a **thin** layer of EP2 grease to the sliding teeth and splines. **Warning!** Do not overfill the hub with grease; too much thick grease will prevent the spring from pushing the gear correctly in winter and will cause 4x4 traction failure.\nSlide the internal body into the hub, tighten the 6 x 12 mm bolts to 25 Nm in a star pattern. Install the axle circlip.",
            },
          },
          {
            title: { es: "Paso 6: Ajuste final y prueba", en: "Step 6: Final adjustment and test" },
            content: {
              es: "Colocar la junta nueva de papel o aplicar una fina película de formador de juntas. Montar la tapa externa y apretar los tornillos Allen a 5 Nm. Probar el funcionamiento levantando la rueda del suelo: en FREE la rueda debe girar libremente sin arrastrar el palier; en LOCK, al girar la rueda debe girar el palier delantero correspondiente.",
              en: "Install a new paper gasket or apply a thin film of gasket maker. Mount the outer cover and tighten the Allen screws to 5 Nm. Test operation by lifting the wheel off the ground: in FREE the wheel should spin freely without turning the axle shaft; in LOCK, turning the wheel should rotate the corresponding front axle shaft.",
            },
          },
        ]),
        tags: JSON.stringify(["4x4", "transmisión", "cubos libres", "warn", "avm"]),
        contributions: 42,
      },
      {
        id: "g-003",
        slug: "limpieza-valvula-egr",
        title_es: "Anulación o limpieza de la válvula EGR (Mazda R2)",
        title_en: "EGR Valve Cleaning or Removal (Mazda R2)",
        description_es:
          "Cómo descarbonizar la válvula de recirculación de gases de escape para reducir humo negro y recuperar potencia.",
        description_en:
          "How to decarburize the exhaust gas recirculation valve to reduce black smoke and restore power.",
        level: "Principiante",
        time: "45 min",
        image: null,
        motor: "R2",
        category: "engine",
        tools: JSON.stringify([
          {
            name: { es: "Llave fija o de estrella de 12 mm", en: "12 mm open-end or box wrench" },
            quantity: 1,
          },
          { name: { es: "Cepillo metálico pequeño", en: "Small wire brush" }, quantity: 1 },
          {
            name: {
              es: "Spray descarbonizante o limpiador de hornos",
              en: "Decarbonizing spray or oven cleaner",
            },
            quantity: 1,
          },
          { name: { es: "Destornillador plano", en: "Flat-head screwdriver" }, quantity: 1 },
        ]),
        steps: JSON.stringify([
          {
            title: { es: "Paso 1: Localización de la EGR", en: "Step 1: Locate the EGR valve" },
            content: {
              es: "La válvula EGR se encuentra en el lado derecho del colector de admisión del motor R2. Es un platillo metálico de vacío con un tubo conectado que viene del colector de escape.",
              en: "The EGR valve is located on the right side of the intake manifold of the R2 engine. It is a metal vacuum disc with a connected pipe coming from the exhaust manifold.",
            },
          },
          {
            title: { es: "Paso 2: Desmontaje de la válvula", en: "Step 2: Remove the valve" },
            content: {
              es: "Desconectar la manguera fina de vacío de la parte superior. Quitar las dos tuercas de 12 mm que sujetan la válvula a la brida del colector de admisión. Retirar la válvula con cuidado de no romper la junta metálica original.",
              en: "Disconnect the thin vacuum hose from the top. Remove the two 12 mm nuts securing the valve to the intake manifold flange. Carefully remove the valve without damaging the original metal gasket.",
            },
          },
          {
            title: {
              es: "Paso 3: Limpieza de la carbonilla",
              en: "Step 3: Clean the carbon deposits",
            },
            content: {
              es: "Rociar el interior de la válvula con limpiador descarbonizante. Dejar actuar durante 10 minutos. Raspar la carbonilla acumulada con un destornillador plano y el cepillo metálico hasta que la aguja interna pueda subir y bajar libremente al empujarla manualmente.",
              en: "Spray the inside of the valve with decarbonizing cleaner. Let it sit for 10 minutes. Scrape off the accumulated carbon deposits with a flat-head screwdriver and wire brush until the internal needle can move up and down freely when pushed by hand.",
            },
          },
          {
            title: {
              es: "Paso 4: Montaje (o anulación opcional)",
              en: "Step 4: Reassembly (or optional removal)",
            },
            content: {
              es: "Si se desea mantener original: volver a montar la válvula con su junta metálica limpia y apretar a 20 Nm. Si se opta por anularla (bajo responsabilidad en base a normativa local): fabricar una pletina ciega de chapa de aluminio de 1.5mm con la misma forma de la junta metálica pero sin el orificio central, colocándola entre el tubo de escape y la EGR, además de taponar la manguera de vacío con un rodamiento pequeño.",
              en: "To keep it original: reassemble the valve with the clean metal gasket and tighten to 20 Nm. To remove it (at your own risk based on local regulations): make a blind plate from 1.5 mm aluminum sheet with the same shape as the metal gasket but without the center hole, placing it between the exhaust pipe and the EGR, and plug the vacuum hose with a small bearing.",
            },
          },
        ]),
        tags: JSON.stringify(["admisión", "motor", "egr", "humo negro"]),
        contributions: 31,
      },
    ];

    db.transaction((rows) => {
      for (const item of rows) {
        insertGuide.run(
          item.id,
          item.slug,
          item.title_es,
          item.title_en,
          item.description_es,
          item.description_en,
          item.level,
          item.time,
          item.image,
          item.motor,
          item.category,
          item.tools,
          item.steps,
          item.tags,
          item.contributions,
        );
      }
    })(guidesData);

    console.log(`Seeded ${guidesData.length} guides`);
  }
}
