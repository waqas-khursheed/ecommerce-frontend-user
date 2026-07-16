"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { checkoutSchema, type CheckoutInput } from "@/schemas/checkout.schema";
import { useCartStore } from "@/store/cart.store";
import { getApiErrorMessage } from "@/lib/apiError";
import { orderService } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartSummary } from "@/components/cart/CartSummary";

// Client-rendered — checkout is per-user data and mutates server state.
export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const subTotal = items.reduce((sum, item) => sum + (item.product.d_price || item.product.price) * item.quantity, 0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { pay_method: "cod" },
  });

  const onSubmit = async (values: CheckoutInput) => {
    try {
      // TODO: this should be a useMutation (see hooks/useCart.ts for the pattern)
      // once order placement is wired up end-to-end.
      await orderService.checkout(values);
      clearCart();
      toast.success("Order placed!");
      router.push("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Checkout failed"));
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-bold sm:text-2xl">Checkout</h1>

      <div className="grid gap-6 sm:grid-cols-[1fr_300px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="space-y-1.5">
            <Label htmlFor="billing.address_1">Address</Label>
            <Input id="billing.address_1" aria-invalid={!!errors.billing?.address_1} {...register("billing.address_1")} />
            {errors.billing?.address_1 && <p className="text-xs text-destructive">{errors.billing.address_1.message}</p>}
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

          <div className="space-y-1.5">
            <Label htmlFor="billing.country">Country</Label>
            <Input id="billing.country" aria-invalid={!!errors.billing?.country} {...register("billing.country")} />
            {errors.billing?.country && <p className="text-xs text-destructive">{errors.billing.country.message}</p>}
          </div>

          {/* TODO: pay_method selector (cod/card), coupon code input, reward toggle. */}

          <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
            {isSubmitting ? "Placing order..." : "Place order"}
          </Button>
        </form>

        <CartSummary subTotal={subTotal} />
      </div>
    </div>
  );
}
