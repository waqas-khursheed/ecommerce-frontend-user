import Link from "next/link";
import type { ProductTag } from "@/types/tag";

// Pill-style promotional links (e.g. "Summer Sale 2026") — same chip styling
// already used for category children on app/(shop)/category/[slug]/page.tsx,
// kept consistent rather than inventing a new visual language for tags.
export function TagStrip({ tags }: { tags: ProductTag[] }) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tag/${tag.slug}`}
          className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
