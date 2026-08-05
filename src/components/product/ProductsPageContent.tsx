import { ProductListing } from "@/components/product/ProductListing";
import type { ProductFilters } from "@/types/product";

export function ProductsPageContent({
  initialFilters,
  searchKey,
}: {
  initialFilters: ProductFilters;
  searchKey: string;
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-bold sm:text-2xl">All Products</h1>
      {/* key forces a clean remount when the query string changes (e.g.
          searching again from the header while already on this page) —
          ProductListing's filter state only reads initialFilters once on
          mount, so without this a second search here would silently no-op. */}
      <ProductListing key={searchKey} initialFilters={initialFilters} />
    </div>
  );
}
