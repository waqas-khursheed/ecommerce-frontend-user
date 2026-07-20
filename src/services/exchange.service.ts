import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { Exchange, ExchangeListMeta, ExchangeRequestPayload } from "@/types/exchange";

// Endpoints confirmed against backed/src/modules/exchanges/routes/exchange.routes.js
// (mounted at /api/exchanges, all require auth now — an exchange always
// references the requester's own order/order_detail).
export const exchangeService = {
  async create(payload: ExchangeRequestPayload): Promise<Exchange> {
    const { data } = await http.post<ApiSuccessResponse<Exchange>>("/exchanges", payload);
    return data.data;
  },

  async listMine(params?: { page?: number; limit?: number }): Promise<{ exchanges: Exchange[]; meta: ExchangeListMeta }> {
    const { data } = await http.get<ApiSuccessResponse<{ exchanges: Exchange[]; meta: ExchangeListMeta }>>(
      "/exchanges/mine",
      { params }
    );
    return data.data;
  },

  async getMineById(id: number): Promise<Exchange> {
    const { data } = await http.get<ApiSuccessResponse<Exchange>>(`/exchanges/mine/${id}`);
    return data.data;
  },
};
