"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loader } from "@/components/shared/Loader";
import { useUiStore } from "@/store/ui.store";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";

export function CartDrawer() {
  const isOpen = useUiStore((state) => state.isCartDrawerOpen);
  const setOpen = useUiStore((state) => state.setCartDrawerOpen);
  const { data: cart, isLoading } = useCart();
  const updateQuantity = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const items = cart?.items ?? [];

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 divide-y px-4">
          {isLoading && <Loader />}
          {!isLoading && items.length === 0 && (
            <EmptyState title="Your cart is empty" description="Add some products to get started." />
          )}
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
        {items.length > 0 && (
          <>
            <div className="px-4 pb-4">
              <CartSummary subTotal={cart?.subTotal ?? 0} />
            </div>
            <SheetFooter>
              <Button variant="outline" render={<Link href="/cart" onClick={() => setOpen(false)} />}>
                View full cart
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
