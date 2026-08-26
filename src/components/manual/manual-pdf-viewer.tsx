import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  Maximize2,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDF_URL = `${import.meta.env.BASE_URL}manual/am102.pdf`;

interface ManualPdfViewerProps {
  page: number;
  onPageChange: (page: number) => void;
  pdfUrl?: string;
  onPageCountChange?: (count: number) => void;
  highlightQuery?: string;
}

export function ManualPdfViewer({ page, onPageChange, pdfUrl = PDF_URL, onPageCountChange, highlightQuery }: ManualPdfViewerProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [baseWidth, setBaseWidth] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);

  const label = (key: string) => t(key);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) setBaseWidth(w * 0.9);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    onPageCountChange?.(numPages);
  }

  const go = (delta: number) => {
    const next = Math.min(Math.max(page + delta, 0), numPages - 1);
    if (next !== page) onPageChange(next);
  };

  const pageWidth = baseWidth > 0 ? baseWidth * (zoomLevel / 100) : undefined;

  return (
    <div
      ref={containerRef}
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm overflow-hidden",
        fullscreen && "fixed inset-0 z-50 rounded-none border-0 flex flex-col",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={page === 0}
            className="inline-flex h-8 items-center justify-center gap-1 rounded-md bg-card border border-border px-2.5 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="size-3.5" />
            {label("manual.reader.prev")}
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={page >= numPages - 1}
            className="inline-flex h-8 items-center justify-center gap-1 rounded-md bg-card border border-border px-2.5 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
          >
            {label("manual.reader.next")}
            <ChevronRight className="size-3.5" />
          </button>
          <span className="ml-1 font-mono text-xs font-bold text-muted-foreground">
            {page + 1} / {numPages}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(25, z - 25))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-card border border-border text-foreground hover:bg-muted transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <span className="font-mono text-[11px] font-bold text-muted-foreground w-10 text-center">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(300, z + 25))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-card border border-border text-foreground hover:bg-muted transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setFullscreen((f) => !f)}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md border text-foreground transition-colors",
              fullscreen
                ? "bg-rocsta-green text-primary-foreground border-rocsta-green"
                : "bg-card border-border hover:bg-muted",
            )}
            aria-label="Fullscreen"
          >
            <Maximize2 className="size-3.5" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "flex justify-center overflow-auto bg-muted/60 p-4",
          fullscreen && "flex-1",
        )}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex min-h-[420px] items-center justify-center">
              <div className="text-center space-y-3">
                <Loader2 className="mx-auto size-6 animate-spin text-rocsta-green" />
                <p className="text-xs font-bold text-muted-foreground">
                  {label("manual.reader.loading")}
                </p>
              </div>
            </div>
          }
          error={
            <div className="flex min-h-[420px] items-center justify-center">
              <p className="text-xs font-bold text-foreground">{label("manual.reader.loadError")}</p>
            </div>
          }
        >
          <Page
            pageNumber={page + 1}
            width={pageWidth}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            customTextRenderer={highlightQuery ? ({ str }) => {
              const q = highlightQuery.toLowerCase();
              const lower = str.toLowerCase();
              if (!lower.includes(q)) return str;
              const parts: string[] = [];
              let last = 0;
              let idx = lower.indexOf(q);
              while (idx !== -1) {
                if (idx > last) parts.push(str.slice(last, idx));
                parts.push(`<mark style="background:rgba(34,139,34,0.25);border-radius:2px">${str.slice(idx, idx + q.length)}</mark>`);
                last = idx + q.length;
                idx = lower.indexOf(q, last);
              }
              if (last < str.length) parts.push(str.slice(last));
              return parts.join("");
            } : undefined}
            loading={
              <div className="flex min-h-[420px] items-center justify-center">
                <Loader2 className="size-6 animate-spin text-rocsta-green" />
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
}
