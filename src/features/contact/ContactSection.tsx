import { Clock, Globe, Mail } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { contactIntro } from "@/content/home";
import { siteConfig } from "@/content/site";
import { FaqList } from "@/features/faq/FaqList";

import { ContactForm } from "./ContactForm";

const CONTACT_CARDS = [
  { icon: Mail, label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  { icon: Clock, label: "Response time", value: siteConfig.contact.responseTime },
  { icon: Globe, label: "Where we work", value: siteConfig.contact.location },
] as const;

/** Chapter 11 — questions answered, then the conversation starts. */
export function ContactSection() {
  return (
    <section
      id="contact"
      data-chapter="contact"
      aria-labelledby="contact-title"
      className="container-x relative py-24 md:py-36"
    >
      <FaqList />

      <div className="mt-28 grid items-start gap-12 md:mt-40 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            headingId="contact-title"
            eyebrow={contactIntro.eyebrow}
            title={contactIntro.title}
            accent={contactIntro.accent}
            lead={contactIntro.lead}
          />
          <ul className="mt-10 grid gap-3">
            {CONTACT_CARDS.map((card, index) => {
              const Icon = card.icon;
              const body = (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-aqua">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[0.68rem] tracking-[0.16em] text-subtle uppercase">
                      {card.label}
                    </span>
                    <span className="block truncate text-[0.97rem] font-medium text-fg">{card.value}</span>
                  </span>
                </>
              );
              return (
                <li key={card.label}>
                  <Reveal index={index}>
                    {"href" in card ? (
                      <a
                        href={card.href}
                        className="glass flex items-center gap-4 rounded-2xl p-4 transition-colors hover:border-aqua/40"
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="glass flex items-center gap-4 rounded-2xl p-4">{body}</div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>

        <Reveal>
          <div className="relative rounded-[2rem] bg-[#f6f8ff] p-6 shadow-[0_40px_120px_-30px_rgb(56_232_220/0.35)] sm:p-9">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
