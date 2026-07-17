import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { CheckoutPayload, Order, OrderListMeta } from "@/types/order";

interface OrderListData {
  orders: Order[];
  meta: OrderListMeta;
}

// Endpoints + response shapes confirmed against
// backed/src/modules/orders/{controllers,services}/checkout.* (mounted at
// /api — /checkout, /orders, /orders/:id).
export const orderService = {
  async checkout(payload: CheckoutPayload): Promise<Order> {
    const { data } = await http.post<ApiSuccessResponse<Order>>("/checkout", payload);
    return data.data;
  },

  async listMyOrders(params?: { page?: number; limit?: number }): Promise<OrderListData> {
    const { data } = await http.get<ApiSuccessResponse<OrderListData>>("/orders", { params });
    return data.data;
  },

  async getById(id: number): Promise<Order> {
    const { data } = await http.get<ApiSuccessResponse<Order>>(`/orders/${id}`);
    return data.data;
  },

  async cancel(id: number): Promise<Order> {
    const { data } = await http.patch<ApiSuccessResponse<Order>>(`/orders/${id}/cancel`);
    return data.data;
  },
};
