"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { useUiStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";

export function CartDrawer() {
  const isOpen = useUiStore((state) => state.isCartDrawerOpen);
  const setOpen = useUiStore((state) => state.setCartDrawerOpen);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subTotal = items.reduce((sum, item) => sum + (item.product.d_price || item.product.price) * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 divide-y px-4">
          {items.length === 0 ? (
            <EmptyState title="Your cart is empty" description="Add some products to get started." />
          ) : (
            items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onQuantityChange={(qty) => updateQuantity(item.product.id, qty)}
                onRemove={() => removeItem(item.product.id)}
              />
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="px-4 pb-4">
            <CartSummary subTotal={subTotal} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
