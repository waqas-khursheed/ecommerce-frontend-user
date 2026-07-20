import Link from "next/link";
import { Phone } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { uploadUrl } from "@/lib/http";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "@/components/shared/SocialIcons";
import type { ProductCategory } from "@/types/product";
import type { WebSetting } from "@/types/setting";

interface FooterProps {
  categories: ProductCategory[];
  settings?: WebSetting | null;
}

const SOCIAL_LINKS = (settings?: WebSetting | null) =>
  [
    { href: settings?.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings?.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings?.twitter, label: "Twitter", Icon: TwitterIcon },
    { href: settings?.youtube, label: "YouTube", Icon: YoutubeIcon },
  ].filter((link): link is { href: string; label: string; Icon: typeof FacebookIcon } => !!link.href);

export function Footer({ categories, settings }: FooterProps) {
  const topCategories = categories.slice(0, 6);
  const siteName = settings?.website_name || APP_NAME;
  const logoUrl = uploadUrl("settings", settings?.main_logo ?? undefined);
  const socialLinks = SOCIAL_LINKS(settings);

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-16 w-auto" />
          ) : (
            <p className="text-lg font-bold">{siteName}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Quality products, fair prices, fast delivery — everything you need in one place.
          </p>
          {settings?.phone_one && (
            <a
              href={`tel:${settings.phone_one}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Phone className="size-4" />
              {settings.phone_one}
            </a>
          )}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          )}
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
          {settings?.copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
