import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth-token";
import { useAuthStore } from "@/store/auth.store";
import type { ApiErrorResponse } from "@/types/api";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

// TODO: confirm the uploads path convention against the backend once product
// images are wired up (see frontend_admin/src/lib/http.ts's uploadUrl for the
// equivalent pattern: images are served from the API origin, not /api).
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const uploadUrl = (moduleName: string, filename?: string | null) =>
  filename ? `${API_ORIGIN}/uploads/${moduleName}/${filename}` : null;

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const wasAuthenticated = useAuthStore.getState().isAuthenticated;
      useAuthStore.getState().logout();
      if (!window.location.pathname.startsWith("/login")) {
        if (wasAuthenticated) toast.error("Your session has expired — please log in again");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
