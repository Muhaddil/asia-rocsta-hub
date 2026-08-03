import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts } from "pdf-lib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const corpusPath = process.argv[2] ?? resolve(root, "public/manual/am102-text.es.json");
const outPath = process.argv[3] ?? resolve(root, "public/manual/am102-es.pdf");

const FONT_SIZE = 9;
const LINE_HEIGHT = 11.5;
const MARGIN = 40;
const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89; // A4
const HEADER_GAP = 16;

/** Keep only characters representable in WinAnsi (Latin-1 + ASCII). */
function sanitize(text) {
  return text
    .replace(/\r/g, "")
    .split("")
    .map((ch) => {
      const code = ch.codePointAt(0);
      if (code === 0x0a || code === 0x09) return ch;
      if (code >= 0x20 && code <= 0x7e) return ch;
      if (code >= 0xa0 && code <= 0xff) return ch;
      return " ";
    })
    .join("");
}

function wrapLines(font, text, maxWidth) {
  const lines = [];
  const paragraphs = text.replace(/\t+/g, " ").split("\n");
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, FONT_SIZE) <= maxWidth || !current) {
        current = candidate;
      } else {
        lines.push(current);
        current = word;
      }
    }
    lines.push(current);
  }
  return lines;
}

(async () => {
  const corpus = JSON.parse(readFileSync(corpusPath, "utf-8"));
  if (!Array.isArray(corpus)) {
    console.error("✗ Corpus is not an array:", corpusPath);
    process.exit(1);
  }

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const maxWidth = PAGE_WIDTH - MARGIN * 2;
  const maxHeight = PAGE_HEIGHT - MARGIN * 2 - HEADER_GAP;
  const linesPerPage = Math.floor(maxHeight / LINE_HEIGHT);

  for (const entry of corpus) {
    const page = entry.page;
    const text = sanitize(entry.text ?? "");
    const wrapped = wrapLines(font, text, maxWidth);

    const pdfPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN;
    pdfPage.drawText(`AM102 - Manual de servicio (traduccion automatica OCR)`, {
      x: MARGIN,
      y: y - 3,
      size: FONT_SIZE,
      font,
    });
    pdfPage.drawText(`Hoja del manual original: ${page + 1}`, {
      x:
        PAGE_WIDTH -
        MARGIN -
        font.widthOfTextAtSize(`Hoja del manual original: ${page + 1}`, FONT_SIZE),
      y: y - 3,
      size: FONT_SIZE,
      font,
    });
    y -= HEADER_GAP;

    for (let i = 0; i < wrapped.length; i++) {
      if (y < MARGIN) {
        y = PAGE_HEIGHT - MARGIN;
        const extra = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        extra.drawText(`AM102 - Manual de servicio (traduccion automatica OCR) - cont.`, {
          x: MARGIN,
          y: y - 3,
          size: FONT_SIZE,
          font,
        });
        y -= HEADER_GAP;
      }
      pdfPage.drawText(wrapped[i], { x: MARGIN, y, size: FONT_SIZE, font });
      y -= LINE_HEIGHT;
    }
  }

  const bytes = await doc.save();
  writeFileSync(outPath, bytes);
  console.log(`✓ ${outPath} written (${doc.getPageCount()} pages)`);
})().catch((e) => {
  console.error("✗ fatal:", e);
  process.exit(1);
});
