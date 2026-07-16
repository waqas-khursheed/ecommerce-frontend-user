"use client";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";

// TODO: replace with a real admin order list query once that endpoint exists.
const columns: DataTableColumn<Order>[] = [
  { key: "order_number", header: "Order #", cell: (o) => o.order_number },
  { key: "grand_total", header: "Total", cell: (o) => formatPrice(o.grand_total) },
  { key: "payment_status", header: "Payment", cell: (o) => o.payment_status },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Orders</h1>
      <DataTable columns={columns} data={[]} getRowId={(o) => o.id} />
    </div>
  );
}
