import { Plus } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { faqIntro, faqs } from "@/content/home";

/**
 * Accordion built on native <details name="faq">: exclusive-open, keyboard accessible,
 * searchable with the browser's find-in-page, and indexable — with no JavaScript at all.
 */
export function FaqList() {
  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeading
        as="h3"
        align="center"
        eyebrow={faqIntro.eyebrow}
        title={faqIntro.title}
        accent={faqIntro.accent}
      />
      <ul className="mt-12 grid gap-3">
        {faqs.map((item, index) => (
          <li key={item.question}>
            <Reveal index={index}>
              <details
                name="faq"
                className="faq-item glass rounded-2xl open:border-aqua/30"
                open={index === 0}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl p-5 font-display text-[1.05rem] font-medium text-fg sm:p-6">
                  {item.question}
                  <Plus aria-hidden="true" className="faq-icon size-5 shrink-0 text-aqua" />
                </summary>
                <p className="px-5 pb-6 text-[0.97rem] leading-relaxed text-muted sm:px-6">{item.answer}</p>
              </details>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
