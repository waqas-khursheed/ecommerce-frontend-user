"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { uploadUrl } from "@/lib/http";
import type { Product } from "@/types/product";

// Classic e-commerce hover-to-magnify: a lens box tracks the cursor over the
// image, and a same-size panel flush against the right edge shows that
// region magnified — same pattern as Amazon/Daraz product pages.
const ZOOM = 2.5;
const LENS_SIZE_PCT = 100 / ZOOM; // lens covers 1/ZOOM of the image, so the panel shows it at ZOOM magnification
const PANEL_GAP = 16; // px between the image and the zoom panel

interface ProductGalleryProps {
  product: Product;
  /**
   * Hover-to-magnify side panel. Only enable where there's real room to the
   * right of the image — the full product page, not the narrower Quick View
   * dialog (there's nowhere for a same-size panel to go there).
   */
  enableZoom?: boolean;
}

export function ProductGallery({ product, enableZoom = false }: ProductGalleryProps) {
  const galleryImages = (product.productGalleries ?? []).map((g) => g.image);
  const images = [product.featured_image, product.hovered_image, ...galleryImages].filter(
    (img): img is string => !!img
  );
  const [active, setActive] = useState(images[0]);
  const activeUrl = uploadUrl("products", active);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [lens, setLens] = useState({ xPct: 0, yPct: 0 });
  const [panelSize, setPanelSize] = useState(0);
  const [canFitPanel, setCanFitPanel] = useState(false);

  // Touch browsers can fire a synthetic mouseenter/mousemove on tap even
  // though there's no real cursor — without this check a stray tap could
  // flash the lens box on a phone. `(pointer: fine)` also excludes
  // touch-primary hybrid devices that technically support `hover`.
  const supportsHoverZoom = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const handleMouseEnter = () => {
    if (!enableZoom || !supportsHoverZoom()) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Panel matches the image's own rendered size exactly, and only shows
    // at all if it'll actually fit onscreen to the right — recalculated
    // per-hover so resizing the window between hovers stays correct.
    setPanelSize(rect.width);
    setCanFitPanel(window.innerWidth - rect.right - PANEL_GAP >= rect.width);
    setIsZooming(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!enableZoom || !supportsHoverZoom()) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cursorXPct = ((e.clientX - rect.left) / rect.width) * 100;
    const cursorYPct = ((e.clientY - rect.top) / rect.height) * 100;
    const xPct = Math.min(Math.max(cursorXPct - LENS_SIZE_PCT / 2, 0), 100 - LENS_SIZE_PCT);
    const yPct = Math.min(Math.max(cursorYPct - LENS_SIZE_PCT / 2, 0), 100 - LENS_SIZE_PCT);
    setLens({ xPct, yPct });
  };

  // With background-size at ZOOM*100%, the scrollable range maps 1:1 onto
  // the lens's 0..(100-LENS_SIZE_PCT)% range — keeps what's under the lens
  // exactly in sync with what the panel shows.
  const bgPosX = (lens.xPct / (100 - LENS_SIZE_PCT)) * 100;
  const bgPosY = (lens.yPct / (100 - LENS_SIZE_PCT)) * 100;

  return (
    <div className="relative space-y-3">
      <div
        ref={containerRef}
        className={cn(
          "relative aspect-square overflow-hidden rounded-lg bg-muted",
          enableZoom && "[@media(hover:hover)]:cursor-zoom-in"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        {activeUrl && (
          <Image src={activeUrl} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        )}
        {enableZoom && isZooming && activeUrl && (
          <div
            className="pointer-events-none absolute border-2 border-primary bg-primary/10"
            style={{
              left: `${lens.xPct}%`,
              top: `${lens.yPct}%`,
              width: `${LENS_SIZE_PCT}%`,
              height: `${LENS_SIZE_PCT}%`,
            }}
          />
        )}
      </div>

      {/* position: absolute anchored to this same wrapper (not `fixed`) —
          scrolls naturally with the image instead of staying pinned to a
          viewport position computed at the last mousemove, which would
          visibly drift away from the image the instant the page scrolls. */}
      {enableZoom && isZooming && activeUrl && canFitPanel && (
        <div
          className="pointer-events-none absolute top-0 z-30 hidden overflow-hidden rounded-lg border bg-background shadow-xl lg:block"
          style={{
            left: `calc(100% + ${PANEL_GAP}px)`,
            width: panelSize,
            height: panelSize,
            backgroundImage: `url(${activeUrl})`,
            backgroundSize: `${ZOOM * 100}%`,
            backgroundPosition: `${bgPosX}% ${bgPosY}%`,
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img) => {
            const thumbUrl = uploadUrl("products", img);
            return (
              <button
                key={img}
                type="button"
                onClick={() => setActive(img)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-md border-2",
                  active === img ? "border-primary" : "border-transparent"
                )}
              >
                {thumbUrl && <Image src={thumbUrl} alt="" fill sizes="64px" className="object-cover" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
