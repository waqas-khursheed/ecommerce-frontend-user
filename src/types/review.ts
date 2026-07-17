// Mirrors backed/src/modules/reviews/services/user.review.service.js.
// New reviews are created with status 0 (pending moderation) and only
// status 1 (approved) reviews are ever returned by the list endpoint.
export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  name: string;
  review: string;
  rate: number;
  status: 0 | 1 | 2;
  is_verified_purchase: 0 | 1;
  created_at: string;
}

export interface CreateReviewPayload {
  product_id: number;
  review: string;
  rate: number;
}
