import { notFound } from "next/navigation";
import Image from "next/image";
import { cmsService } from "@/services/cms.service";
import { uploadUrl } from "@/lib/http";

export const revalidate = 300;

export default async function CommonPagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await cmsService.getPage(slug).catch(() => null);

  if (!page) notFound();

  const image = uploadUrl("cms", page.image);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-bold sm:text-2xl">{page.heading || page.title}</h1>
      {image && (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <Image src={image} alt={page.title} fill className="object-cover" />
        </div>
      )}
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}
