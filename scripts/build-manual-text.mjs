/**
 * Aggregates OCR page text (JSONL produced by scripts/ocr-manual.py) into
 * public/manual/am102-text.json, the search + page-text corpus for the
 * interactive AM102 workshop manual reader.
 *
 * Usage:
 *   node scripts/build-manual-text.mjs <chunks-dir> [--out public/manual/am102-text.json]
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, dirname } from "node:fs";
import { join, resolve } from "node:path";

const chunksDir = resolve(
  process.argv[2] ?? "C:/Users/naike/AppData/Local/Temp/opencode/manual_ocr",
);
const outFlag = process.argv.indexOf("--out");
const outPath = resolve(
  outFlag !== -1 ? process.argv[outFlag + 1] : "public/manual/am102-text.json",
);

const rows = [];
for (const file of readdirSync(chunksDir)
  .filter((f) => f.endsWith(".jsonl"))
  .sort()) {
  for (const line of readFileSync(join(chunksDir, file), "utf-8").split("\n")) {
    if (line.trim()) rows.push(JSON.parse(line));
  }
}
rows.sort((a, b) => a.page - b.page);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(rows, null, 0), "utf-8");

console.log(`Wrote ${rows.length} pages -> ${outPath}`);
