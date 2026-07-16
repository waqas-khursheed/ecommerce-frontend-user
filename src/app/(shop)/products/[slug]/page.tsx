import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { MOCK_PRODUCTS, getMockProductBySlug } from "@/lib/mock-data";

// TODO: swap for productService.getBySlug(slug) / productService.list() once
// the backend is reachable — the ISR wiring below stays the same either way.
export const revalidate = 60;

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:grid-cols-2">
      <ProductGallery product={product} />

      <div className="space-y-4">
        <h1 className="text-xl font-bold sm:text-2xl">{product.title}</h1>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">{formatPrice(product.d_price || product.price)}</span>
          {product.d_price > 0 && product.d_price < product.price && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
          )}
        </div>
        {product.short_desc && <p className="text-sm text-muted-foreground">{product.short_desc}</p>}

        {/* TODO: variant selectors (color/size), quantity stepper, add-to-cart wired to useAddToCart. */}
        <Button className="h-11 w-full sm:w-auto sm:px-8">Add to cart</Button>
      </div>
    </div>
  );
}
