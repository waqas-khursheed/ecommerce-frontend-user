"use client";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

// TODO: replace with useProducts()/an admin-scoped product list query, and
// wire the create/edit form to schemas/product.schema.ts + React Hook Form.
const columns: DataTableColumn<Product>[] = [
  { key: "title", header: "Title", cell: (p) => p.title },
  { key: "price", header: "Price", cell: (p) => formatPrice(p.price) },
  { key: "quantity", header: "Stock", cell: (p) => p.quantity },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Products</h1>
      <DataTable columns={columns} data={[]} getRowId={(p) => p.id} />
    </div>
  );
}
