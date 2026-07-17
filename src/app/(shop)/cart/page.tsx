"use client";

import { useRouter } from "next/navigation";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loader } from "@/components/shared/Loader";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";

// Client-rendered — cart contents are per-user/session data, never cached.
export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const updateQuantity = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const items = cart?.items ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Loader />
      </div>
    );
  }

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
              key={item.id}
              item={item}
              isUpdating={updateQuantity.isPending}
              onQuantityChange={(qty) => updateQuantity.mutate({ id: item.id, quantity: qty })}
              onRemove={() => removeItem.mutate(item.id)}
            />
          ))}
        </div>

        <CartSummary subTotal={cart?.subTotal ?? 0} onCheckout={() => router.push("/checkout")} />
      </div>
    </div>
  );
}
