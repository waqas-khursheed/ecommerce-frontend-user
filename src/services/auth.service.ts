import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { AuthResult, LoginPayload, RegisterPayload, User } from "@/types/auth";

// Endpoints confirmed against backed/src/modules/auth/routes/auth.routes.js
// (mounted at /api/auth).
export const authService = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    const { data } = await http.post<ApiSuccessResponse<AuthResult>>("/auth/login", payload);
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResult> {
    const { data } = await http.post<ApiSuccessResponse<AuthResult>>("/auth/register", payload);
    return data.data;
  },

  async getProfile(): Promise<User> {
    const { data } = await http.get<ApiSuccessResponse<User>>("/auth/profile");
    return data.data;
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    const { data } = await http.put<ApiSuccessResponse<User>>("/auth/profile", payload);
    return data.data;
  },

  async changePassword(payload: { old_password: string; new_password: string }): Promise<void> {
    await http.post("/auth/change-password", payload);
  },

  async forgotPassword(email: string): Promise<void> {
    await http.post("/auth/forgot-password", { email });
  },

  async resetPassword(payload: { email: string; code: string; password: string }): Promise<void> {
    await http.post("/auth/reset-password", payload);
  },
};
