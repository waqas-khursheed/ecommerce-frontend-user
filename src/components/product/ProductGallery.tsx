"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { uploadUrl } from "@/lib/http";
import type { Product } from "@/types/product";

export function ProductGallery({ product }: { product: Product }) {
  const galleryImages = (product.productGalleries ?? []).map((g) => g.image);
  const images = [product.featured_image, product.hovered_image, ...galleryImages].filter(
    (img): img is string => !!img
  );
  const [active, setActive] = useState(images[0]);
  const activeUrl = uploadUrl("products", active);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {activeUrl && (
          <Image src={activeUrl} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        )}
      </div>
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
