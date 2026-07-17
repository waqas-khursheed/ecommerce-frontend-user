import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { categoryService } from "@/services/category.service";
import { ProductListing } from "@/components/product/ProductListing";
import { uploadUrl } from "@/lib/http";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await categoryService.list().catch(() => []);
  return categories.flatMap((category) => [
    { slug: category.slug },
    ...(category.children ?? []).map((child) => ({ slug: child.slug })),
  ]);
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await categoryService.getBySlug(slug).catch(() => null);

  if (!category) notFound();

  const banner = uploadUrl("categories", category.image);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="relative overflow-hidden rounded-lg bg-muted">
        {banner && (
          <Image src={banner} alt={category.title} width={1280} height={320} className="h-40 w-full object-cover sm:h-56" />
        )}
        <div className="p-4 sm:absolute sm:inset-0 sm:flex sm:flex-col sm:justify-end sm:bg-black/30 sm:p-8">
          <h1 className={banner ? "text-xl font-bold sm:text-white sm:text-3xl" : "text-xl font-bold sm:text-3xl"}>
            {category.title}
          </h1>
          {category.description && (
            <p className={banner ? "mt-1 text-sm sm:text-white/90" : "mt-1 text-sm text-muted-foreground"}>
              {category.description}
            </p>
          )}
        </div>
      </div>

      {category.children && category.children.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/category/${child.slug}`}
              className="rounded-full border px-3 py-1.5 text-sm hover:bg-muted"
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}

      <ProductListing baseFilters={{ category: category.slug }} />
    </div>
  );
}
