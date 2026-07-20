import type { ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { categoryService } from "@/services/category.service";

// Categories change rarely — revalidate every 5 minutes rather than on
// every request.
export const revalidate = 300;

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const categories = await categoryService.list().catch(() => []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <CartDrawer />
    </div>
  );
}
