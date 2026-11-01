// Copia de seguridad consistente de SQLite con VACUUM INTO.
// Uso: node scripts/backup.js [directorio-destino]
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dbPath = process.env.DB_PATH || path.join(root, "data.db");
const backupDir = process.argv[2] || path.join(root, "backups");

mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const target = path.join(backupDir, `data-${stamp}.db`);

const db = new Database(dbPath, { readonly: true });
db.exec(`VACUUM INTO '${target.replace(/'/g, "''")}'`);
db.close();

console.log(`Copia de seguridad creada: ${target}`);
