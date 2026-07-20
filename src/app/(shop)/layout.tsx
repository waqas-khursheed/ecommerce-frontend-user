import type { ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { categoryService } from "@/services/category.service";
import { settingService } from "@/services/setting.service";

// Categories and site settings change rarely — revalidate every 5 minutes
// rather than on every request.
export const revalidate = 300;

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const [categories, settings] = await Promise.all([
    categoryService.list().catch(() => []),
    settingService.get(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories} settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} settings={settings} />
      <CartDrawer />
    </div>
  );
}
