import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/EmptyState";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  getRowId: (row: T) => string | number;
}

// TODO: add sorting/pagination/search once the admin screens are built out
// (frontend_admin's data-table.tsx, backed by @tanstack/react-table, is the
// reference implementation if this section grows beyond a simple table).
export function DataTable<T>({ columns, data, isLoading, getRowId }: DataTableProps<T>) {
  if (!isLoading && data.length === 0) {
    return <EmptyState title="No data" />;
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 text-left font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={getRowId(row)} className="border-b last:border-0">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2">
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
