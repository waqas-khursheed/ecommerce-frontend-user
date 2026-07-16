import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/order";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
}

// Local cart cache for instant UI (badge count, drawer) — hooks/useCart.ts
// (TanStack Query) is the source of truth for the server-side cart and
// should sync its results into this store once wired up.
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === item.product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === item.product.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "cart" }
  )
);
