import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { HomeContent } from "@/types/home";

// Confirmed against backed/src/modules/home/controllers/home.controller.js
// (mounted at /api/home) — one call returns every homepage section.
export const homeService = {
  async get(): Promise<HomeContent> {
    const { data } = await http.get<ApiSuccessResponse<HomeContent>>("/home");
    return data.data;
  },
};
