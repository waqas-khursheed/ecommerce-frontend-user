import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { RewardBalance, RewardSettings } from "@/types/reward";

// Endpoints confirmed against backed/src/modules/rewards/routes/user.reward.routes.js
// (mounted at /api/rewards). `settings` is public; `balance` requires auth.
export const rewardService = {
  async getSettings(): Promise<RewardSettings> {
    const { data } = await http.get<ApiSuccessResponse<RewardSettings>>("/rewards/settings");
    return data.data;
  },

  async getBalance(): Promise<RewardBalance> {
    const { data } = await http.get<ApiSuccessResponse<RewardBalance>>("/rewards/balance");
    return data.data;
  },
};
