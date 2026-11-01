// Exporta las guías de la base de datos del servidor a datos estáticos versionados.
// Uso: node scripts/export-guides.mjs
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const requireFromServer = createRequire(path.join(root, "server", "package.json"));
const Database = requireFromServer("better-sqlite3");

const dbPath = process.env.DB_PATH || path.join(root, "server", "data.db");
const db = new Database(dbPath, { readonly: true });

const rows = db
  .prepare(
    "SELECT id, slug, title_es, title_en, description_es, description_en, level, time, image, motor, category, tools, steps, tags, contributions FROM guides ORDER BY id",
  )
  .all();

const safeJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const guides = rows.map((row) => ({
  id: row.id,
  slug: row.slug,
  title: { es: row.title_es, en: row.title_en },
  description: { es: row.description_es, en: row.description_en },
  level: row.level,
  time: row.time,
  ...(row.image ? { image: row.image } : {}),
  motor: row.motor,
  category: row.category,
  tools: safeJson(row.tools, []),
  steps: safeJson(row.steps, []),
  tags: safeJson(row.tags, []),
  contributions: row.contributions,
}));

const output = `import type { Guide } from "./types";

// Generado por scripts/export-guides.mjs. No editar a mano.
export const guides: Guide[] = ${JSON.stringify(guides, null, 2)};
`;

writeFileSync(path.join(root, "src", "data", "guides.ts"), output, "utf8");
db.close();
console.log(`Exportadas ${guides.length} guías a src/data/guides.ts`);
