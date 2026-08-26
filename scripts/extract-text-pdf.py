"""Extract embedded text from PDFs with OCR text layers.

This script extracts text that is already embedded in the PDF (from OCR tools
like Adobe Acrobat, ABBYY, etc.) without re-running OCR. It uses PyMuPDF to
read the text layer directly.

For PDFs without embedded text, it falls back to rendering pages and running
RapidOCR (same as ocr-manual.py).

Usage:
    python scripts/extract-text-pdf.py --pdf <path> --out <file.jsonl> [--start N] [--end N] [--dpi 200]

Output format (one JSON line per page):
    {"page": <index>, "text": "<extracted text>"}
"""
import argparse
import json
import os

import fitz


def extract_embedded_text(doc, page_idx: int) -> str:
    """Extract text directly from the PDF text layer."""
    page = doc.load_page(page_idx)
    text = page.get_text("text")
    return text.strip()


def ocr_fallback(pdf_path: str, page_idx: int, dpi: int = 200) -> str:
    """Fall back to RapidOCR for pages without embedded text."""
    try:
        import numpy as np
        from rapidocr_onnxruntime import RapidOCR
    except ImportError:
        print(f"  WARNING: RapidOCR not available, skipping OCR for page {page_idx}")
        return ""

    engine = RapidOCR()
    doc = fitz.open(pdf_path)
    page = doc.load_page(page_idx)
    pix = page.get_pixmap(dpi=dpi)
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
    if pix.n == 4:
        img = img[..., :3]
    result = engine(img)
    if isinstance(result, tuple):
        result = result[0]
    text = "\n".join(item[1] for item in result) if result else ""
    doc.close()
    return text


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract text from OCR PDFs")
    parser.add_argument("--pdf", required=True, help="Path to the PDF file")
    parser.add_argument("--out", required=True, help="Output .jsonl file")
    parser.add_argument("--start", type=int, default=0, help="Start page (0-indexed, inclusive)")
    parser.add_argument("--end", type=int, default=None, help="End page (0-indexed, exclusive)")
    parser.add_argument("--dpi", type=int, default=200, help="DPI for OCR fallback")
    parser.add_argument("--force-ocr", action="store_true", help="Force OCR even if text layer exists")
    args = parser.parse_args()

    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)

    # Resume support: skip pages already processed
    done: set[int] = set()
    if os.path.exists(args.out):
        with open(args.out, encoding="utf-8") as fh:
            for line in fh:
                if '"page":' in line:
                    try:
                        entry = json.loads(line)
                        done.add(entry["page"])
                    except (json.JSONDecodeError, KeyError):
                        pass

    doc = fitz.open(args.pdf)
    total_pages = doc.page_count
    end = args.end if args.end is not None else total_pages

    print(f"PDF: {args.pdf} ({total_pages} pages)")
    print(f"Processing pages {args.start} to {end}")
    print(f"Already processed: {len(done)} pages")

    with open(args.out, "a", encoding="utf-8") as fh:
        for i in range(args.start, min(end, total_pages)):
            if i in done:
                print(f"  skip {i} (already done)")
                continue

            # Try embedded text first
            text = ""
            if not args.force_ocr:
                text = extract_embedded_text(doc, i)

            # Fall back to OCR if no embedded text
            if not text:
                print(f"  page {i}: no embedded text, running OCR...")
                text = ocr_fallback(args.pdf, i, args.dpi)
            else:
                print(f"  page {i}: extracted {len(text)} chars from text layer")

            entry = {"page": i, "text": text}
            fh.write(json.dumps(entry, ensure_ascii=False) + "\n")
            fh.flush()

    doc.close()
    print(f"DONE -> {args.out}")


if __name__ == "__main__":
    main()
