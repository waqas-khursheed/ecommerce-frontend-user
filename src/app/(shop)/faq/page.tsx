import { cmsService } from "@/services/cms.service";
import { EmptyState } from "@/components/shared/EmptyState";

export const revalidate = 300;

export default async function FaqPage() {
  const categories = await cmsService.getFaqs();
  const hasFaqs = categories.some((category) => category.faqs.length > 0);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <h1 className="text-xl font-bold sm:text-2xl">Frequently Asked Questions</h1>

      {!hasFaqs ? (
        <EmptyState title="No FAQs yet" description="Check back soon." />
      ) : (
        categories
          .filter((category) => category.faqs.length > 0)
          .map((category) => (
            <section key={category.id} className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">{category.title}</h2>
              <div className="divide-y rounded-lg border">
                {category.faqs.map((faq) => (
                  <details key={faq.id} className="group p-4">
                    <summary className="cursor-pointer list-none text-sm font-medium marker:content-none">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))
      )}
    </div>
  );
}
