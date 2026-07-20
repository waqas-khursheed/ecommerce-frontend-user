"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/store/recentlyViewed.store";
import type { Product } from "@/types/product";

// Mounted (invisibly) on the product detail page — records a lightweight
// snapshot of whatever product is being viewed into localStorage so
// RecentlyViewedSection can show it elsewhere without an extra API call.
export function RecordRecentlyViewed({ product }: { product: Product }) {
  const record = useRecentlyViewedStore((state) => state.record);

  useEffect(() => {
    record({
      id: product.id,
      slug: product.slug,
      title: product.title,
      featured_image: product.featured_image,
      price: product.price,
      d_price: product.d_price,
      is_variation: product.is_variation,
      quantity: product.quantity,
    });
    // Only re-run if the viewed product actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return null;
}
