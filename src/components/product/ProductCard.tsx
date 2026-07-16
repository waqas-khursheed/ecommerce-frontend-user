import Link from "next/link";
import Image from "next/image";
import { uploadUrl } from "@/lib/http";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const image = uploadUrl("products", product.featured_image);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {image && (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="line-clamp-1 text-sm font-medium">{product.title}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{formatPrice(product.d_price || product.price)}</span>
          {product.d_price > 0 && product.d_price < product.price && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
