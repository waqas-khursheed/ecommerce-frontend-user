"use client";

import { useSearchParams } from "next/navigation";
import { ProductListing } from "@/components/product/ProductListing";
import type { ProductFilters } from "@/types/product";

export function ProductsPageContent() {
  const searchParams = useSearchParams();

  const initialFilters: ProductFilters = {
    search: searchParams.get("search") ?? undefined,
    tag: searchParams.get("tag") ?? undefined,
    new_arrival: searchParams.get("new_arrival") === "1" ? 1 : undefined,
    best_seller: searchParams.get("best_seller") === "1" ? 1 : undefined,
    sale: searchParams.get("sale") === "1" ? 1 : undefined,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-bold sm:text-2xl">All Products</h1>
      {/* key forces a clean remount when the query string changes (e.g.
          searching again from the header while already on this page) —
          ProductListing's filter state only reads initialFilters once on
          mount, so without this a second search here would silently no-op. */}
      <ProductListing key={searchParams.toString()} initialFilters={initialFilters} />
    </div>
  );
}
