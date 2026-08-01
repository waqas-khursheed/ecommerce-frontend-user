"use client";

import { use } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useOrderDetail } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader } from "@/components/shared/Loader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function CheckoutSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrderDetail(Number(id));

  if (isLoading) return <Loader />;

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <EmptyState title="Order not found" description="This order doesn't exist or you don't have access to it." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-12 text-center">
      <div className="flex justify-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-7" />
        </div>
      </div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold sm:text-3xl">Thank you for your order!</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ve received your order and will start preparing it shortly. You&apos;ll pay cash on delivery.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border p-4 text-left">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Order number</span>
          <span className="font-medium">#{order.order_number}</span>
        </div>
        <Separator />
        <div className="space-y-1">
          {order.orderDetails?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
              <span className="line-clamp-1 pr-2">
                {item.product?.title ?? "Product"} × {item.quantity}
              </span>
              <span className="shrink-0">{formatPrice(item.total)}</span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.grand_total)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button render={<Link href={`/account/orders/${order.id}`} />}>View order details</Button>
        <Button variant="outline" render={<Link href="/products" />}>
          Continue shopping
        </Button>
      </div>
    </div>
  );
}
