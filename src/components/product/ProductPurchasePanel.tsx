"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useCart";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from "@/hooks/useWishlist";
import { useCreateStockAlert } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/auth.store";
import { groupVariantOptions, type VariantKey } from "@/lib/variants";
import type { Product } from "@/types/product";

const LOW_STOCK_THRESHOLD = 5;

function StockAlertForm({ slug, stockId }: { slug: string; stockId?: number }) {
  const authUser = useAuthStore((state) => state.user);
  const [email, setEmail] = useState(authUser?.email ?? "");
  const createStockAlert = useCreateStockAlert(slug);

  if (createStockAlert.isSuccess) {
    return <p className="text-sm text-muted-foreground">We&apos;ll email {email} when this is back in stock.</p>;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    createStockAlert.mutate({ email: email.trim(), stock_id: stockId });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-10"
      />
      <Button type="submit" variant="outline" className="h-10 shrink-0" disabled={createStockAlert.isPending}>
        {createStockAlert.isPending ? "Saving..." : "Notify me"}
      </Button>
    </form>
  );
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
  // Only offer "notify me" once we actually know which exact variant (or the
  // whole product, if it has none) is the one that's out — not while the
  // shopper still hasn't finished picking a combination.
  const canShowStockAlert = outOfStock && (!product.is_variation || (allVariantsSelected && !!matchingStock));

  // `stock_qty: null` means unlimited — no urgency messaging in that case.
  const remainingQty = matchingStock ? matchingStock.stock_qty : product.is_variation ? null : product.quantity;
  const showLowStock = remainingQty !== null && remainingQty > 0 && remainingQty <= LOW_STOCK_THRESHOLD;

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
      {!outOfStock && showLowStock && (
        <p className="text-xs font-medium text-destructive">Only {remainingQty} left in stock — order soon.</p>
      )}
      {canShowStockAlert && <StockAlertForm slug={product.slug} stockId={matchingStock?.id} />}

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
