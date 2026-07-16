import { http } from "@/lib/http";
import { getDeviceId } from "@/lib/device-id";
import type { ApiSuccessResponse } from "@/types/api";
import type { CartItem } from "@/types/order";

// Endpoints confirmed against backed/src/modules/carts/routes/cart.routes.js
// (mounted at /api/cart). resolveCartOwner accepts either a Bearer token
// (logged-in user) or an X-Device-Id header (guest) — sending both is safe.
const deviceHeaders = () => ({ "X-Device-Id": getDeviceId() });

export const cartService = {
  async list(): Promise<CartItem[]> {
    const { data } = await http.get<ApiSuccessResponse<CartItem[]>>("/cart", {
      headers: deviceHeaders(),
    });
    return data.data;
  },

  async add(payload: { product_id: number; stock_id?: number; quantity?: number }): Promise<CartItem> {
    const { data } = await http.post<ApiSuccessResponse<CartItem>>("/cart", payload, {
      headers: deviceHeaders(),
    });
    return data.data;
  },

  async updateQuantity(id: number, quantity: number): Promise<CartItem> {
    const { data } = await http.put<ApiSuccessResponse<CartItem>>(
      `/cart/${id}`,
      { quantity },
      { headers: deviceHeaders() }
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`/cart/${id}`, { headers: deviceHeaders() });
  },

  async clear(): Promise<void> {
    await http.delete("/cart", { headers: deviceHeaders() });
  },
};
