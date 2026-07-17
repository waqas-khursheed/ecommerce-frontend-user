# Storefront Build Plan — Module Order

Reference UI: [Brandstore demo](https://websitedemos.net/brandstore-02/?customize=template) — hero slider, category nav, featured product grids (New/Best Seller/Sale), brand strip, trust badges, promo banners, newsletter, footer. Match this general layout language, but fully responsive/mobile-first (this demo is desktop-only marketing style — ours needs a working mobile nav, bottom-safe cart drawer, touch-friendly grids).

This is a **doc only** — no code yet. Each module below = one focused work session. Finish a module (build → test against the real backend → visually compare to the reference UI) before starting the next. Order is chosen by dependency: you can't build Cart before Product Detail has something to add, can't build Checkout before Cart, etc.

Everything here was verified directly against `backed/src/modules/*` — real endpoints, real query params, not guesses. Where the backend is missing something the UI needs, it's called out explicitly under **⚠️ Backend gap**.

---

## Module 0 — Foundation (mostly already scaffolded)

**What exists:** `app/layout.tsx`, `providers/`, `store/`, `lib/http.ts`, `components/shared/Navbar.tsx` & `Footer.tsx`, shadcn `ui/` components.

**What's left:**
- Navbar: real logo, category links (from `GET /api/categories`, done in Module 2 but the *nav* wiring happens here), search input (wires to Module 2's search), account icon → login/account link, cart icon with live count.
- Footer: category quick-links, newsletter form (backend ready — see Module 1), social links, copyright.
- Mobile nav: hamburger → slide-out menu (`useUiStore.isMobileMenuOpen` already exists, just needs the menu UI).

**Backend used:** none new (categories come later, but the Navbar just needs the same `categoryService.list()` Module 2 builds).

---

## Module 1 — Homepage

**Backend:** `GET /api/home` — **one call returns everything**: `slides`, `homeBanners`, `sideBanners`, `applicationSlides`, `applicationHomeBanners`, `mobileSliders`, `newArrivals` (12), `bestSellers` (12), `onSale` (12), `categories` (top-level, active), `brands` (active). This maps almost 1:1 onto the reference site's homepage sections.

**Build:**
1. `services/home.service.ts` — `homeService.get()` → unwraps `data`.
2. `hooks/useHome.ts` — TanStack Query wrapper, `staleTime` ~60s (homepage doesn't need to be second-by-second fresh).
3. Replace `app/(shop)/page.tsx`'s mock data with real data from the hook (keep it a Server Component + ISR `revalidate: 60` if you fetch server-side, or make it client + the hook — pick one, don't mix).
4. Sections to build, in this order (cheapest → most involved):
   - Hero slider (`slides`) — image + heading + CTA, matches reference's "Raining Offers" hero.
   - Trust badges (static content, no backend — Worldwide Shipping / Best Quality / Secure Payments, like the reference).
   - Category grid (`categories`) — links to Module 2's category pages.
   - New Arrivals grid (`newArrivals`) — reuse `ProductCard` from the boilerplate.
   - Best Sellers grid (`bestSellers`).
   - On Sale grid (`onSale`).
   - Brand strip (`brands`) — logo carousel like the reference's partner-logo row.
   - Promo banners (`homeBanners` / `sideBanners`) — the "tank tops / eyewear / suits" style callouts in the reference.
   - Newsletter signup — `POST /api/subscribe` (body: `{ email }`, see `leads/validations/user.lead.validation.js`).

**Don't build yet:** `mobileSliders`/`applicationSlides` — those are for a native mobile app, not this web storefront. Ignore them.

---

## Module 2 — Product Listing (Shop / Category / Brand pages)

**Backend:**
- `GET /api/products` — query params: `page`, `limit` (max 100, default 20), `search`, `category` (**slug string**, not id), `brand` (**slug string**), `tag`, `min_price`, `max_price`, `new_arrival` (0/1), `best_seller` (0/1), `sale` (0/1), `sort` (`newest` | `price_asc` | `price_desc` | `best_selling`).
- `GET /api/categories` (list) + `GET /api/categories/:slug` (single, for category landing pages).
- `GET /api/brands` (list) + `GET /api/brands/:slug` (single, for brand landing pages).

**⚠️ Fix before building:** the boilerplate's `types/product.ts` → `ProductFilters` currently has `category_id`/`brand_id` (numbers). The real API wants `category`/`brand` as **slugs**. Update the type + `product.service.ts` + `ProductFilters` component to match before wiring this up.

**Build:**
1. Fix `ProductFilters` type/schema (above).
2. `app/(shop)/products/page.tsx` — already scaffolded with `useProducts` + `ProductFilters` + `ProductGrid`; swap in real params, add sort dropdown, add price range inputs.
3. `app/(shop)/category/[slug]/page.tsx` (new) — category landing page: header/banner from `getCategory`, product grid filtered by `category=<slug>`.
4. `app/(shop)/brands/[slug]/page.tsx` (new) — same pattern for brands.
5. Pagination UI (reuse the Prev/Next pattern already built for the admin panel's `DataTable` — same idea, `meta.totalPages`).
6. Debounced search (hook already exists: `hooks/useDebounce.ts`).

---

## Module 3 — Product Detail

**Backend:**
- `GET /api/products/:slug` — full product.
- `GET /api/products/:slug/related?limit=8`.
- `GET /api/products/:slug/stock?color_id=&size_id=&fitting_id=` — variant stock check (only relevant if `is_variation` is true on the product).
- `GET /api/reviews/product/:productId` — paginated reviews (also needed here, even though "Reviews" is its own module below — the read side lives on the product page).

**Build:**
1. Replace `app/(shop)/products/[slug]/page.tsx`'s mock data with real `productService.getBySlug()` + keep `generateStaticParams` but source it from a real (capped, e.g. top 50 by `sold`) product list instead of `MOCK_PRODUCTS`.
2. `ProductGallery` — already built, just needs real image data.
3. Variant selector (color/size/fitting swatches) — only rendered `if product.is_variation`; on change, call the stock-check endpoint to update the Add to Cart button's enabled/disabled + "X left" state.
4. Add to Cart button → wires into Module 4.
5. Related products row (`ProductGrid` reused).
6. Reviews list (read-only here; the write form is Module 8, but display it now since the data's already being fetched).

---

## Module 4 — Cart

**Backend:** `GET/POST/PUT/DELETE /api/cart` — works for both guests (`X-Device-Id` header — already implemented in `lib/device-id.ts`) and logged-in users (Bearer token). This is the one place in the boilerplate where the Zustand `cart.store.ts` is currently **local-only** — it needs to become a thin cache synced from the real server cart.

**Build:**
1. Wire `hooks/useCart.ts` (already scaffolded — `useCart`, `useAddToCart`, `useUpdateCartItem`, `useRemoveCartItem`, `useClearCart`) into `CartDrawer` and `app/(shop)/cart/page.tsx`, replacing the direct `useCartStore` reads with the TanStack Query hook's data.
2. On login, the guest cart (tied to device id) should merge into the user's cart — check `cartOwner.middleware.js` on the backend to see if this merge already happens server-side on login, or if the frontend needs to call anything extra.
3. Cart badge count in Navbar (Module 0) now reflects the real server cart.

---

## Module 5 — Auth & Account

**Backend:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `GET/PUT /api/auth/profile`, `POST /api/auth/change-password`. `GET /api/orders`, `GET /api/orders/:id` (order history — needs auth).

**Build:**
1. Login/Register pages — **already fully wired** in the boilerplate (`app/(auth)/login`, `/register`), just needs visual polish to match the reference site's login style.
2. Forgot/Reset password pages (new).
3. `app/(shop)/account/page.tsx` (new) — profile view/edit form using `updateProfileSchema` fields (`first_name`, `last_name`, `username`, `phone`, `company_name`).
4. `app/(shop)/account/orders/page.tsx` + `[id]/page.tsx` (new) — order history list + detail, same data shape as the admin Orders page you already built (`OrderDetail`, `billingDetails`, etc. — reuse those types).
5. Change password form.

---

## Module 6 — Checkout

**Backend:** `POST /api/checkout` (auth required) — body: `pay_method` (`cod`|`card`), `billing` (free-text fields: `firstname`, `lastname`, `email`, `phone`, `company`, `address_1`, `address_2`, `city`, `postcode`, `country`, `state` — **all plain strings, no location-table IDs needed**, good, no backend gap here), `coupon_code`, `card_no`, `use_reward`, `delivery_day`/`delivery_start_time`/`delivery_end_time`.
Also: `POST /api/coupon/apply` (auth, body `{ code }`) to validate a coupon before submitting checkout; `GET /api/rewards/balance` (auth) to show available reward points; `GET /api/card-detail/check?card_no=` for card-based discounts.

**Build:**
1. `app/(shop)/checkout/page.tsx` — already scaffolded with the billing form + `checkoutSchema`; wire the real `orderService.checkout()` call (already written), swap the local cart read for the real server cart (Module 4).
2. Coupon code field with "Apply" button → `POST /api/coupon/apply`, show discount before final submit.
3. Reward points toggle ("use my points") — only show if `GET /api/rewards/balance` returns > 0.
4. Payment method selector (`cod` vs `card`) — if `card`, show the card-detail check flow.
5. Order confirmation page after successful checkout.

---

## Module 7 — Wishlist

**Backend:** `GET /api/wishlist`, `POST /api/wishlist` (body `{ product_id }`), `DELETE /api/wishlist/:productId` — all require auth.

**Build:**
1. `services/wishlist.service.ts` + `hooks/useWishlist.ts` (new, same pattern as cart).
2. Heart/save icon on `ProductCard` and product detail page.
3. `app/(shop)/account/wishlist/page.tsx` (new).

---

## Module 8 — Reviews (write side)

**Backend:** `POST /api/reviews` (auth, body includes `product_id`, `rate`, `review` — check `createReviewSchema` for exact fields when you get here).

**Build:**
1. Review form on the product detail page (only shown to logged-in users, ideally only those who've purchased — check if `verified_purchase` is enforced server-side or needs a client-side check).
2. Star rating input component.
3. Optimistic-ish refresh of the reviews list (Module 3) after submit.

---

## Module 9 — CMS / Static Content

**Backend (all public, no auth):** `GET /api/faqs`, `GET /api/contact-us-page`, `GET /api/pages/:slug` (About Us, Terms, Privacy, etc. — `slug` = the `page_name` set in the admin CMS panel), `POST /api/contact-us` (contact form submit, body per `contactFormSchema`).

**Build:**
1. `app/(shop)/faq/page.tsx` — accordion-style FAQ list, optionally grouped by category if the response includes `category`.
2. `app/(shop)/contact/page.tsx` — contact info (from `getContactUsPage`) + the submission form.
3. `app/(shop)/pages/[slug]/page.tsx` — generic static page renderer (About Us, Terms & Conditions, etc.) driven entirely by whatever's in the admin CMS.

---

## Module 10 — Exchanges & Rewards (lower priority, self-service extras)

**Backend:** `POST /api/exchanges` (return/exchange request submission, no auth required per the route — double-check this is intentional before shipping), `GET /api/rewards/settings` (public — how points are earned/redeemed, for an "About our rewards program" page).

**Build:** a simple request form (Exchanges) and an informational rewards-program page. Do this last — it's the least central to a working store.

---

## ⚠️ Backend gaps found while planning (flag these, don't silently work around them)

1. **Address Book has no location picker data.** `GET/PUT /api/address` (`addresses` module) stores `country_id1`/`state_id1`/`city_id1` as numeric foreign keys into the `countries`/`states`/`cities` tables — but those tables only have **admin** routes (`/api/admin/country`, `/api/admin/state`, `/api/admin/city`). There's no public endpoint for a customer-facing "select your country/state/city" dropdown. Either:
   - the backend needs new public read routes for these three tables, or
   - Address Book gets deprioritized/reworked to free-text fields (matching how Checkout's `billing` already does it) until that's added.
   Don't start the Address Book module until this is resolved one way or the other.

2. Everything else checked out — Checkout, Cart, Products, Home, Auth, Wishlist, Reviews, CMS all have real, usable public/authenticated endpoints already.

---

## Cross-cutting (apply to every module, not a separate step)

- **Mobile-first Tailwind**: base styles for mobile, `sm:`/`md:`/`lg:` for up — this is already the convention in the boilerplate's existing components (`ProductCard`, `Navbar`, etc.), keep following it.
- **Touch targets** ≥44px on anything tappable (buttons, quantity steppers) — already the pattern in `CartItem`/`CartSummary`.
- **Loading/empty/error states** — `components/shared/Loader.tsx` and `EmptyState.tsx` already exist, reuse them everywhere instead of ad-hoc "Loading..." text.
- **Images**: always `next/image` with a proper `sizes` prop (see `ProductCard` for the pattern already established) — never a raw `<img>`.
