"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";
import { useUiStore } from "@/store/ui.store";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/auth.store";
import type { ProductCategory } from "@/types/product";

interface NavbarProps {
  categories: ProductCategory[];
}

export function Navbar({ categories }: NavbarProps) {
  const router = useRouter();
  const isMobileMenuOpen = useUiStore((state) => state.isMobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const toggleCartDrawer = useUiStore((state) => state.toggleCartDrawer);
  const { data: cart } = useCart();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const itemCount = cart?.items.length ?? 0;
  const [search, setSearch] = useState("");

  const topCategories = categories.slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:h-16 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu />
        </Button>

        <Link href="/" className="shrink-0 text-lg font-bold tracking-tight sm:text-xl">
          {APP_NAME}
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

        <form onSubmit={handleSearch} className="ml-auto hidden max-w-sm flex-1 sm:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <Button
            variant="ghost"
            size="icon"
            className="size-11 sm:hidden"
            aria-label="Search"
            render={<Link href="/products" />}
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
            <SheetTitle>{APP_NAME}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSearch} className="px-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-9"
              />
            </div>
          </form>
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
