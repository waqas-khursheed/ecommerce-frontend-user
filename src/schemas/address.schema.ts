import { z } from "zod";

// Mirrors backed/src/modules/addresses/validations/address.validation.js
// upsertAddressSchema. address1/country_id1/state_id1/city_id1/code1 are the
// primary (required-once-saved) slot; the *2 fields are an optional second
// address. "All secondary fields together or none" (matching the backend's
// validateLocation check) is enforced in the page's submit handler rather
// than via .refine() here — zodResolver's inference doesn't play well with
// coerced numeric fields inside a refined object schema.
// Plain z.number() rather than z.coerce.number() — the Select-driven ID
// fields are always set as real numbers via LocationSelect's onChange, so
// there's nothing to coerce, and coerce's "unknown" input type doesn't
// unify cleanly with useForm's generic here.
export const addressSchema = z.object({
  address1: z.string().trim().min(2, "Address is required").max(200),
  country_id1: z.number().int().positive("Country is required"),
  state_id1: z.number().int().positive("State is required"),
  city_id1: z.number().int().positive("City is required"),
  code1: z.string().trim().min(1, "Postal code is required").max(200),

  address2: z.string().trim().max(200).optional().or(z.literal("")),
  country_id2: z.number().int().positive().optional(),
  state_id2: z.number().int().positive().optional(),
  city_id2: z.number().int().positive().optional(),
  code2: z.string().trim().max(200).optional().or(z.literal("")),
});

export type AddressInput = z.infer<typeof addressSchema>;
