import { http } from "@/lib/http";
import type { ApiSuccessResponse, PaginatedData } from "@/types/api";
import type { CheckoutPayload, Order } from "@/types/order";

// Endpoints confirmed against backed/src/modules/orders/routes/checkout.routes.js
// (mounted at /api — /checkout, /orders, /orders/:id).
export const orderService = {
  async checkout(payload: CheckoutPayload): Promise<Order> {
    const { data } = await http.post<ApiSuccessResponse<Order>>("/checkout", payload);
    return data.data;
  },

  async listMyOrders(params?: { page?: number; limit?: number }): Promise<PaginatedData<Order>> {
    const { data } = await http.get<ApiSuccessResponse<PaginatedData<Order>>>("/orders", { params });
    return data.data;
  },

  async getById(id: number): Promise<Order> {
    const { data } = await http.get<ApiSuccessResponse<Order>>(`/orders/${id}`);
    return data.data;
  },
};
