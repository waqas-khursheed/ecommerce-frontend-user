import { z } from "zod";

// Mirrors backed/src/modules/auth/validations/auth.validation.js loginSchema
export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Mirrors backed/src/modules/auth/validations/auth.validation.js registerSchema
export const registerSchema = z.object({
  first_name: z.string().trim().min(2, "First name is required").max(100),
  last_name: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  phone: z.string().trim().min(7, "Phone is required").max(20),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
