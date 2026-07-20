import { create } from "zustand";
import { persist } from "zustand/middleware";

// A lightweight snapshot, not the full Product — enough to render a card
// without an extra API round-trip, and small enough that storing 12 of them
// in localStorage is trivial.
export interface RecentlyViewedItem {
  id: number;
  slug: string;
  title: string;
  featured_image: string;
  price: number;
  d_price: number;
  is_variation: 0 | 1;
  quantity: number;
}

const MAX_ITEMS = 12;

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  record: (item: RecentlyViewedItem) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      record: (item) =>
        set((state) => ({
          items: [item, ...state.items.filter((i) => i.id !== item.id)].slice(0, MAX_ITEMS),
        })),
    }),
    { name: "recently-viewed" }
  )
);
