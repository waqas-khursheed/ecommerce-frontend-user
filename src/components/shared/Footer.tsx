import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import type { ProductCategory } from "@/types/product";

interface FooterProps {
  categories: ProductCategory[];
}

export function Footer({ categories }: FooterProps) {
  const topCategories = categories.slice(0, 6);

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <p className="text-lg font-bold">{APP_NAME}</p>
          <p className="text-sm text-muted-foreground">
            Quality products, fair prices, fast delivery — everything you need in one place.
          </p>
          <NewsletterForm className="max-w-xs pt-2" />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold">Shop</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/products" className="hover:text-foreground">
                All Products
              </Link>
            </li>
            {topCategories.map((category) => (
              <li key={category.id}>
                <Link href={`/category/${category.slug}`} className="hover:text-foreground">
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold">Customer Service</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/contact" className="hover:text-foreground">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-foreground">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-foreground">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/account/exchanges" className="hover:text-foreground">
                Returns &amp; Exchanges
              </Link>
            </li>
            <li>
              <Link href="/rewards" className="hover:text-foreground">
                Rewards Program
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold">Company</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/pages/about-us" className="hover:text-foreground">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/pages/terms" className="hover:text-foreground">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/pages/privacy-policy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
