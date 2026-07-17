"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/shared/Pagination";
import { Loader } from "@/components/shared/Loader";
import type { ProductFilters as ProductFiltersType } from "@/types/product";

const PAGE_SIZE = 20;

interface ProductListingProps {
  /** Locked in for this page (e.g. `{ category: "shoes" }` on a category landing page) — not user-editable. */
  baseFilters?: ProductFiltersType;
  initialFilters?: ProductFiltersType;
}

export function ProductListing({ baseFilters = {}, initialFilters = {} }: ProductListingProps) {
  const [filters, setFilters] = useState<ProductFiltersType>(initialFilters);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useProducts({
    ...baseFilters,
    ...filters,
    page,
    limit: PAGE_SIZE,
  });

  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <ProductFilters
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
        hideCategory={"category" in baseFilters}
        hideBrand={"brand" in baseFilters}
      />

      <div className="space-y-6">
        {isLoading && <Loader />}
        {isError && <p className="text-sm text-destructive">Failed to load products.</p>}
        {data && (
          <>
            <ProductGrid products={data.products} />
            <Pagination
              page={data.meta.page}
              totalPages={data.meta.totalPages}
              total={data.meta.total}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
