"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { checkoutSchema, type CheckoutInput } from "@/schemas/checkout.schema";
import { useCart, useClearCart } from "@/hooks/useCart";
import { useApplyCoupon } from "@/hooks/useCoupon";
import { useAddress } from "@/hooks/useAddress";
import { useRewardBalance, useRewardSettings } from "@/hooks/useReward";
import { useAuthStore } from "@/store/auth.store";
import { getApiErrorMessage } from "@/lib/apiError";
import { orderService } from "@/services/order.service";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Banknote, CheckCircle2 } from "lucide-react";
import { Loader } from "@/components/shared/Loader";
import { EmptyState } from "@/components/shared/EmptyState";

// Client-rendered — checkout is per-user data and mutates server state.
export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const clearCart = useClearCart();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: rewardSettings } = useRewardSettings();
  const { data: rewardBalance } = useRewardBalance();
  const { data: savedAddress } = useAddress();
  const applyCoupon = useApplyCoupon();

  const [couponCode, setCouponCode] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { pay_method: "cod", use_reward: false },
  });

  const useReward = watch("use_reward");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to checkout");
      router.replace("/login?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  const subTotal = cart?.subTotal ?? 0;
  const couponDiscount = applyCoupon.data?.discountAmount ?? 0;

  const minRedeemPoints = rewardSettings?.redemptionRules?.[0]?.minimum_points ?? Infinity;
  const canUseRewards = isAuthenticated && (rewardBalance?.rewards ?? 0) >= minRedeemPoints;

  const estimatedTotal = useMemo(() => Math.max(subTotal - couponDiscount, 0), [subTotal, couponDiscount]);

  const handleUseSavedAddress = () => {
    if (!savedAddress) return;
    setValue("billing.address_1", savedAddress.address1);
    setValue("billing.city", savedAddress.city1?.name ?? "");
    setValue("billing.state", savedAddress.state1?.name ?? "");
    setValue("billing.country", savedAddress.country1?.country_name ?? "");
    setValue("billing.postcode", savedAddress.code1);
    toast.success("Address filled in");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      await applyCoupon.mutateAsync(couponCode.trim());
      setValue("coupon_code", couponCode.trim());
      toast.success("Coupon applied");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid coupon code"));
    }
  };

  const onSubmit = async (values: CheckoutInput) => {
    try {
      const payload = {
        ...values,
        coupon_code: values.coupon_code || undefined,
      };
      const order = await orderService.checkout(payload);
      await clearCart.mutateAsync();
      toast.success("Order placed!");
      router.push(`/account/orders/${order.id}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Checkout failed"));
    }
  };

  if (!isAuthenticated || isCartLoading) return <Loader />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <EmptyState title="Your cart is empty" description="Add some products before checking out." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-bold sm:text-2xl">Checkout</h1>

      <div className="grid gap-6 sm:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Shipping details</h2>
              {savedAddress && (
                <Button type="button" variant="outline" size="sm" onClick={handleUseSavedAddress}>
                  Use saved address
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="billing.firstname">First name</Label>
                <Input id="billing.firstname" aria-invalid={!!errors.billing?.firstname} {...register("billing.firstname")} />
                {errors.billing?.firstname && <p className="text-xs text-destructive">{errors.billing.firstname.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="billing.lastname">Last name</Label>
                <Input id="billing.lastname" {...register("billing.lastname")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="billing.email">Email</Label>
                <Input id="billing.email" type="email" aria-invalid={!!errors.billing?.email} {...register("billing.email")} />
                {errors.billing?.email && <p className="text-xs text-destructive">{errors.billing.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="billing.phone">Phone</Label>
                <Input id="billing.phone" type="tel" {...register("billing.phone")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="billing.address_1">Address</Label>
              <Input id="billing.address_1" aria-invalid={!!errors.billing?.address_1} {...register("billing.address_1")} />
              {errors.billing?.address_1 && <p className="text-xs text-destructive">{errors.billing.address_1.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="billing.address_2">Apartment, suite, etc. (optional)</Label>
              <Input id="billing.address_2" {...register("billing.address_2")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="billing.city">City</Label>
                <Input id="billing.city" aria-invalid={!!errors.billing?.city} {...register("billing.city")} />
                {errors.billing?.city && <p className="text-xs text-destructive">{errors.billing.city.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="billing.state">State</Label>
                <Input id="billing.state" aria-invalid={!!errors.billing?.state} {...register("billing.state")} />
                {errors.billing?.state && <p className="text-xs text-destructive">{errors.billing.state.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="billing.country">Country</Label>
                <Input id="billing.country" aria-invalid={!!errors.billing?.country} {...register("billing.country")} />
                {errors.billing?.country && <p className="text-xs text-destructive">{errors.billing.country.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="billing.postcode">Postcode</Label>
                <Input id="billing.postcode" {...register("billing.postcode")} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold">Payment method</h2>
            <div className="flex items-center justify-between rounded-lg border border-primary bg-primary/5 px-3 py-2.5 text-sm">
              <span className="flex items-center gap-2">
                <Banknote className="size-4" />
                Cash on Delivery
              </span>
              <CheckCircle2 className="size-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              Cash on Delivery is currently the only payment method available. Pay in cash when your order arrives.
            </p>
            <input type="hidden" value="cod" {...register("pay_method")} />
          </div>

          {canUseRewards && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-foreground" {...register("use_reward")} />
              Use my reward points ({rewardBalance?.rewards} available)
            </label>
          )}

          <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
            {isSubmitting ? "Placing order..." : "Place order"}
          </Button>
        </form>

        <div className="space-y-3 rounded-lg border p-4 h-fit">
          <h2 className="text-sm font-semibold">Order summary</h2>
          <div className="space-y-1 text-sm">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-muted-foreground">
                <span className="line-clamp-1 pr-2">
                  {item.product.title} × {item.quantity}
                </span>
                <span className="shrink-0">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={applyCoupon.isPending}>
              Apply
            </Button>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subTotal)}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Coupon discount</span>
              <span>-{formatPrice(couponDiscount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Estimated total</span>
            <span>{formatPrice(estimatedTotal)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Shipping{useReward ? " and reward" : ""} discounts are calculated when the order is placed.
          </p>
        </div>
      </div>
    </div>
  );
}
