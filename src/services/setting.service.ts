import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { WebSetting } from "@/types/setting";

// Endpoint confirmed against
// backed/src/modules/settings/{controllers,services}/user.webSetting.*.js
// (mounted at /api/settings, public — no auth). Returns null before the
// admin has configured web settings for the first time (404/NOT_CONFIGURED).
export const settingService = {
  async get(): Promise<WebSetting | null> {
    try {
      const { data } = await http.get<ApiSuccessResponse<WebSetting>>("/settings");
      return data.data;
    } catch {
      return null;
    }
  },
};
