import { z } from "zod";

// Mirrors backed/src/modules/orders/validations/checkout.validation.js billingSchema
export const billingSchema = z.object({
  firstname: z.string().trim().min(2, "First name is required").max(150),
  lastname: z.string().trim().max(150).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  address_1: z.string().trim().min(2, "Address is required").max(500),
  address_2: z.string().trim().max(500).optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required").max(100),
  postcode: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().min(1, "Country is required").max(100),
  state: z.string().trim().min(1, "State is required").max(50),
});

// Mirrors backed/src/modules/orders/validations/checkout.validation.js checkoutSchema
export const checkoutSchema = z.object({
  pay_method: z.enum(["cod", "card"]),
  billing: billingSchema,
  coupon_code: z.string().trim().optional().or(z.literal("")),
  use_reward: z.boolean().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
