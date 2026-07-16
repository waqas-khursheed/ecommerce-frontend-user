import type { Product } from "@/types/product";

// Placeholder data so pages render and build (via ISR/generateStaticParams)
// without a live backend. Replace every usage with the real productService
// calls (see hooks/useProducts.ts) once the API is wired up.
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Sample Product",
    slug: "sample-product",
    short_desc: "A short placeholder description.",
    long_desc: "A longer placeholder description for the product detail page.",
    price: 49.99,
    d_price: 0,
    d_percentage: 0,
    quantity: 10,
    sku: "SKU-0001",
    featured_image: "",
    hovered_image: null,
    brand: null,
    categories: [],
    gallery: [],
    new_arrival: 1,
    best_seller: 0,
  },
];

export function getMockProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}
