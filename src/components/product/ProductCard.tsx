"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { uploadUrl } from "@/lib/http";
import { cn, formatPrice } from "@/lib/utils";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/auth.store";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const image = uploadUrl("products", product.featured_image);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isWishlisted = wishlist?.some((w) => w.product_id === product.id) ?? false;

  const toggleWishlist = (e: MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to use your wishlist");
      return;
    }
    if (isWishlisted) removeFromWishlist.mutate(product.id);
    else addToWishlist.mutate(product.id);
  };

  return (
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
  );
}
