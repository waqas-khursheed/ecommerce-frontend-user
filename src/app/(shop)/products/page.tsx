"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductListing } from "@/components/product/ProductListing";
import type { ProductFilters } from "@/types/product";

// A filtered listing is inherently dynamic (client-driven search/filters), so
// this route is client-rendered rather than ISR — see the homepage and
// products/[slug] for the ISR pattern on cacheable pages.
function ProductsPageContent() {
  const searchParams = useSearchParams();

  const initialFilters: ProductFilters = {
    search: searchParams.get("search") ?? undefined,
    new_arrival: searchParams.get("new_arrival") === "1" ? 1 : undefined,
    best_seller: searchParams.get("best_seller") === "1" ? 1 : undefined,
    sale: searchParams.get("sale") === "1" ? 1 : undefined,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-bold sm:text-2xl">All Products</h1>
      <ProductListing initialFilters={initialFilters} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}
