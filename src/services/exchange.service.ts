import { http } from "@/lib/http";
import type { ExchangeRequestPayload } from "@/types/exchange";

// Endpoint confirmed against backed/src/modules/exchanges/routes/exchange.routes.js
// (mounted at /api/exchanges, no auth required).
export const exchangeService = {
  async create(payload: ExchangeRequestPayload): Promise<void> {
    await http.post("/exchanges", payload);
  },
};
