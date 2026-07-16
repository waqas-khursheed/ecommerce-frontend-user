import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

// TODO: replace MOCK_PRODUCTS with productService.list({ limit: 10 }) once
// the backend is reachable — keep this a server component so the fetch
// benefits from ISR below.
export const revalidate = 60;

export default function HomePage() {
  const products = MOCK_PRODUCTS;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      <section className="rounded-lg bg-muted/50 p-8 text-center sm:p-16">
        <h1 className="text-2xl font-bold sm:text-4xl">TODO: Hero banner</h1>
        <p className="mt-2 text-muted-foreground">Replace this with real homepage content.</p>
        <Button render={<Link href="/products" />} className="mt-4 h-11">
          Shop now
        </Button>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">Featured products</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
