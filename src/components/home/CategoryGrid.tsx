import Link from "next/link";
import Image from "next/image";
import { Layers } from "lucide-react";
import { uploadUrl } from "@/lib/http";
import type { ProductCategory } from "@/types/product";

export function CategoryGrid({ categories }: { categories: ProductCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {categories.map((category) => {
        const image = uploadUrl("categories", category.image);
        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-muted sm:size-20">
              {image ? (
                <Image src={image} alt={category.title} fill sizes="80px" className="object-cover" />
              ) : (
                <Layers className="size-6 text-muted-foreground" />
              )}
            </div>
            <span className="line-clamp-1 text-xs font-medium group-hover:text-primary sm:text-sm">
              {category.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
