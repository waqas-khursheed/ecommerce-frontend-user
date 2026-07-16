"use client";

import { useRouter } from "next/navigation";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCartStore } from "@/store/cart.store";

// Client-rendered — cart contents are per-user/session data, never cached.
export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subTotal = items.reduce((sum, item) => sum + (item.product.d_price || item.product.price) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <EmptyState title="Your cart is empty" description="Add some products to get started." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-bold sm:text-2xl">Your Cart</h1>

      <div className="grid gap-6 sm:grid-cols-[1fr_300px]">
        <div className="divide-y rounded-lg border px-4">
          {items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onQuantityChange={(qty) => updateQuantity(item.product.id, qty)}
              onRemove={() => removeItem(item.product.id)}
            />
          ))}
        </div>

        <CartSummary subTotal={subTotal} onCheckout={() => router.push("/checkout")} />
      </div>
    </div>
  );
}
