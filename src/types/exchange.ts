import type { OrderDetail } from "@/types/order";

export type ExchangeStatus = 0 | 1 | 2 | 3; // Pending / Approved / Rejected / Completed

export const EXCHANGE_STATUS_LABELS: Record<ExchangeStatus, string> = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
  3: "Completed",
};

// Mirrors backed/src/modules/exchanges/validations/exchange.validation.js createExchangeSchema —
// order_id/order_detail_id are real references, not free-text.
export interface ExchangeRequestPayload {
  order_id: number;
  order_detail_id: number;
  requested_stock_id?: number;
  reason: string;
  other_detail?: string;
}

// Mirrors backed/src/modules/exchanges/repositories/exchange.repository.js detailIncludes.
export interface Exchange {
  id: number;
  order_id: number | null;
  user_id: number | null;
  order_detail_id: number | null;
  requested_stock_id: number | null;
  order_number: string | null;
  customer_name: string;
  return_item_code: string | null;
  return_item_name: string | null;
  return_item_size: string | null;
  email: string | null;
  phone_number: string | null;
  reason: string | null;
  other_detail: string | null;
  required_item_code: string | null;
  required_item_name: string | null;
  required_item_size: string | null;
  seen: 0 | 1;
  status: ExchangeStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  order?: { id: number; order_number: string; status: number; grand_total: number } | null;
  orderDetail?: OrderDetail | null;
  requestedStock?: {
    id: number;
    product_id: number;
    product?: { id: number; title: string; slug: string; featured_image: string | null };
  } | null;
}

export interface ExchangeListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
