import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getApiBase, type ApiGalleryEntry } from "@/lib/api";

const API_BASE = getApiBase();

function imageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

interface GalleryLightboxProps {
  entries: ApiGalleryEntry[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
}

export function GalleryLightbox({ entries, open, initialIndex, onClose }: GalleryLightboxProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragPosStart, setDragPosStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchDistance = useRef<number>(0);
  const lastTouchCenter = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex]);

  const resetView = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const clampPosition = useCallback((x: number, y: number, z: number) => {
    if (z <= 1) return { x: 0, y: 0 };
    const container = containerRef.current;
    if (!container) return { x, y };
    const rect = container.getBoundingClientRect();
    const maxX = (rect.width * (z - 1)) / 2;
    const maxY = (rect.height * (z - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Math.max(MIN_ZOOM, prev - ZOOM_STEP);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((prev) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta));
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (zoom <= 1) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragPosStart({ ...position });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [zoom, position],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      const newPos = clampPosition(dragPosStart.x + dx, dragPosStart.y + dy, zoom);
      setPosition(newPos);
    },
    [isDragging, dragStart, dragPosStart, zoom, clampPosition],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDistance.current = Math.sqrt(dx * dx + dy * dy);
      lastTouchCenter.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const scale = distance / lastTouchDistance.current;
      lastTouchDistance.current = distance;

      setZoom((prev) => {
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev * scale));
        if (next <= 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  }, []);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetView();
    }
  }, [currentIndex, resetView]);

  const goToNext = useCallback(() => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetView();
    }
  }, [currentIndex, entries.length, resetView]);

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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-[100vw] w-screen h-screen p-0 gap-0 border-0 bg-black/95 [&>button]:hidden"
        onPointerDownOutside={onClose}
      >
        <DialogTitle className="sr-only">
          {t("gallery.lightbox.title")} {currentIndex + 1}/{entries.length}
        </DialogTitle>

        <div className="relative w-full h-full flex flex-col">
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <span className="text-white/70 text-sm font-medium bg-black/50 rounded-md px-2.5 py-1">
              {currentIndex + 1} / {entries.length}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              className="h-8 w-8 rounded-md bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors disabled:opacity-30"
            >
              <ZoomOut className="size-4" />
            </button>
            <span className="text-white/70 text-xs font-mono bg-black/50 rounded-md px-2 py-1 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              className="h-8 w-8 rounded-md bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors disabled:opacity-30"
            >
              <ZoomIn className="size-4" />
            </button>
            <button
              onClick={resetView}
              className="h-8 w-8 rounded-md bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-md bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors ml-1"
            >
              <X className="size-4" />
            </button>
          </div>

          {currentIndex > 0 && (
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
          {currentIndex < entries.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="size-5" />
            </button>
          )}

          <div
            ref={containerRef}
            className="flex-1 flex items-center justify-center overflow-hidden select-none"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
          >
            <img
              ref={imageRef}
              src={imageUrl(entry.image)}
              alt={`Asia Rocsta ${entry.year}`}
              draggable={false}
              className="max-w-full max-h-full object-contain transition-transform duration-150"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              }}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-bold text-sm">
                  Rocsta {entry.year} · {entry.motor}
                </div>
                <div className="text-white/60 text-xs mt-0.5">
                  {entry.country && `${entry.country} — `}
                  {entry.owner}
                </div>
              </div>
              {entries.length > 1 && (
                <div className="flex items-center gap-1">
                  {entries.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentIndex(idx);
                        resetView();
                      }}
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
