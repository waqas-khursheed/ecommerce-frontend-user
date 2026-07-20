import { z } from "zod";

// Mirrors backed/src/modules/exchanges/validations/exchange.validation.js createExchangeSchema
export const exchangeSchema = z.object({
  order_id: z.number().int().positive("Please select an order"),
  order_detail_id: z.number().int().positive("Please select the item to exchange"),
  requested_stock_id: z.number().int().positive().optional(),
  reason: z.string().trim().min(2, "Please tell us why you'd like to exchange this item").max(2000),
  other_detail: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ExchangeInput = z.infer<typeof exchangeSchema>;
