import { useMutation } from "@tanstack/react-query";
import { couponService } from "@/services/coupon.service";

export function useApplyCoupon() {
  return useMutation({
    mutationFn: (code: string) => couponService.apply(code),
  });
}
