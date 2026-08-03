import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  FileWarning,
  Maximize2,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

const PDF_URL = `${import.meta.env.BASE_URL}manual/am102.pdf`;

interface ManualPdfViewerProps {
  /** zero-indexed physical page */
  page: number;
  onPageChange: (page: number) => void;
  /** PDF source; defaults to the original scan, can be swapped per language */
  pdfUrl?: string;
}

export function ManualPdfViewer({ page, onPageChange, pdfUrl = PDF_URL }: ManualPdfViewerProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [rendering, setRendering] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
        pdfjs.GlobalWorkerOptions.workerSrc = worker;
        const loadingTask = pdfjs.getDocument({ url: pdfUrl });
        loadingTaskRef.current = loadingTask;
        const doc = await loadingTask.promise;
        if (cancelled) {
          loadingTask.destroy();
          return;
        }
        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setState("ready");
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
          setState("error");
        }
      }
    })();
    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      loadingTaskRef.current?.destroy();
      loadingTaskRef.current = null;
      pdfDocRef.current = null;
    };
  }, [pdfUrl]);

  const renderPage = useCallback(
    async (pageNumber: number) => {
      const doc = pdfDocRef.current;
      const canvas = canvasRef.current;
      if (!doc || !canvas) return;
      try {
        const pdfPage = await doc.getPage(pageNumber + 1);
        const base = pdfPage.getViewport({ scale: 1 });
        const containerWidth = containerRef.current?.clientWidth || 800;
        const maxWidth = fullscreen ? Math.max(containerWidth, 900) : containerWidth;
        const scaleFactor = (maxWidth / base.width) * scale;
        const viewport = pdfPage.getViewport({ scale: scaleFactor });
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        renderTaskRef.current?.cancel();
        setRendering(true);
        try {
          renderTaskRef.current = pdfPage.render({ canvas, viewport });
          await renderTaskRef.current.promise;
        } finally {
          renderTaskRef.current = null;
          setRendering(false);
        }
      } catch (e) {
        if ((e as Error)?.name !== "RenderingCancelledException") setError(String(e));
      }
    },
    [scale, fullscreen],
  );

  useEffect(() => {
    if (state !== "ready") return;
    const raf = requestAnimationFrame(() => void renderPage(page));
    return () => cancelAnimationFrame(raf);
  }, [state, page, renderPage]);

  useEffect(() => {
    if (fullscreen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [fullscreen]);

  const go = (delta: number) => {
    const next = Math.min(Math.max(page + delta, 0), numPages - 1);
    if (next !== page) onPageChange(next);
  };

  const label = (key: string) => t(key);

  if (state === "loading") {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-border bg-card shadow-sm">
        <div className="text-center space-y-3">
          <Loader2 className="mx-auto size-6 animate-spin text-rocsta-green" />
          <p className="text-xs font-bold text-muted-foreground">
            {label("manual.reader.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-border bg-card shadow-sm">
        <div className="text-center space-y-3 max-w-md px-6">
          <FileWarning className="mx-auto size-6 text-rocsta-accent" />
          <p className="text-xs font-bold text-foreground">{label("manual.reader.loadError")}</p>
          <p className="text-[11px] text-muted-foreground break-words">{error}</p>
        </div>
      </div>
    );
  }

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
            onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-card border border-border text-foreground hover:bg-muted transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <span className="font-mono text-[11px] font-bold text-muted-foreground w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
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
          "relative flex justify-center overflow-auto bg-muted/60 p-4",
          fullscreen && "flex-1",
        )}
      >
        {rendering && (
          <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-2.5 py-1 text-[10px] font-bold text-muted-foreground shadow-sm">
            <Loader2 className="size-3 animate-spin" />
          </div>
        )}
        <canvas ref={canvasRef} className="shadow-xl rounded-sm bg-white" />
      </div>
    </div>
  );
}
