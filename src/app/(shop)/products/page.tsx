import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsPageContent } from "@/components/product/ProductsPageContent";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our full catalog — fashion, electronics, home essentials and more.",
};

// A filtered listing is inherently dynamic (client-driven search/filters), so
// this route is client-rendered rather than ISR — see the homepage and
// products/[slug] for the ISR pattern on cacheable pages.
export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}
