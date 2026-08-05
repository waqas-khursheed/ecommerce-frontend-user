import type { Metadata } from "next";
import { ProductsPageContent } from "@/components/product/ProductsPageContent";
import type { ProductFilters } from "@/types/product";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our full catalog — fashion, electronics, home essentials and more.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

// A filtered listing is inherently dynamic (client-driven search/filters), so
// this route is client-rendered rather than ISR — see the homepage and
// products/[slug] for the ISR pattern on cacheable pages.
//
// Filters are read from `searchParams` here (server-side) rather than via
// `useSearchParams()` client-side — the latter requires wrapping the page in
// a `<Suspense>` boundary, and that boundary's streamed replacement never
// resolves in this app's dev environment (same root cause as the homepage
// needing its route-level `loading.tsx` removed). Reading `searchParams` as
// a page prop needs no Suspense boundary at all, sidestepping the issue.
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const initialFilters: ProductFilters = {
    search: first(params, "search"),
    tag: first(params, "tag"),
    new_arrival: first(params, "new_arrival") === "1" ? 1 : undefined,
    best_seller: first(params, "best_seller") === "1" ? 1 : undefined,
    sale: first(params, "sale") === "1" ? 1 : undefined,
  };

  const searchKey = Object.entries(params)
    .flatMap(([key, value]) => (Array.isArray(value) ? value.map((v) => `${key}=${v}`) : value ? [`${key}=${value}`] : []))
    .sort()
    .join("&");

  return <ProductsPageContent initialFilters={initialFilters} searchKey={searchKey} />;
}
