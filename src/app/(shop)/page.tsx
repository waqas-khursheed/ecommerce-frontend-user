import { homeService } from "@/services/home.service";
import { HeroSlider } from "@/components/home/HeroSlider";
import { TrustBadges } from "@/components/home/TrustBadges";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { TagStrip } from "@/components/home/TagStrip";
import { ProductSection } from "@/components/home/ProductSection";
import { BrandStrip } from "@/components/home/BrandStrip";
import { PromoBanners } from "@/components/home/PromoBanners";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { RecentlyViewedSection } from "@/components/product/RecentlyViewedSection";
import type { HomeContent } from "@/types/home";

// Homepage content rarely changes minute-to-minute — ISR keeps it fast
// without hitting the API on every request.
export const revalidate = 60;

const EMPTY_HOME: HomeContent = {
  slides: [],
  homeBanners: [],
  sideBanners: [],
  applicationSlides: [],
  applicationHomeBanners: [],
  mobileSliders: [],
  newArrivals: [],
  bestSellers: [],
  onSale: [],
  categories: [],
  brands: [],
  tags: [],
};

export default async function HomePage() {
  // Falls back to an empty homepage instead of throwing — this page is
  // statically generated (see `revalidate` above), so an unhandled rejection
  // here would crash the entire production build if the API is unreachable
  // at build time (e.g. the backend not deployed/reachable yet). Every
  // section below already guards on `.length > 0`, so an empty payload just
  // renders a bare page instead of breaking; ISR fills it in for real once
  // the API is reachable.
  const home = await homeService.get().catch(() => EMPTY_HOME);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-6 sm:space-y-16 sm:py-10">
      <HeroSlider slides={home.slides} />

      <TrustBadges />

      <RecentlyViewedSection />

      {home.categories.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold sm:text-xl">Shop by Category</h2>
          <CategoryGrid categories={home.categories} />
        </section>
      )}

      {home.tags.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold sm:text-xl">Shop by Tag</h2>
          <TagStrip tags={home.tags} />
        </section>
      )}

      <ProductSection title="New Arrivals" viewAllHref="/products?new_arrival=1" products={home.newArrivals} />

      <PromoBanners banners={home.homeBanners} />

      <ProductSection title="Best Sellers" viewAllHref="/products?best_seller=1" products={home.bestSellers} />

      <ProductSection title="On Sale" viewAllHref="/products?sale=1" products={home.onSale} />

      {home.brands.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold sm:text-xl">Our Brands</h2>
          <BrandStrip brands={home.brands} />
        </section>
      )}

      <section className="rounded-lg bg-muted/50 p-8 text-center sm:p-12">
        <h2 className="text-lg font-semibold sm:text-xl">Get 10% off your first order</h2>
        <p className="mt-1 text-sm text-muted-foreground">Subscribe for new arrivals, sales and exclusive offers.</p>
        <NewsletterForm className="mx-auto mt-4 max-w-sm" />
      </section>
    </div>
  );
}
