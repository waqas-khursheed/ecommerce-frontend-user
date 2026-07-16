import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

// TODO: gate this whole segment behind an admin-role check once auth roles exist.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
