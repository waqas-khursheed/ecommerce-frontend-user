import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api";

// Differentiates a network failure (no response at all) from a real API
// error response, and unwraps Joi-style validation errors into one message.
export function getApiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  const axiosError = err as AxiosError<ApiErrorResponse>;

  if (!axiosError.response) {
    return "Network error — please check your connection and try again.";
  }

  const data = axiosError.response.data;
  if (!data) return fallback;

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.join(", ");
  }

  if (data.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors)[0];
    if (first) return first;
  }

  return data.message || fallback;
}
