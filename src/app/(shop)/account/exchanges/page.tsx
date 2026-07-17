"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { exchangeSchema, type ExchangeInput } from "@/schemas/exchange.schema";
import { exchangeService } from "@/services/exchange.service";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ExchangesPage() {
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExchangeInput>({
    resolver: zodResolver(exchangeSchema),
    defaultValues: {
      customer_name: user ? `${user.first_name} ${user.last_name ?? ""}`.trim() : "",
      email: user?.email ?? "",
      phone_number: user?.phone ?? "",
    },
  });

  const onSubmit = async (values: ExchangeInput) => {
    try {
      await exchangeService.create(values);
      toast.success("Exchange request submitted — we'll be in touch.");
      reset();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not submit exchange request"));
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-muted-foreground">
        Need to swap a size or item? Fill in the details below and our team will follow up by email.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="order_number">Order number</Label>
            <Input id="order_number" aria-invalid={!!errors.order_number} {...register("order_number")} />
            {errors.order_number && <p className="text-xs text-destructive">{errors.order_number.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customer_name">Your name</Label>
            <Input id="customer_name" aria-invalid={!!errors.customer_name} {...register("customer_name")} />
            {errors.customer_name && <p className="text-xs text-destructive">{errors.customer_name.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone_number">Phone</Label>
            <Input id="phone_number" type="tel" {...register("phone_number")} />
          </div>
        </div>

        <div className="space-y-3 rounded-lg border p-3">
          <p className="text-sm font-semibold">Item to return</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="return_item_name">Item name</Label>
              <Input id="return_item_name" {...register("return_item_name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="return_item_size">Size</Label>
              <Input id="return_item_size" {...register("return_item_size")} />
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-lg border p-3">
          <p className="text-sm font-semibold">Item you&apos;d like instead (optional)</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="required_item_name">Item name</Label>
              <Input id="required_item_name" {...register("required_item_name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="required_item_size">Size</Label>
              <Input id="required_item_size" {...register("required_item_size")} />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reason">Reason for exchange</Label>
          <Textarea id="reason" rows={4} {...register("reason")} />
        </div>

        <Button type="submit" disabled={isSubmitting} className="h-11 w-full sm:w-auto">
          {isSubmitting ? "Submitting..." : "Submit request"}
        </Button>
      </form>
    </div>
  );
}
