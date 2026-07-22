// Fallback only — the real site name is normally the admin-configured
// WebSetting.website_name (see Navbar.tsx/Footer.tsx/layout.tsx), used
// before that loads or if it's ever empty.
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Shop";

export const DEFAULT_PAGE_SIZE = 20;

export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "USD";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";

// Single source of truth for the "Only N left" / low-stock badge threshold —
// was previously duplicated as a local constant in both ProductCard.tsx and
// ProductPurchasePanel.tsx.
export const LOW_STOCK_THRESHOLD = Number(process.env.NEXT_PUBLIC_LOW_STOCK_THRESHOLD ?? 5);
