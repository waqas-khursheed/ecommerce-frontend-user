import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
  color_id?: number | null;
  size_id?: number | null;
  fitting_id?: number | null;
}

export interface BillingDetails {
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

export type PayMethod = "cod" | "card";

export interface CheckoutPayload {
  pay_method: PayMethod;
  billing: BillingDetails;
  coupon_code?: string;
  use_reward?: boolean;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderDetail {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  dis_price: number;
  total: number;
  product?: Pick<Product, "id" | "title" | "slug" | "featured_image">;
}

// TODO: confirm final shape against backed/src/modules/orders (user-facing
// order endpoints) once integration starts.
export interface Order {
  id: number;
  order_number: string;
  status: number;
  pay_method: string;
  shipping: number;
  sub_total: number;
  grand_total: number;
  payment_status: PaymentStatus;
  created_at: string;
  orderDetails?: OrderDetail[];
}
