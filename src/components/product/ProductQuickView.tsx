"use client";

import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader } from "@/components/shared/Loader";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { useProductDetail } from "@/hooks/useProducts";

interface ProductQuickViewProps {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Lets a shopper preview and buy a product straight from the listing grid
// (image, variants, add-to-cart) without leaving the page. The full product
// detail (variants/stock) is only fetched once the dialog is actually
// opened — `useProductDetail`'s query is disabled otherwise.
export function ProductQuickView({ slug, open, onOpenChange }: ProductQuickViewProps) {
  const { data: product, isLoading } = useProductDetail(open ? slug : "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto sm:max-w-3xl">
        {isLoading && (
          <div className="py-12">
            <Loader />
          </div>
        )}
        {product && (
          <div className="grid gap-6 pt-2 sm:grid-cols-2">
            <ProductGallery product={product} />
            <div className="space-y-4">
              <div>
                {product.brand && <p className="text-sm text-muted-foreground">{product.brand.title}</p>}
                <DialogTitle className="text-lg font-bold sm:text-xl">{product.title}</DialogTitle>
              </div>
              {product.short_desc && <p className="text-sm text-muted-foreground">{product.short_desc}</p>}

              <ProductPurchasePanel product={product} />

              <Link
                href={`/products/${product.slug}`}
                onClick={() => onOpenChange(false)}
                className="inline-block text-sm font-medium text-primary hover:underline"
              >
                View full details
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
