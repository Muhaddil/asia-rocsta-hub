"""Build the Spanish AM102 manual PDF: original scanned page (left) + Spanish text (right, 2 columns).

Usage:
  python scripts/build-manual-es-pdf-imaged.py [corpus.json] [original.pdf] [out.pdf]
"""
import json
import sys
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent
CORPUS = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / "public/manual/am102-text.es.json")
ORIGINAL = sys.argv[2] if len(sys.argv) > 2 else str(ROOT / "public/manual/am102.pdf")
OUT = sys.argv[3] if len(sys.argv) > 3 else str(ROOT / "public/manual/am102-es.pdf")

FONT_SIZE = 8
LINE_HEIGHT = 10
PAGE_W, PAGE_H = 842, 595  # A4 landscape
MARGIN = 20
HEADER_H = 26
TEXT_X = 425
RIGHT_W = PAGE_W - TEXT_X - MARGIN  # right block width
IMG_MAX_W = TEXT_X - MARGIN - 4
IMG_MAX_H = PAGE_H - HEADER_H - MARGIN
COL_GAP = 6
COL_W = (RIGHT_W - COL_GAP) // 2
LINES_PER_COL = int((PAGE_H - HEADER_H - MARGIN) / LINE_HEIGHT)
HEADER_LEFT = "AM102 - Manual de servicio (traducci\u00f3n autom\u00e1tica OCR)"


def sanitize(text):
    out = []
    for ch in text:
        code = ord(ch)
        if code in (0x0A, 0x09):
            out.append(ch)
        elif 0x20 <= code <= 0x7E or 0xA0 <= code <= 0xFF:
            out.append(ch)
        else:
            out.append(" ")
    return "".join(out)


def wrap(text, width):
    lines = []
    for para in text.split("\n"):
        if not para.strip():
            lines.append("")
            continue
        words = para.split(" ")
        current = ""
        for word in words:
            candidate = (current + " " + word).strip()
            if not current or fitz.get_text_length(candidate, fontname="helv", fontsize=FONT_SIZE) <= width:
                current = candidate
            else:
                lines.append(current)
                current = word
        lines.append(current)
    return lines


def add_header(page, label):
    page.insert_text((MARGIN, 16), HEADER_LEFT, fontname="helv", fontsize=FONT_SIZE)
    w = fitz.get_text_length(label, fontname="helv", fontsize=FONT_SIZE)
    page.insert_text((PAGE_W - MARGIN - w, 16), label, fontname="helv", fontsize=FONT_SIZE)


def draw_text(page, lines, x0, y0, y1, x1=None):
    """Draw `lines` into one or more columns in region (x0,y0)-(x1 or x0+COL_W, y1)."""
    x1 = x1 or x0 + COL_W
    x = x0
    y = y0
    for line in lines:
        if y + LINE_HEIGHT > y1:
            x += COL_W + COL_GAP
            y = y0
        if x + COL_W > x1 + 0.1:
            return False
        page.insert_text((x, y + FONT_SIZE), line, fontname="helv", fontsize=FONT_SIZE)
        y += LINE_HEIGHT
    return True


def image_bytes(doc, page_index):
    page = doc[page_index]
    imgs = page.get_images(full=True)
    if not imgs:
        return None
    xref = imgs[0][0]
    try:
        info = doc.extract_image(xref)
        if info["ext"] in ("png", "jpg", "jpeg"):
            return info["image"]
    except Exception:
        pass
    pix = fitz.Pixmap(doc, xref)
    if pix.colorspace and pix.colorspace.name not in ("DeviceGray", "DeviceRGB"):
        pix = fitz.Pixmap(fitz.csRGB, pix)
    return pix.tobytes("png")


def main():
    corpus = json.loads(Path(CORPUS).read_text(encoding="utf-8"))
    by_page = {entry["page"]: entry.get("text", "") for entry in corpus}

    src = fitz.open(ORIGINAL)
    out = fitz.open()
    total = 0

    for i in range(src.page_count):
        text = sanitize(by_page.get(i, ""))
        img = image_bytes(src, i)

        page = out.new_page(width=PAGE_W, height=PAGE_H)
        total += 1
        add_header(page, f"Hoja del manual original: {i + 1}")

        if img:
            rect = fitz.Rect(MARGIN, HEADER_H, MARGIN + IMG_MAX_W, HEADER_H + IMG_MAX_H)
            pix = fitz.Pixmap(img)
            scale = min(rect.width / pix.width, rect.height / pix.height)
            w, h = pix.width * scale, pix.height * scale
            x = MARGIN + (IMG_MAX_W - w) / 2
            y = HEADER_H + (IMG_MAX_H - h) / 2
            page.insert_image(fitz.Rect(x, y, x + w, y + h), stream=img)

        if not text.strip():
            continue

        lines = wrap(text, COL_W)
        capacity = LINES_PER_COL * 2
        placed = draw_text(
            page,
            lines[:capacity],
            TEXT_X,
            HEADER_H,
            PAGE_H - MARGIN,
            PAGE_W - MARGIN,
        )

        rest = lines[capacity:]
        while rest:
            page = out.new_page(width=PAGE_W, height=PAGE_H)
            total += 1
            add_header(page, f"Hoja del manual original: {i + 1} (cont.)")
            wide = wrap("\n".join(rest), (PAGE_W - 2 * MARGIN - COL_GAP) // 2)
            placed = draw_text(
                page,
                wide,
                MARGIN,
                HEADER_H,
                PAGE_H - MARGIN,
                PAGE_W - MARGIN,
            )
            rest = wide[LINES_PER_COL * 2 :] if not placed else []

        if (i + 1) % 50 == 0:
            print(f"  ... {i + 1}/{src.page_count} (output {total} pages)")

    out.save(OUT, deflate=True)
    print(f"OK {OUT} written ({total} output pages for {src.page_count} source pages)")
    src.close()
    out.close()


if __name__ == "__main__":
    main()
