import { cmsService } from "@/services/cms.service";
import { ContactForm } from "@/components/shared/ContactForm";

export const revalidate = 300;

export default async function ContactPage() {
  const page = await cmsService.getContactUsPage().catch(() => null);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-xl font-bold sm:text-2xl">{page?.title ?? "Contact Us"}</h1>
        {page?.content && (
          <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert" dangerouslySetInnerHTML={{ __html: page.content }} />
        )}
      </div>

      <ContactForm />

      {page?.map && (
        <div className="overflow-hidden rounded-lg border" dangerouslySetInnerHTML={{ __html: page.map }} />
      )}
    </div>
  );
}
