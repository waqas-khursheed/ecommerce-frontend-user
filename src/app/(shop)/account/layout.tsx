"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { getAuthToken } from "@/lib/auth-token";
import { Loader } from "@/components/shared/Loader";

const NAV = [
  { label: "Profile", href: "/account" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Exchanges", href: "/account/exchanges" },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useAuthStore((state) => state.logout);

  // `isAuthenticated` is persisted to localStorage independently of the auth
  // cookie the actual API calls rely on (lib/auth-token.ts). If the cookie
  // is missing/expired while that flag is still true (cookies cleared,
  // stale session from a previous day, etc.), this layout would render as
  // "logged in", the page would fire its authenticated requests, get a 401,
  // and only then get force-logged-out by the response interceptor — a
  // jarring mid-page redirect that looks like a random logout. Check the
  // real token here too, before any request fires, and self-heal the stale
  // flag so the next visit redirects cleanly from the start.
  //
  // `isAuthenticated` itself starts `false` on every page load until the
  // persisted store finishes reading localStorage (`hasHydrated`) — treating
  // that startup `false` the same as "logged out" was redirecting an
  // already-logged-in user to /login on every refresh of any /account page.
  const hasValidSession = isAuthenticated && !!getAuthToken();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!hasValidSession) {
      if (isAuthenticated) logout();
      router.replace("/login");
    }
  }, [hasHydrated, hasValidSession, isAuthenticated, logout, router]);

  if (!hasHydrated || !hasValidSession) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">My Account</h1>
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
