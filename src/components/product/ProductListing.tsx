"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/shared/Pagination";
import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ProductFilters as ProductFiltersType } from "@/types/product";

const PAGE_SIZE = 20;

interface ProductListingProps {
  /** Locked in for this page (e.g. `{ category: "shoes" }` on a category landing page) — not user-editable. */
  baseFilters?: ProductFiltersType;
  initialFilters?: ProductFiltersType;
}

function countActiveFilters(filters: ProductFiltersType) {
  return [
    filters.search,
    filters.category,
    filters.brand,
    filters.tag,
    filters.min_price,
    filters.max_price,
  ].filter(Boolean).length;
}

export function ProductListing({ baseFilters = {}, initialFilters = {} }: ProductListingProps) {
  const [filters, setFilters] = useState<ProductFiltersType>(initialFilters);
  const [page, setPage] = useState(1);
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);

  const { data, isLoading, isError } = useProducts({
    ...baseFilters,
    ...filters,
    page,
    limit: PAGE_SIZE,
  });

  const handleFiltersChange = (next: ProductFiltersType) => {
    setFilters(next);
    setPage(1);
  };

  const activeFilterCount = countActiveFilters(filters);

  const filterProps = {
    value: filters,
    onChange: handleFiltersChange,
    hideCategory: "category" in baseFilters,
    hideBrand: "brand" in baseFilters,
    hideTag: "tag" in baseFilters,
  };

  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      {/* Mobile/tablet: filters live behind a toggle so shoppers see products
          without scrolling past the full filter panel first. */}
      <div className="md:hidden">
        <Button variant="outline" className="w-full justify-center" onClick={() => setFilterSheetOpen(true)}>
          <SlidersHorizontal className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      <Sheet open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 px-4 pb-4">
            <ProductFilters {...filterProps} />
            <SheetClose render={<Button className="w-full">Show results</Button>} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:block">
        <ProductFilters {...filterProps} />
      </div>

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
