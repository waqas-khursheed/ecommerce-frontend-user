"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Loader } from "@/components/shared/Loader";
import type { ProductFilters as ProductFiltersType } from "@/types/product";

// A filtered listing is inherently dynamic (client-driven search), so this
// route is client-rendered rather than ISR — see the homepage and
// products/[slug] for the ISR pattern on cacheable pages.
export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const { data, isLoading, isError } = useProducts(filters);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-bold sm:text-2xl">All Products</h1>

      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <ProductFilters onChange={setFilters} />

        <div>
          {isLoading && <Loader />}
          {isError && <p className="text-sm text-destructive">Failed to load products.</p>}
          {data && <ProductGrid products={data.items} />}
        </div>
      </div>
    </div>
  );
}
