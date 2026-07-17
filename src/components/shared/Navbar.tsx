"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { APP_NAME } from "@/lib/constants";
import { useUiStore } from "@/store/ui.store";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/store/auth.store";
import type { ProductCategory } from "@/types/product";
import type { ProductTag } from "@/types/tag";

interface NavbarProps {
  categories: ProductCategory[];
  tags: ProductTag[];
}

export function Navbar({ categories, tags }: NavbarProps) {
  const router = useRouter();
  const isMobileMenuOpen = useUiStore((state) => state.isMobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const toggleCartDrawer = useUiStore((state) => state.toggleCartDrawer);
  const { data: cart } = useCart();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const itemCount = cart?.items.length ?? 0;
  const [search, setSearch] = useState("");
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);

  const topCategories = categories.slice(0, 6);
  // Nav space is tight, so only the top couple of promotional tags (e.g.
  // "Summer Sale 2026") get their own link — styled distinctly from category
  // links so they read as a promo, not just another category.
  const topTags = tags.slice(0, 2);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    setMobileSearchOpen(false);
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  };

  // Tapping the search icon on a narrow screen swaps the whole header row
  // for a full-width search field (rather than the old behaviour of just
  // navigating to /products with no way to type a query first) — same
  // <form onSubmit={handleSearch}> as the desktop bar below, just laid out
  // for a small screen.
  if (isMobileSearchOpen) {
    return (
      <header className="sticky top-0 z-40 border-b bg-background">
        <form onSubmit={handleSearch} className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:h-16">
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
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              autoFocus
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-9"
            />
          </div>
          <Button type="submit" size="icon" className="size-11 shrink-0" aria-label="Submit search">
            <Search />
          </Button>
        </form>
      </header>
    );
  }

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
          {topTags.map((tag) => (
            <Link key={tag.id} href={`/tag/${tag.slug}`} className="text-sm font-semibold text-primary hover:underline">
              {tag.name}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden max-w-sm flex-1 sm:flex">
          <div className="relative w-full">
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Search className="size-4" />
            </button>
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
            <SheetTitle>{APP_NAME}</SheetTitle>
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
            {topTags.map((tag) => (
              <SheetClose
                key={tag.id}
                render={
                  <Link
                    href={`/tag/${tag.slug}`}
                    className="rounded-md px-3 py-3 text-sm font-semibold text-primary hover:bg-muted"
                  >
                    {tag.name}
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
