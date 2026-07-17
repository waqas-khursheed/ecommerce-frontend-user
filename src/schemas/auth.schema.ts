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

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Mirrors backed/src/modules/auth/validations/auth.validation.js resetPasswordSchema
export const resetPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  code: z.string().trim().length(6, "Code must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Mirrors backed/src/modules/auth/validations/auth.validation.js changePasswordSchema
export const changePasswordSchema = z.object({
  old_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(6, "New password must be at least 6 characters"),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Mirrors backed/src/modules/auth/validations/auth.validation.js updateProfileSchema
export const updateProfileSchema = z.object({
  first_name: z.string().trim().min(2, "First name must be at least 2 characters").max(100).optional().or(z.literal("")),
  last_name: z.string().trim().max(100).optional().or(z.literal("")),
  username: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().min(7, "Phone must be at least 7 characters").max(20).optional().or(z.literal("")),
  company_name: z.string().trim().max(200).optional().or(z.literal("")),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
