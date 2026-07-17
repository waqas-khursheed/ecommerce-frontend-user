import { http } from "@/lib/http";
import { getDeviceId } from "@/lib/device-id";
import type { ApiSuccessResponse } from "@/types/api";
import type {
  AuthResult,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "@/types/auth";

// Endpoints confirmed against backed/src/modules/auth/routes/auth.routes.js
// (mounted at /api/auth). Login/register send X-Device-Id so the backend can
// merge a guest cart into the new session (see auth.controller.js's
// mergeDeviceCartIntoUserService call).
export const authService = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    const { data } = await http.post<ApiSuccessResponse<AuthResult>>("/auth/login", payload, {
      headers: { "X-Device-Id": getDeviceId() },
    });
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResult> {
    const { data } = await http.post<ApiSuccessResponse<AuthResult>>("/auth/register", payload, {
      headers: { "X-Device-Id": getDeviceId() },
    });
    return data.data;
  },

  async getProfile(): Promise<User> {
    const { data } = await http.get<ApiSuccessResponse<User>>("/auth/profile");
    return data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await http.put<ApiSuccessResponse<User>>("/auth/profile", payload);
    return data.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await http.post("/auth/change-password", payload);
  },

  async forgotPassword(email: string): Promise<{ message: string; debug_code?: string }> {
    const { data } = await http.post<ApiSuccessResponse<{ message: string; debug_code?: string }>>(
      "/auth/forgot-password",
      { email }
    );
    return data.data;
  },

  async resetPassword(payload: { email: string; code: string; password: string }): Promise<void> {
    await http.post("/auth/reset-password", payload);
  },
};
