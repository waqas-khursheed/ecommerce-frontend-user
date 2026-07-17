import type { ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { categoryService } from "@/services/category.service";
import { tagService } from "@/services/tag.service";

// Categories/tags change rarely — revalidate every 5 minutes rather than on
// every request.
export const revalidate = 300;

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const [categories, tags] = await Promise.all([
    categoryService.list().catch(() => []),
    tagService.list().catch(() => []),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories} tags={tags} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <CartDrawer />
    </div>
  );
}
