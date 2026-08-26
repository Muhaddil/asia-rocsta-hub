/**
 * Aggregates OCR page text (JSONL produced by scripts/extract-text-pdf.py) into
 * public/manual/am102-parts-text.json, the search corpus for the parts catalog
 * fallback search.
 *
 * Usage:
 *   node scripts/build-parts-text.mjs <chunks-dir> [--out public/manual/am102-parts-text.json]
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";

const chunksDir = resolve(
  process.argv[2] ?? "C:/Users/naike/AppData/Local/Temp/opencode/parts_ocr",
);
const outFlag = process.argv.indexOf("--out");
const outPath = resolve(
  outFlag !== -1 ? process.argv[outFlag + 1] : "public/manual/am102-parts-text.json",
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
