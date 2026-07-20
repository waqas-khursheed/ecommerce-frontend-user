"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { useRecentlyViewedStore } from "@/store/recentlyViewed.store";
import { cn } from "@/lib/utils";

// Reads from localStorage (via the persisted Zustand store), so this only
// has real data client-side after hydration — `hasHydrated` avoids an
// SSR/client mismatch flash by rendering nothing until then.
export function RecentlyViewedSection({
  excludeProductId,
  className,
}: {
  excludeProductId?: number;
  className?: string;
}) {
  const items = useRecentlyViewedStore((state) => state.items);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => setHasHydrated(true), []);

  if (!hasHydrated) return null;

  const visible = items.filter((item) => item.id !== excludeProductId).slice(0, 6);
  if (visible.length === 0) return null;

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold sm:text-xl">Recently Viewed</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {visible.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
