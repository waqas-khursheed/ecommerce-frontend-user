import Link from "next/link";
import Image from "next/image";
import { uploadUrl } from "@/lib/http";
import type { ProductBrand } from "@/types/product";

export function BrandStrip({ brands }: { brands: ProductBrand[] }) {
  if (brands.length === 0) return null;

  return (
    <div className="flex gap-8 overflow-x-auto py-2">
      {brands.map((brand) => {
        const logo = uploadUrl("brands", brand.logo);
        return (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="relative h-10 w-24 shrink-0 grayscale transition hover:grayscale-0"
          >
            {logo && <Image src={logo} alt={brand.title} fill sizes="96px" className="object-contain" />}
          </Link>
        );
      })}
    </div>
  );
}
