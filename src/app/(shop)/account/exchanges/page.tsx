"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { exchangeSchema, type ExchangeInput } from "@/schemas/exchange.schema";
import { useCreateExchange, useMyExchanges } from "@/hooks/useExchanges";
import { useOrders } from "@/hooks/useOrders";
import { useProductDetail } from "@/hooks/useProducts";
import { groupVariantOptions, type VariantKey } from "@/lib/variants";
import { getApiErrorMessage } from "@/lib/apiError";
import { uploadUrl } from "@/lib/http";
import { formatPrice, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type Order, type OrderDetail } from "@/types/order";
import { EXCHANGE_STATUS_LABELS, type Exchange } from "@/types/exchange";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/shared/Loader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";

// Only orders that have actually shipped are exchange-eligible — matches
// backed/src/modules/exchanges/services/exchange.service.js's
// EXCHANGE_ELIGIBLE_STATUSES ([2,3,4] — Shipped/Delivered/Completed).
const ELIGIBLE_STATUSES = [2, 3, 4];

function ReplacementVariantPicker({
  productSlug,
  onResolve,
}: {
  productSlug: string;
  onResolve: (stockId: number | undefined) => void;
}) {
  const { data: product, isLoading } = useProductDetail(productSlug);
  const [selected, setSelected] = useState<Partial<Record<VariantKey, number>>>({});

  const variantGroups = useMemo(
    () => groupVariantOptions(product?.assignAttrToProducts ?? []),
    [product?.assignAttrToProducts]
  );

  if (isLoading) return <Loader />;
  if (!product || product.is_variation !== 1 || variantGroups.length === 0) return null;

  const allSelected = variantGroups.every((g) => selected[g.key] !== undefined);
  const matchingStock = allSelected
    ? product.stocks?.find((s) => variantGroups.every((g) => s[g.key] === selected[g.key]))
    : undefined;

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <p className="text-sm font-medium">Want a different variation instead? (optional)</p>
      {variantGroups.map((group) => (
        <div key={group.key} className="space-y-1.5">
          <p className="text-xs text-muted-foreground">{group.label}</p>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  const next = { ...selected, [group.key]: item.id };
                  setSelected(next);
                  const stock = product.stocks?.find((s) => variantGroups.every((g) => s[g.key] === next[g.key]));
                  onResolve(variantGroups.every((g) => next[g.key] !== undefined) ? stock?.id : undefined);
                }}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm",
                  selected[group.key] === item.id ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted"
                )}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      ))}
      {allSelected && !matchingStock && (
        <p className="text-xs text-destructive">That combination isn&apos;t available.</p>
      )}
    </div>
  );
}

const STATUS_BADGE_VARIANT: Record<Exchange["status"], "secondary" | "default" | "destructive"> = {
  0: "secondary",
  1: "default",
  2: "destructive",
  3: "default",
};

function ExchangeHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyExchanges({ page, limit: 10 });

  if (isLoading) return <Loader />;

  if (!data || data.exchanges.length === 0) {
    return (
      <EmptyState
        icon={<RefreshCw className="size-10 text-muted-foreground" />}
        title="No exchange requests yet"
        description="Requests you submit above will show up here with their status."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="divide-y rounded-lg border">
        {data.exchanges.map((exchange) => (
          <div key={exchange.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium">
                {exchange.orderDetail?.product?.title ?? exchange.return_item_name ?? `Request #${exchange.id}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {exchange.order_number ? `Order #${exchange.order_number} · ` : ""}
                {new Date(exchange.created_at).toLocaleDateString()}
              </p>
              {exchange.admin_note && (
                <p className="mt-1 text-sm text-muted-foreground">Note: {exchange.admin_note}</p>
              )}
            </div>
            <Badge variant={STATUS_BADGE_VARIANT[exchange.status]}>
              {EXCHANGE_STATUS_LABELS[exchange.status] ?? "Unknown"}
            </Badge>
          </div>
        ))}
      </div>
      <Pagination
        page={data.meta.page}
        totalPages={data.meta.totalPages}
        total={data.meta.total}
        onPageChange={setPage}
        itemLabel="requests"
      />
    </div>
  );
}

export default function ExchangesPage() {
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 50 });
  const createExchange = useCreateExchange();

  const eligibleOrders = useMemo(
    () => (ordersData?.orders ?? []).filter((o) => ELIGIBLE_STATUSES.includes(o.status)),
    [ordersData]
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExchangeInput>({ resolver: zodResolver(exchangeSchema) });

  const orderId = watch("order_id");
  const orderDetailId = watch("order_detail_id");

  const selectedOrder: Order | undefined = eligibleOrders.find((o) => o.id === orderId);
  const selectedDetail: OrderDetail | undefined = selectedOrder?.orderDetails?.find((d) => d.id === orderDetailId);

  const onSubmit = async (values: ExchangeInput) => {
    try {
      await createExchange.mutateAsync(values);
      reset({ order_id: undefined, order_detail_id: undefined, reason: "", other_detail: "" });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not submit exchange request"));
    }
  };

  if (ordersLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <Card>
      <CardHeader>
        <CardTitle>Request an exchange</CardTitle>
        <CardDescription>Pick the order and item you&apos;d like to exchange — we&apos;ll review it and get back to you.</CardDescription>
      </CardHeader>
      <CardContent>
        {eligibleOrders.length === 0 ? (
          <EmptyState
            title="No eligible orders yet"
            description="Exchanges can only be requested once an order has shipped."
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
            <div className="space-y-1.5">
              <Label>Order</Label>
              <Controller
                name="order_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(v) => {
                      field.onChange(Number(v));
                      setValue("order_detail_id", undefined as unknown as number);
                    }}
                  >
                    <SelectTrigger className="w-full" aria-invalid={!!errors.order_id}>
                      <SelectValue placeholder="Select an order" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleOrders.map((order) => (
                        <SelectItem key={order.id} value={String(order.id)}>
                          #{order.order_number} — {ORDER_STATUS_LABELS[order.status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.order_id && <p className="text-xs text-destructive">{errors.order_id.message}</p>}
            </div>

            {selectedOrder && (
              <div className="space-y-1.5">
                <Label>Item</Label>
                <Controller
                  name="order_detail_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : undefined}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger className="w-full" aria-invalid={!!errors.order_detail_id}>
                        <SelectValue placeholder="Select an item from this order" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedOrder.orderDetails?.map((detail) => (
                          <SelectItem key={detail.id} value={String(detail.id)}>
                            {detail.product?.title ?? `Item #${detail.id}`} × {detail.quantity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.order_detail_id && (
                  <p className="text-xs text-destructive">{errors.order_detail_id.message}</p>
                )}
              </div>
            )}

            {selectedDetail?.product && (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  {uploadUrl("products", selectedDetail.product.featured_image) && (
                    <img
                      src={uploadUrl("products", selectedDetail.product.featured_image) ?? undefined}
                      alt={selectedDetail.product.title}
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="line-clamp-1 font-medium">{selectedDetail.product.title}</p>
                  <p className="text-muted-foreground">{formatPrice(selectedDetail.total)}</p>
                </div>
              </div>
            )}

            {selectedDetail?.product?.slug && (
              <ReplacementVariantPicker
                productSlug={selectedDetail.product.slug}
                onResolve={(stockId) => setValue("requested_stock_id", stockId as number)}
              />
            )}

            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason for exchange</Label>
              <Textarea id="reason" rows={4} aria-invalid={!!errors.reason} {...register("reason")} />
              {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="other_detail">Additional details (optional)</Label>
              <Textarea id="other_detail" rows={2} {...register("other_detail")} />
            </div>

            <Button type="submit" disabled={isSubmitting} className="h-11 w-full sm:w-auto">
              {isSubmitting ? "Submitting..." : "Submit request"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Your requests</CardTitle>
        <CardDescription>Track the status of exchange requests you&apos;ve already submitted.</CardDescription>
      </CardHeader>
      <CardContent>
        <ExchangeHistory />
      </CardContent>
    </Card>
    </div>
  );
}
