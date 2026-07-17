import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tagService } from "@/services/tag.service";
import { ProductListing } from "@/components/product/ProductListing";

export const revalidate = 300;

export async function generateStaticParams() {
  const tags = await tagService.list().catch(() => []);
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tag = await tagService.getBySlug(slug).catch(() => null);
  if (!tag) return { title: "Tag not found" };

  return {
    title: tag.meta_title || tag.name,
    description: tag.meta_description || tag.description || `Shop ${tag.name} products.`,
  };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = await tagService.getBySlug(slug).catch(() => null);

  if (!tag) notFound();

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="space-y-1">
        <h1 className="text-xl font-bold sm:text-3xl">{tag.name}</h1>
        {tag.description && <p className="text-sm text-muted-foreground">{tag.description}</p>}
        {tag.body_description && (
          <p className="max-w-2xl text-sm text-muted-foreground">{tag.body_description}</p>
        )}
      </div>

      <ProductListing baseFilters={{ tag: tag.slug }} />
    </div>
  );
}
