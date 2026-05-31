import { cpSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const shellPath = resolve(__dirname, "..", "dist", "client", "_shell.html");
const indexPath = resolve(__dirname, "..", "dist", "client", "index.html");

if (existsSync(shellPath)) {
  cpSync(shellPath, indexPath);
  console.log("✓ _shell.html copied to index.html");
} else {
  console.warn("⚠ _shell.html not found, skipping copy");
}
