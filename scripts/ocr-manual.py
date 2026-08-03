"""OCR pipeline for the scanned Asia Rocsta Workshop Manual (AM102).

Renders PDF pages at 200 DPI, runs RapidOCR (onnxruntime) and writes one
JSON line per page to the output file: {"page": <pdf index>, "text": <ocr text>}.

Usage:
    python scripts/ocr-manual.py --pdf <path> --out <file.jsonl> --start N --end N
"""
import argparse
import json
import os

import numpy as np
import fitz
from rapidocr_onnxruntime import RapidOCR


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", required=True, help="Path to the scanned PDF")
    parser.add_argument("--out", required=True, help="Output .jsonl file")
    parser.add_argument("--start", type=int, required=True)
    parser.add_argument("--end", type=int, required=True, help="Exclusive upper bound")
    args = parser.parse_args()

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    done: set[int] = set()
    if os.path.exists(args.out):
        with open(args.out, encoding="utf-8") as fh:
            done = {int(line.split('"page":', 1)[1].split(",")[0]) for line in fh if '"page":' in line}

    engine = RapidOCR()
    doc = fitz.open(args.pdf)

    with open(args.out, "a", encoding="utf-8") as fh:
        for i in range(args.start, min(args.end, doc.page_count)):
            if i in done:
                print(f"skip {i}", flush=True)
                continue
            pix = doc.load_page(i).get_pixmap(dpi=200)
            img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
            if pix.n == 4:
                img = img[..., :3]
            result = engine(img)
            if isinstance(result, tuple):
                result = result[0]
            text = "\n".join(item[1] for item in result) if result else ""
            fh.write(json.dumps({"page": i, "text": text}, ensure_ascii=False) + "\n")
            fh.flush()
            print(f"page {i} boxes={len(result) if result else 0}", flush=True)

    print("DONE", args.start, args.end)


if __name__ == "__main__":
    main()
