import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getApiBase, type ApiGalleryEntry } from "@/lib/api";

const API_BASE = getApiBase();

function imageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;
const DOUBLE_CLICK_ZOOM = 2;
const SWIPE_THRESHOLD = 60;
const MAX_DOTS = 15;

interface View {
  zoom: number;
  x: number;
  y: number;
}

const INITIAL_VIEW: View = { zoom: 1, x: 0, y: 0 };

function clampView(v: View, width: number, height: number): View {
  if (v.zoom <= 1) return { zoom: v.zoom, x: 0, y: 0 };
  const maxX = (width * (v.zoom - 1)) / 2;
  const maxY = (height * (v.zoom - 1)) / 2;
  return {
    zoom: v.zoom,
    x: Math.max(-maxX, Math.min(maxX, v.x)),
    y: Math.max(-maxY, Math.min(maxY, v.y)),
  };
}

/** Cambia el zoom manteniendo fijo el punto (cx, cy), medido desde el centro del contenedor. */
function applyZoom(
  v: View,
  nextZoom: number,
  cx: number,
  cy: number,
  width: number,
  height: number,
): View {
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
  const ratio = zoom / v.zoom;
  return clampView(
    { zoom, x: cx - (cx - v.x) * ratio, y: cy - (cy - v.y) * ratio },
    width,
    height,
  );
}

interface GalleryLightboxProps {
  entries: ApiGalleryEntry[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
}

export function GalleryLightbox({ entries, open, initialIndex, onClose }: GalleryLightboxProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [view, setView] = useState<View>(INITIAL_VIEW);
  const [isInteracting, setIsInteracting] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const viewRef = useRef(view);
  viewRef.current = view;

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDist = useRef<number | null>(null);
  const pan = useRef<{ sx: number; sy: number; vx: number; vy: number } | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const getSize = useCallback(() => {
    if (container) {
      const r = container.getBoundingClientRect();
      return { width: r.width, height: r.height };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  }, [container]);

  // Sincroniza el índice cada vez que se abre o cambia la foto inicial.
  useEffect(() => {
    if (open) setCurrentIndex(initialIndex);
  }, [open, initialIndex]);

  // Reinicia el zoom al cambiar de foto.
  useEffect(() => {
    setView(INITIAL_VIEW);
  }, [currentIndex, open]);

  // Precarga las fotos vecinas.
  useEffect(() => {
    if (!open) return;
    [currentIndex - 1, currentIndex + 1].forEach((i) => {
      const e = entries[i];
      if (e) new Image().src = imageUrl(e.image);
    });
  }, [open, currentIndex, entries]);

  const resetView = useCallback(() => setView(INITIAL_VIEW), []);

  const zoomBy = useCallback(
    (delta: number) => {
      const { width, height } = getSize();
      setView((v) => applyZoom(v, v.zoom + delta, 0, 0, width, height));
    },
    [getSize],
  );

  const handleZoomIn = useCallback(() => zoomBy(ZOOM_STEP), [zoomBy]);
  const handleZoomOut = useCallback(() => zoomBy(-ZOOM_STEP), [zoomBy]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(entries.length - 1, i + 1));
  }, [entries.length]);

  // Rueda del ratón: listener nativo no pasivo para poder usar preventDefault.
  useEffect(() => {
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const cx = e.clientX - (rect.left + rect.width / 2);
      const cy = e.clientY - (rect.top + rect.height / 2);
      const factor = Math.exp(-e.deltaY * 0.0015);
      setView((v) => applyZoom(v, v.zoom * factor, cx, cy, rect.width, rect.height));
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [container]);

  // Gestos: arrastrar, pellizcar y deslizar para cambiar de foto.
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      pinchDist.current = Math.hypot(a.x - b.x, a.y - b.y);
      pan.current = null;
      swipeStart.current = null;
      setIsInteracting(true);
    } else if (pointers.current.size === 1) {
      swipeStart.current = { x: e.clientX, y: e.clientY };
      if (viewRef.current.zoom > 1) {
        pan.current = {
          sx: e.clientX,
          sy: e.clientY,
          vx: viewRef.current.x,
          vy: viewRef.current.y,
        };
        setIsInteracting(true);
      }
    }
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      const rect = e.currentTarget.getBoundingClientRect();

      if (pointers.current.size >= 2 && pinchDist.current) {
        const [a, b] = Array.from(pointers.current.values());
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const scale = dist / pinchDist.current;
        pinchDist.current = dist;
        const cx = (a.x + b.x) / 2 - (rect.left + rect.width / 2);
        const cy = (a.y + b.y) / 2 - (rect.top + rect.height / 2);
        setView((v) => applyZoom(v, v.zoom * scale, cx, cy, rect.width, rect.height));
        return;
      }

      if (pan.current) {
        const { sx, sy, vx, vy } = pan.current;
        const nextX = vx + (e.clientX - sx);
        const nextY = vy + (e.clientY - sy);
        setView((v) => clampView({ zoom: v.zoom, x: nextX, y: nextY }, rect.width, rect.height));
      }
    },
    [],
  );

  const handlePointerEnd = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.delete(e.pointerId);

      if (pointers.current.size < 2) pinchDist.current = null;

      if (pointers.current.size === 1) {
        // Quedó un dedo tras pellizcar: continuar arrastrando desde ahí.
        const [rest] = Array.from(pointers.current.values());
        pan.current = {
          sx: rest.x,
          sy: rest.y,
          vx: viewRef.current.x,
          vy: viewRef.current.y,
        };
        return;
      }

      if (pointers.current.size === 0) {
        pan.current = null;
        setIsInteracting(false);

        const start = swipeStart.current;
        swipeStart.current = null;
        if (start && viewRef.current.zoom <= 1 && e.type === "pointerup") {
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) goToNext();
            else goToPrev();
          }
        }
      }
    },
    [goToNext, goToPrev],
  );

  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (viewRef.current.zoom !== 1) {
      setView(INITIAL_VIEW);
      return;
    }
    const cx = e.clientX - (rect.left + rect.width / 2);
    const cy = e.clientY - (rect.top + rect.height / 2);
    setView((v) => applyZoom(v, DOUBLE_CLICK_ZOOM, cx, cy, rect.width, rect.height));
  }, []);

  // Atajos de teclado.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goToPrev();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "0":
          resetView();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goToPrev, goToNext, handleZoomIn, handleZoomOut, resetView]);

  const entry = entries[currentIndex];
  if (!entry) return null;

  const { zoom, x, y } = view;
  const controlBtn =
    "h-8 w-8 rounded-md bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70";
  const navBtn =
    "absolute top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="!fixed !inset-0 !top-0 !left-0 !translate-x-0 !translate-y-0 !w-screen !max-w-none sm:!max-w-none !h-[100dvh] !rounded-none !p-0 !gap-0 !border-0 bg-black/95 [&>button]:hidden"
      >
        <DialogTitle className="sr-only">
          {t("gallery.lightbox.title")} {currentIndex + 1}/{entries.length}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t("gallery.viewPhoto", {
            year: String(entry.year),
            owner: entry.owner || entry.country || "Rocsta",
          })}
        </DialogDescription>

        <div className="relative h-full w-full overflow-hidden">
          {/* Zona de la imagen: ocupa todo el espacio y deja margen para barras y pie */}
          <div
            ref={setContainer}
            className="absolute inset-0 flex items-center justify-center overflow-hidden select-none touch-none px-4 pt-16 pb-24 sm:px-16"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onDoubleClick={handleDoubleClick}
            style={{ cursor: zoom > 1 ? (isInteracting ? "grabbing" : "grab") : "zoom-in" }}
          >
            <img
              src={imageUrl(entry.image)}
              alt={`Asia Rocsta ${entry.year}`}
              draggable={false}
              className={[
                "h-full w-full object-contain will-change-transform",
                isInteracting ? "" : "transition-transform duration-150",
              ].join(" ")}
              style={{ transform: `translate(${x}px, ${y}px) scale(${zoom})` }}
            />
          </div>

          {/* Contador */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <span className="text-white/70 text-sm font-medium bg-black/50 rounded-md px-2.5 py-1">
              {currentIndex + 1} / {entries.length}
            </span>
          </div>

          {/* Controles de zoom y cierre */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            <button
              type="button"
              aria-label={t("gallery.zoomOut")}
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              className={`${controlBtn} disabled:opacity-30`}
            >
              <ZoomOut className="size-4" />
            </button>
            <span className="text-white/70 text-xs font-mono bg-black/50 rounded-md px-2 py-1 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              aria-label={t("gallery.zoomIn")}
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              className={`${controlBtn} disabled:opacity-30`}
            >
              <ZoomIn className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t("gallery.resetZoom")}
              onClick={resetView}
              className={controlBtn}
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t("gallery.close")}
              onClick={onClose}
              className={`${controlBtn} ml-1`}
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Navegación */}
          {currentIndex > 0 && (
            <button
              type="button"
              aria-label={t("gallery.prevPhoto")}
              onClick={goToPrev}
              className={`${navBtn} left-3`}
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
          {currentIndex < entries.length - 1 && (
            <button
              type="button"
              aria-label={t("gallery.nextPhoto")}
              onClick={goToNext}
              className={`${navBtn} right-3`}
            >
              <ChevronRight className="size-5" />
            </button>
          )}

          {/* Pie con datos; no bloquea los gestos sobre la imagen */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-white font-bold text-sm truncate">
                  Rocsta {entry.year} · {entry.motor}
                </div>
                <div className="text-white/60 text-xs mt-0.5 truncate">
                  {entry.country && `${entry.country} — `}
                  {entry.owner}
                </div>
              </div>
              {entries.length > 1 && entries.length <= MAX_DOTS && (
                <div className="pointer-events-auto flex items-center gap-1">
                  {entries.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={t("gallery.goToPhoto", { index: idx + 1 })}
                      aria-current={idx === currentIndex ? "true" : undefined}
                      onClick={() => setCurrentIndex(idx)}
                      className={[
                        "h-1.5 rounded-full transition-all",
                        idx === currentIndex
                          ? "w-4 bg-white"
                          : "w-1.5 bg-white/40 hover:bg-white/60",
                      ].join(" ")}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}