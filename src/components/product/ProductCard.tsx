"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Heart } from "lucide-react";
import { toast } from "sonner";
import { uploadUrl } from "@/lib/http";
import { cn, formatPrice } from "@/lib/utils";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/auth.store";
import { ProductQuickView } from "@/components/product/ProductQuickView";
import type { Product } from "@/types/product";

// Only meaningful for non-variant products — the list endpoint doesn't
// include per-variant Stock rows, so a variant product's real remaining
// quantity for whichever combination a shopper wants isn't known here.
const LOW_STOCK_THRESHOLD = 5;

// Narrowed to just the fields this card actually renders (rather than the
// full `Product`) so lightweight snapshots — e.g. RecentlyViewedItem — can
// be passed straight in without carrying every product field around.
export type ProductCardData = Pick<
  Product,
  "id" | "slug" | "title" | "featured_image" | "price" | "d_price" | "is_variation" | "quantity"
>;

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = uploadUrl("products", product.featured_image);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const [isQuickViewOpen, setQuickViewOpen] = useState(false);

  const isWishlisted = wishlist?.some((w) => w.product_id === product.id) ?? false;
  const showLowStock =
    !product.is_variation && product.quantity > 0 && product.quantity <= LOW_STOCK_THRESHOLD;

  const toggleWishlist = (e: MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to use your wishlist");
      return;
    }
    if (isWishlisted) removeFromWishlist.mutate(product.id);
    else addToWishlist.mutate(product.id);
  };

  const openQuickView = (e: MouseEvent) => {
    e.preventDefault();
    setQuickViewOpen(true);
  };

  return (
    <>
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {image && (
            <Image
              src={image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          )}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label="Toggle wishlist"
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
          >
            <Heart className={cn("size-4", isWishlisted && "fill-destructive text-destructive")} />
          </button>
          {showLowStock && (
            <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold text-white">
              Only {product.quantity} left
            </span>
          )}
          <button
            type="button"
            onClick={openQuickView}
            className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1.5 rounded-md bg-background/90 py-2 text-xs font-medium opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
          >
            <Eye className="size-3.5" />
            Quick View
          </button>
        </div>
        <div className="mt-2 space-y-0.5">
          <p className="line-clamp-1 text-sm font-medium">{product.title}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{formatPrice(product.d_price || product.price)}</span>
            {product.d_price > 0 && product.d_price < product.price && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
      <ProductQuickView slug={product.slug} open={isQuickViewOpen} onOpenChange={setQuickViewOpen} />
    </>
  );
}
