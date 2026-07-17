import type { Product } from "@/types/product";

// Mirrors backed/src/modules/wishlists/repositories/*.js.
export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  product: Product;
}
