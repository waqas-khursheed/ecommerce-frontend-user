import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { CardDiscountCheck } from "@/types/payment";

// Endpoint confirmed against backed/src/modules/payments/routes/user.cardDetail.routes.js
// (mounted at /api/card-detail, public).
export const paymentService = {
  async checkCardDiscount(cardNo: number): Promise<CardDiscountCheck> {
    const { data } = await http.get<ApiSuccessResponse<CardDiscountCheck>>("/card-detail/check", {
      params: { card_no: cardNo },
    });
    return data.data;
  },
};
