import { http } from "@/lib/http";
import type { ApiSuccessResponse, PaginationMeta } from "@/types/api";
import type { CreateReviewPayload, Review } from "@/types/review";

interface ReviewListData {
  reviews: Review[];
  meta: PaginationMeta;
}

// Endpoints confirmed against backed/src/modules/reviews/routes/user.review.routes.js
// (mounted at /api/reviews).
export const reviewService = {
  async listForProduct(productId: number, params?: { page?: number; limit?: number }): Promise<ReviewListData> {
    const { data } = await http.get<ApiSuccessResponse<ReviewListData>>(`/reviews/product/${productId}`, {
      params,
    });
    return data.data;
  },

  async create(payload: CreateReviewPayload): Promise<Review> {
    const { data } = await http.post<ApiSuccessResponse<Review>>("/reviews", payload);
    return data.data;
  },
};
