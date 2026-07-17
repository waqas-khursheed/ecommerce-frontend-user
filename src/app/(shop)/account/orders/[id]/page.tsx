"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { uploadUrl } from "@/lib/http";
import { formatPrice } from "@/lib/utils";
import { useCancelOrder, useOrderDetail } from "@/hooks/useOrders";
import { ORDER_STATUS_LABELS, CANCELLABLE_ORDER_STATUS } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader } from "@/components/shared/Loader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrderDetail(Number(id));
  const cancelOrder = useCancelOrder();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) return <Loader />;

  if (!order) {
    return <EmptyState title="Order not found" description="This order doesn't exist or you don't have access to it." />;
  }

  const billing = order.billingDetails?.[0];
  const canCancel = order.status === CANCELLABLE_ORDER_STATUS;

  const handleCancel = async () => {
    await cancelOrder.mutateAsync(order.id);
    setConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Order #{order.order_number}</h2>
          <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{ORDER_STATUS_LABELS[order.status] ?? "Unknown"}</Badge>
          {canCancel && (
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogTrigger render={<Button variant="outline" size="sm">Cancel order</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel this order?</DialogTitle>
                  <DialogDescription>
                    This can&apos;t be undone. Your items will be released back into stock.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline">Keep order</Button>} />
                  <Button variant="destructive" disabled={cancelOrder.isPending} onClick={handleCancel}>
                    {cancelOrder.isPending ? "Cancelling..." : "Yes, cancel it"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="rounded-lg border divide-y">
        {order.orderDetails?.map((item) => {
          const image = uploadUrl("products", item.product?.featured_image);
          return (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {image && <Image src={image} alt={item.product?.title ?? ""} fill className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                {item.product ? (
                  <Link href={`/products/${item.product.slug}`} className="line-clamp-1 text-sm font-medium hover:underline">
                    {item.product.title}
                  </Link>
                ) : (
                  <p className="text-sm font-medium">Product unavailable</p>
                )}
                <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold">{formatPrice(item.total)}</span>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {billing && (
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-semibold">Shipping to</h3>
            <p className="text-sm text-muted-foreground">
              {billing.firstname} {billing.lastname}
              <br />
              {billing.address_1}
              {billing.address_2 ? `, ${billing.address_2}` : ""}
              <br />
              {billing.city}, {billing.state}, {billing.country}
              {billing.postcode ? ` ${billing.postcode}` : ""}
              <br />
              {billing.phone}
            </p>
          </div>
        )}

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-semibold">Order summary</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(order.sub_total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{formatPrice(order.shipping)}</dd>
            </div>
            {!!order.coupon_discount && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Coupon {order.coupon_title ? `(${order.coupon_title})` : ""}</dt>
                <dd>-{formatPrice(order.coupon_discount)}</dd>
              </div>
            )}
            {!!order.rewards_discount && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Rewards</dt>
                <dd>-{formatPrice(order.rewards_discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t pt-1 font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(order.grand_total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
