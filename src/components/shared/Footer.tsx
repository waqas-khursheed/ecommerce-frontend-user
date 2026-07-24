import Link from "next/link";
import { Mail, MapPin, Phone, Send } from "lucide-react";
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

const LINK_CLASS =
  "text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold tracking-wide text-foreground uppercase">{children}</p>;
}

export function Footer({ categories, settings }: FooterProps) {
  const topCategories = categories.slice(0, 6);
  const siteName = settings?.website_name || APP_NAME;
  const logoUrl = uploadUrl("settings", settings?.main_logo ?? undefined);
  const socialLinks = SOCIAL_LINKS(settings);
  const hasContactInfo = settings?.phone_one || settings?.email || settings?.address;

  return (
    <footer className="border-t bg-gradient-to-b from-muted/20 to-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-16 w-auto" />
          ) : (
            <p className="text-xl font-bold tracking-tight">{siteName}</p>
          )}
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Quality products, fair prices, fast delivery — everything you need in one place.
          </p>

          {hasContactInfo && (
            <ul className="space-y-2 pt-1">
              {settings?.phone_one && (
                <li>
                  <a
                    href={`tel:${settings.phone_one}`}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Phone className="size-4 shrink-0 text-foreground/70" />
                    {settings.phone_one}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail className="size-4 shrink-0 text-foreground/70" />
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-foreground/70" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          )}

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 lg:col-span-2">
          <SectionHeading>Shop</SectionHeading>
          <ul className="space-y-2.5">
            <li>
              <Link href="/products" className={LINK_CLASS}>
                All Products
              </Link>
            </li>
            {topCategories.map((category) => (
              <li key={category.id}>
                <Link href={`/category/${category.slug}`} className={LINK_CLASS}>
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <SectionHeading>Customer Service</SectionHeading>
          <ul className="space-y-2.5">
            <li>
              <Link href="/contact" className={LINK_CLASS}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className={LINK_CLASS}>
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className={LINK_CLASS}>
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/account/exchanges" className={LINK_CLASS}>
                Returns &amp; Exchanges
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <SectionHeading>Company</SectionHeading>
          <ul className="space-y-2.5">
            <li>
              <Link href="/pages/about-us" className={LINK_CLASS}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/pages/terms" className={LINK_CLASS}>
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/pages/privacy-policy" className={LINK_CLASS}>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <SectionHeading>Stay in the loop</SectionHeading>
          <p className="text-sm text-muted-foreground">Get new arrivals and offers straight to your inbox.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t bg-background/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-5 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>{settings?.copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
            <Send className="size-3.5" />
            Fast, reliable delivery — every order.
          </p>
        </div>
      </div>
    </footer>
  );
}
