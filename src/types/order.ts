import type { Product } from "@/types/product";

export interface CartItem {
  id: number;
  product_id: number;
  stock_id: number | null;
  size_id: number | null;
  fitting_id: number | null;
  composite_attribute_key: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  // null means untracked/unlimited stock — same convention used by
  // Stock.stock_qty / Product.quantity on the backend.
  remainingQty: number | null;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  subTotal: number;
}

export interface BillingDetails {
  id?: number;
  firstname: string;
  lastname?: string;
  email?: string;
  phone?: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  postcode?: string;
  country: string;
  state: string;
}

// Card payment is disabled for now — cash on delivery only.
export type PayMethod = "cod";

export interface CheckoutPayload {
  pay_method: PayMethod;
  billing: BillingDetails;
  coupon_code?: string;
  use_reward?: boolean;
  delivery_day?: string;
  delivery_start_time?: string;
  delivery_end_time?: string;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  color_id: number | null;
  size_id: number | null;
  fitting_id: number | null;
  quantity: number;
  price: number;
  dis_price: number;
  total: number;
  product?: Pick<Product, "id" | "title" | "slug" | "featured_image">;
}

// Mirrors backed/src/modules/orders/repositories/user.order.repository.js.
export interface Order {
  id: number;
  order_number: string;
  status: number;
  pay_method: string;
  shipping: number;
  sub_total: number;
  coupon_discount: number | null;
  coupon_title: string | null;
  rewards_discount: number;
  grand_total: number;
  payment_status: PaymentStatus;
  created_at: string;
  orderDetails?: OrderDetail[];
  billingDetails?: BillingDetails[];
}

export interface OrderListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Mirrors frontend_admin/src/types/order.ts ORDER_STATUS_LABELS — the single
// source of truth for what each Order.status number means (backend only
// validates it's an integer 0-9, the labels are a frontend convention).
export const ORDER_STATUS_LABELS: Record<number, string> = {
  0: "Pending",
  1: "Processing",
  2: "Shipped",
  3: "Delivered",
  4: "Completed",
  5: "Cancelled",
  6: "Returned",
  7: "Refunded",
  8: "Failed",
  9: "On Hold",
};

export const CANCELLABLE_ORDER_STATUS = 0;
