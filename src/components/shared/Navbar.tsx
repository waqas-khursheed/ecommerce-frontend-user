"use client";

import Link from "next/link";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { useUiStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";

// TODO: wire real search, auth-aware account menu, and category mega-menu.
export function Navbar() {
  const toggleMobileMenu = useUiStore((state) => state.toggleMobileMenu);
  const toggleCartDrawer = useUiStore((state) => state.toggleCartDrawer);
  const itemCount = useCartStore((state) => state.items.length);

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:h-16">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-11 md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Open menu"
          >
            <Menu />
          </Button>
          <Link href="/" className="text-lg font-bold sm:text-xl">
            {APP_NAME}
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-11" aria-label="Account">
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
    </header>
  );
}
