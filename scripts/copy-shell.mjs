import { cpSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = resolve(__dirname, "..", "dist", "client");
const shellPath = resolve(clientDir, "_shell.html");
const indexPath = resolve(clientDir, "index.html");
const nojekyllPath = resolve(clientDir, ".nojekyll");

if (existsSync(shellPath)) {
  cpSync(shellPath, indexPath);
  console.log("✓ _shell.html copied to index.html");
} else {
  console.warn("⚠ _shell.html not found, skipping copy");
}

writeFileSync(nojekyllPath, "", "utf-8");
console.log("✓ .nojekyll created");
