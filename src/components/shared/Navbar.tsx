"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SearchAutocomplete } from "@/components/shared/SearchAutocomplete";
import { APP_NAME } from "@/lib/constants";
import { uploadUrl } from "@/lib/http";
import { useUiStore } from "@/store/ui.store";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/auth.store";
import type { ProductCategory } from "@/types/product";
import type { WebSetting } from "@/types/setting";

interface NavbarProps {
  categories: ProductCategory[];
  settings?: WebSetting | null;
}

function BrandMark({ settings }: { settings?: WebSetting | null }) {
  const logoUrl = uploadUrl("settings", settings?.main_logo ?? undefined);
  const siteName = settings?.website_name || APP_NAME;

  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt={siteName} className="h-12 w-auto sm:h-14 lg:h-16" />;
  }
  return <span className="text-lg font-bold tracking-tight sm:text-xl">{siteName}</span>;
}

export function Navbar({ categories, settings }: NavbarProps) {
  const isMobileMenuOpen = useUiStore((state) => state.isMobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const toggleCartDrawer = useUiStore((state) => state.toggleCartDrawer);
  const { data: cart } = useCart();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const itemCount = cart?.items.length ?? 0;
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);

  const topCategories = categories.slice(0, 6);

  // Tapping the search icon on a narrow screen swaps the whole header row
  // for a full-width search field (rather than the old behaviour of just
  // navigating to /products with no way to type a query first) — same
  // SearchAutocomplete as the desktop bar below, just laid out for a small
  // screen.
  if (isMobileSearchOpen) {
    return (
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:h-20 lg:h-24">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 shrink-0"
            onClick={() => setMobileSearchOpen(false)}
            aria-label="Close search"
          >
            <X />
          </Button>
          <SearchAutocomplete
            autoFocus
            inputClassName="h-11 pl-9"
            onNavigate={() => setMobileSearchOpen(false)}
          />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:h-20 sm:gap-4 lg:h-24">
        <Button
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu />
        </Button>

        <Link href="/" className="shrink-0">
          <BrandMark settings={settings} />
        </Link>

        <nav className="hidden shrink-0 items-center gap-5 lg:flex">
          <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            All Products
          </Link>
          {topCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {category.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden max-w-sm flex-1 sm:block">
          <SearchAutocomplete />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 sm:hidden"
            aria-label="Search"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            aria-label="Account"
            render={<Link href={isAuthenticated ? "/account" : "/login"} />}
          >
            <User />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative size-11"
            onClick={toggleCartDrawer}
            aria-label="Cart"
          >
            <ShoppingCart />
            {itemCount > 0 && (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>{settings?.website_name || APP_NAME}</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-2">
            <SheetClose
              render={
                <Link href="/products" className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted">
                  All Products
                </Link>
              }
            />
            {categories.map((category) => (
              <SheetClose
                key={category.id}
                render={
                  <Link
                    href={`/category/${category.slug}`}
                    className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
                  >
                    {category.title}
                  </Link>
                }
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
