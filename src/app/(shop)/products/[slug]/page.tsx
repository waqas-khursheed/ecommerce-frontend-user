import { notFound } from "next/navigation";
import { productService } from "@/services/product.service";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductSection } from "@/components/home/ProductSection";

export const revalidate = 60;

// Pre-render the top 50 best-sellers at build time; every other product is
// still served (and then cached) via on-demand ISR the first time it's hit.
export async function generateStaticParams() {
  const { products } = await productService
    .list({ limit: 50, sort: "best_selling" })
    .catch(() => ({ products: [] }));
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug).catch(() => null);

  if (!product) notFound();

  const related = await productService.getRelated(slug).catch(() => []);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <ProductGallery product={product} />

        <div className="space-y-4">
          <div>
            {product.brand && <p className="text-sm text-muted-foreground">{product.brand.title}</p>}
            <h1 className="text-xl font-bold sm:text-2xl">{product.title}</h1>
          </div>
          {product.short_desc && <p className="text-sm text-muted-foreground">{product.short_desc}</p>}

          <ProductPurchasePanel product={product} />

          {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}
        </div>
      </div>

      {(product.long_desc || product.features || product.inside_box) && (
        <section className="space-y-4 border-t pt-8">
          {product.long_desc && (
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{product.long_desc}</p>
            </div>
          )}
          {product.features && (
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Features</h2>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{product.features}</p>
            </div>
          )}
          {product.inside_box && (
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Inside the Box</h2>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{product.inside_box}</p>
            </div>
          )}
        </section>
      )}

      <div className="border-t pt-8">
        <ProductReviews productId={product.id} stats={product.reviewStats} />
      </div>

      {related.length > 0 && (
        <div className="border-t pt-8">
          <ProductSection title="You may also like" viewAllHref="/products" products={related} />
        </div>
      )}
    </div>
  );
}
