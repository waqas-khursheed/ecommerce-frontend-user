import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { WishlistItem } from "@/types/wishlist";

// Endpoints confirmed against backed/src/modules/wishlists/routes/wishlist.routes.js
// (mounted at /api/wishlist, all require auth).
export const wishlistService = {
  async list(): Promise<WishlistItem[]> {
    const { data } = await http.get<ApiSuccessResponse<{ wishlist: WishlistItem[] }>>("/wishlist");
    return data.data.wishlist;
  },

  async add(productId: number): Promise<WishlistItem> {
    const { data } = await http.post<ApiSuccessResponse<WishlistItem>>("/wishlist", { product_id: productId });
    return data.data;
  },

  async remove(productId: number): Promise<void> {
    await http.delete(`/wishlist/${productId}`);
  },
};
