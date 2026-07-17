import Link from "next/link";
import Image from "next/image";
import { uploadUrl } from "@/lib/http";
import type { BannerImage } from "@/types/home";

export function PromoBanners({ banners }: { banners: BannerImage[] }) {
  if (banners.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {banners.slice(0, 3).map((banner) => {
        const image = uploadUrl("home-banners", banner.image);
        return (
          <Link key={banner.id} href="/products" className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            {image && (
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
