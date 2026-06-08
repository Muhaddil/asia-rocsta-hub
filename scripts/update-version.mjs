import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf-8"));

const version = {
  version: pkg.version,
  buildDate: new Date().toISOString(),
};

writeFileSync(resolve(root, "public", "version.json"), JSON.stringify(version) + "\n");
console.log(`✓ version.json updated → ${pkg.version}`);
