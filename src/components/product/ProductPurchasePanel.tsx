"use client";

import { useMemo, useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useCart";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/auth.store";
import type { Product, ProductAttributeAssignment } from "@/types/product";

type VariantKey = "color_id" | "size_id" | "fitting_id";

// Groups the flat assignAttrToProducts list into option groups by attribute
// type (Color/Size/Fitting), matching the title-based convention already
// used on the admin Stock page (there's no dedicated "attribute type" flag
// on the backend — see frontend_admin/src/app/(admin)/stock/page.tsx).
function groupVariantOptions(assignments: ProductAttributeAssignment[]) {
  const groups = new Map<VariantKey, { key: VariantKey; label: string; items: ProductAttributeAssignment["attribute"][] }>();

  for (const assignment of assignments) {
    const title = assignment.attribute.attribute.attribute_title.toLowerCase();
    const key: VariantKey | null = title.includes("colour") || title.includes("color")
      ? "color_id"
      : title.includes("size")
        ? "size_id"
        : title.includes("fit")
          ? "fitting_id"
          : null;
    if (!key) continue;

    if (!groups.has(key)) groups.set(key, { key, label: assignment.attribute.attribute.attribute_title, items: [] });
    groups.get(key)!.items.push(assignment.attribute);
  }

  return Array.from(groups.values());
}

export function ProductPurchasePanel({ product }: { product: Product }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Partial<Record<VariantKey, number>>>({});

  const addToCart = useAddToCart();
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const variantGroups = useMemo(
    () => groupVariantOptions(product.assignAttrToProducts ?? []),
    [product.assignAttrToProducts]
  );

  const isWishlisted = wishlist?.some((w) => w.product_id === product.id) ?? false;

  // `variantGroups.every(...)` is vacuously true on an empty array, so
  // without the `.length > 0` guard a plain non-variant product (no groups
  // at all) would count as "fully selected" and go looking for a matching
  // Stock row that was never meant to exist for it.
  const hasVariants = variantGroups.length > 0;
  const allVariantsSelected = hasVariants && variantGroups.every((g) => selected[g.key] !== undefined);

  const matchingStock = hasVariants && allVariantsSelected
    ? product.stocks?.find((s) => variantGroups.every((g) => s[g.key] === selected[g.key]))
    : undefined;

  const price = matchingStock?.stock_dis_price || matchingStock?.stock_price || product.d_price || product.price;
  const compareAtPrice = matchingStock?.stock_price ?? product.price;
  const lineTotal = price * quantity;
  const canAddToCart = !product.is_variation || (allVariantsSelected && !!matchingStock);
  const outOfStock = matchingStock ? matchingStock.stock_qty === 0 : product.quantity === 0;

  const handleAddToCart = () => {
    addToCart.mutate({
      product_id: product.id,
      stock_id: matchingStock?.id,
      quantity,
    });
  };

  const toggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to use your wishlist");
      return;
    }
    if (isWishlisted) removeFromWishlist.mutate(product.id);
    else addToWishlist.mutate(product.id);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-semibold">{formatPrice(price)}</span>
        {compareAtPrice > price && (
          <span className="text-base text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span>
        )}
      </div>

      {variantGroups.map((group) => (
        <div key={group.key} className="space-y-2">
          <p className="text-sm font-medium">{group.label}</p>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected((prev) => ({ ...prev, [group.key]: item.id }))}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm",
                  selected[group.key] === item.id ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted"
                )}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      ))}

      {product.is_variation === 1 && !allVariantsSelected && (
        <p className="text-xs text-muted-foreground">Select {variantGroups.map((g) => g.label).join(", ")} to continue.</p>
      )}
      {product.is_variation === 1 && allVariantsSelected && !matchingStock && (
        <p className="text-xs text-destructive">That combination isn&apos;t available.</p>
      )}
      {outOfStock && <p className="text-xs text-destructive">Out of stock.</p>}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <span className="text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{formatPrice(lineTotal)}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button className="h-11 flex-1" disabled={!canAddToCart || outOfStock || addToCart.isPending} onClick={handleAddToCart}>
          {addToCart.isPending ? "Adding..." : "Add to Cart"}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-11 shrink-0"
          onClick={toggleWishlist}
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("size-4", isWishlisted && "fill-destructive text-destructive")} />
        </Button>
      </div>
    </div>
  );
}
