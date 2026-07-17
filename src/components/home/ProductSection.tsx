import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types/product";

interface ProductSectionProps {
  title: string;
  viewAllHref: string;
  products: Product[];
}

export function ProductSection({ title, viewAllHref, products }: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
        <Link href={viewAllHref} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
