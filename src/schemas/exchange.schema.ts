import { z } from "zod";

// Mirrors backed/src/modules/exchanges/validations/exchange.validation.js createExchangeSchema
export const exchangeSchema = z.object({
  order_number: z.string().trim().min(1, "Order number is required").max(150),
  customer_name: z.string().trim().min(2, "Name must be at least 2 characters").max(150),
  return_item_code: z.string().trim().max(150).optional().or(z.literal("")),
  return_item_name: z.string().trim().max(150).optional().or(z.literal("")),
  return_item_size: z.string().trim().max(50).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email format").optional().or(z.literal("")),
  phone_number: z.string().trim().max(30).optional().or(z.literal("")),
  reason: z.string().trim().max(2000).optional().or(z.literal("")),
  other_detail: z.string().trim().max(2000).optional().or(z.literal("")),
  required_item_code: z.string().trim().max(150).optional().or(z.literal("")),
  required_item_name: z.string().trim().max(150).optional().or(z.literal("")),
  required_item_size: z.string().trim().max(50).optional().or(z.literal("")),
});

export type ExchangeInput = z.infer<typeof exchangeSchema>;
