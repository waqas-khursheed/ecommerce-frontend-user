import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { brandService } from "@/services/brand.service";
import { ProductListing } from "@/components/product/ProductListing";
import { uploadUrl } from "@/lib/http";

export const revalidate = 300;

export async function generateStaticParams() {
  const brands = await brandService.list().catch(() => []);
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = await brandService.getBySlug(slug).catch(() => null);
  if (!brand) return { title: "Brand not found" };

  return {
    title: brand.title,
    description: brand.description || `Shop official ${brand.title} products.`,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await brandService.getBySlug(slug).catch(() => null);

  if (!brand) notFound();

  const banner = uploadUrl("brands", brand.banner);
  const logo = uploadUrl("brands", brand.logo);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="relative overflow-hidden rounded-lg bg-muted">
        {banner && (
          <Image src={banner} alt={brand.title} width={1280} height={320} className="h-40 w-full object-cover sm:h-56" />
        )}
        <div className="flex items-center gap-4 p-4 sm:absolute sm:inset-0 sm:bg-black/30 sm:p-8">
          {logo && (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-background sm:size-20">
              <Image src={logo} alt="" fill sizes="80px" className="object-contain p-2" />
            </div>
          )}
          <div>
            <h1 className={banner ? "text-xl font-bold sm:text-white sm:text-3xl" : "text-xl font-bold sm:text-3xl"}>
              {brand.title}
            </h1>
            {brand.description && (
              <p className={banner ? "mt-1 text-sm sm:text-white/90" : "mt-1 text-sm text-muted-foreground"}>
                {brand.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <ProductListing baseFilters={{ brand: brand.slug }} />
    </div>
  );
}
