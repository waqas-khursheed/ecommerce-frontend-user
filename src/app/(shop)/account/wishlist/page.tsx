"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Loader } from "@/components/shared/Loader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();

  if (isLoading) return <Loader />;

  if (!wishlist || wishlist.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="size-10 text-muted-foreground" />}
        title="Your wishlist is empty"
        description="Tap the heart icon on any product to save it here."
      />
    );
  }

  return <ProductGrid products={wishlist.map((item) => item.product)} />;
}
