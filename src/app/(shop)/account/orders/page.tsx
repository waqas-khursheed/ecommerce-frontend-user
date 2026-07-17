"use client";

import { useState } from "react";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/shared/Loader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";

const STATUS_LABEL: Record<number, string> = {
  0: "Pending",
  1: "Processing",
  2: "Shipped",
  3: "Delivered",
  4: "Cancelled",
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders({ page, limit: 10 });

  if (isLoading) return <Loader />;

  if (!data || data.orders.length === 0) {
    return (
      <EmptyState
        icon={<PackageOpen className="size-10 text-muted-foreground" />}
        title="No orders yet"
        description="Your past orders will show up here once you place one."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="divide-y rounded-lg border">
        {data.orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="flex flex-col gap-1 p-4 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">#{order.order_number}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString()} · {order.pay_method.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{STATUS_LABEL[order.status] ?? "Unknown"}</Badge>
              <span className="font-semibold">{formatPrice(order.grand_total)}</span>
            </div>
          </Link>
        ))}
      </div>
      <Pagination
        page={data.meta.page}
        totalPages={data.meta.totalPages}
        total={data.meta.total}
        onPageChange={setPage}
        itemLabel="orders"
      />
    </div>
  );
}
