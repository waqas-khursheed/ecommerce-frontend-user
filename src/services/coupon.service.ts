import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { CouponPreview } from "@/types/coupon";

// Endpoint confirmed against backed/src/modules/coupons/routes/user.coupon.routes.js
// (mounted at /api/coupon, requires auth). Doesn't mutate anything — just
// previews the discount for the caller's current cart.
export const couponService = {
  async apply(code: string): Promise<CouponPreview> {
    const { data } = await http.post<ApiSuccessResponse<CouponPreview>>("/coupon/apply", { code });
    return data.data;
  },
};
