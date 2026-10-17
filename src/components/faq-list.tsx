/**
 * Visible FAQ block. The same Q&A list is fed to `faqJsonLd`, so the
 * structured data always matches on-page content (Google requirement).
 */
export function FaqList({
  title = "Frequently asked questions",
  description,
  faqs,
  id,
}: {
  title?: string;
  description?: string;
  faqs: { question: string; answer: string }[];
  id?: string;
}) {
  if (faqs.length === 0) return null;
  return (
    <div id={id} className="mt-10">
      <h2 className="font-sans text-[1.25rem] font-bold text-navy-900">{title}</h2>
      {description ? <p className="mt-2 max-w-3xl text-[0.875rem] leading-7 text-ink-muted">{description}</p> : null}
      <div className="mt-5 grid gap-3">
        {faqs.map((faq) => (
          <details key={faq.question} className="group rounded-xl border border-soft bg-white px-5 py-4 shadow-soft open:border-[#C9D6CE]">
            <summary className="cursor-pointer list-none font-sans text-[0.9375rem] font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                {faq.question}
                <span aria-hidden="true" className="mt-0.5 text-ink-muted transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-[0.875rem] leading-7 text-ink-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
