import { ArrowUpRight, Quote } from "lucide-react";

import { Odometer } from "@/components/motion/Odometer";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { CoverArt } from "@/components/shared/CoverArt";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { caseStudies, proofIntro, stats, testimonials } from "@/content/home";

/** Chapter 05 — the evidence: headline numbers, selected work, and client voices. */
export function ProofSection() {
  return (
    <section
      id="proof"
      data-chapter="proof"
      aria-labelledby="proof-title"
      className="container-x relative py-24 md:py-36"
    >
      <SectionHeading
        headingId="proof-title"
        eyebrow={proofIntro.eyebrow}
        title={proofIntro.title}
        accent={proofIntro.accent}
        lead={proofIntro.lead}
      />

      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-10 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} index={index} className="flex flex-col-reverse gap-2">
            <dt className="text-sm text-muted">{stat.label}</dt>
            <dd className="font-display text-[clamp(2.6rem,6vw,4.75rem)] leading-none font-semibold tracking-tight text-fg">
              <Odometer value={stat.value} />
            </dd>
          </Reveal>
        ))}
      </dl>

      <div className="mt-24 md:mt-32">
        <Reveal>
          <h3 className="font-display text-2xl font-semibold text-fg sm:text-3xl">Selected work</h3>
        </Reveal>
        <ul className="mt-8 grid gap-5 lg:grid-cols-3">
          {caseStudies.map((study, index) => (
            <li key={study.title}>
              <Reveal index={index} className="h-full">
                <TiltCard className="glass group flex h-full flex-col overflow-hidden rounded-3xl">
                  <div className="relative aspect-[8/5] overflow-hidden">
                    <CoverArt
                      hue={study.hue}
                      seed={index * 7 + 11}
                      className="size-full transition-transform duration-1000 ease-(--ease-expo) group-hover:scale-110"
                    />
                    <span className="absolute top-4 left-4 rounded-full border border-white/15 bg-void/60 px-3 py-1 font-mono text-[0.65rem] tracking-[0.12em] text-fg uppercase backdrop-blur">
                      {study.sector}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h4 className="font-display text-xl leading-snug font-semibold text-fg">{study.title}</h4>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{study.summary}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {study.outcomes.map((outcome) => (
                        <li
                          key={outcome}
                          className="rounded-full border border-aqua/25 bg-aqua/8 px-3 py-1 font-mono text-[0.66rem] tracking-[0.06em] text-aqua"
                        >
                          {outcome}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#contact"
                      className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-fg transition-colors hover:text-aqua"
                    >
                      Discuss a similar project
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  </div>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-24 md:mt-32">
        <Reveal>
          <h3 className="font-display text-2xl font-semibold text-fg sm:text-3xl">What clients say</h3>
        </Reveal>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <li key={testimonial.quote}>
              <Reveal index={index} className="h-full">
                <figure className="glass flex h-full flex-col rounded-3xl p-7">
                  <Quote aria-hidden="true" className="size-7 text-aqua/70" />
                  <blockquote className="mt-5 text-[1.05rem] leading-relaxed text-fg">
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-auto pt-7">
                    <span className="block text-sm font-semibold text-fg">{testimonial.role}</span>
                    <span className="block font-mono text-xs tracking-[0.1em] text-subtle uppercase">
                      {testimonial.context}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
