// Mirrors backed/src/modules/coupons/services/user.coupon.service.js previewCouponService.
export interface CouponPreview {
  code: string;
  percentage: number;
  cartSubtotal: number;
  eligibleSubtotal: number;
  discountAmount: number;
  newTotal: number;
}
