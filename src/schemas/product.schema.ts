import { z } from "zod";

// Placeholder for the admin/products create/edit form. Mirrors the shape of
// backed/src/modules/products/validations/product.validation.js — extend as
// the actual admin product form is built out.
export const productFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(255),
  short_desc: z.string().trim().max(500).optional().or(z.literal("")),
  price: z.coerce.number().positive("Price must be greater than 0"),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  status: z.union([z.literal(0), z.literal(1)]),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
