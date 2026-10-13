import type { CSSProperties } from "react";

import { Odometer } from "@/components/motion/Odometer";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { measuredBars, measuredIntro, securityPillars, trustIntro } from "@/content/home";

import { ShieldIllustration } from "./ShieldIllustration";

/** Chapter 07 — trust: how data and code are protected, and how delivery is measured. */
export function TrustSection() {
  return (
    <section
      id="security"
      data-chapter="trust"
      aria-labelledby="trust-title"
      className="container-x relative py-24 md:py-36"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <SectionHeading
            headingId="trust-title"
            eyebrow={trustIntro.eyebrow}
            title={trustIntro.title}
            accent={trustIntro.accent}
            lead={trustIntro.lead}
          />
          <ShieldIllustration className="mx-auto mt-12 w-full max-w-[16rem] lg:mx-0 lg:max-w-[18rem]" />
        </div>

        <ul className="grid gap-4">
          {securityPillars.map((pillar, index) => (
            <li key={pillar.title}>
              <Reveal index={index}>
                <TiltCard className="glass flex gap-5 rounded-3xl p-6 sm:p-7" max={4}>
                  <span className="font-mono text-sm text-aqua tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-fg">{pillar.title}</h3>
                    <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{pillar.description}</p>
                  </div>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-28 grid items-center gap-12 md:mt-40 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
        <SectionHeading
          as="h3"
          eyebrow={measuredIntro.eyebrow}
          title={measuredIntro.title}
          accent={measuredIntro.accent}
          lead={measuredIntro.lead}
        />
        <ul className="grid gap-7">
          {measuredBars.map((bar, index) => (
            <li key={bar.label}>
              <Reveal index={index}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[0.97rem] text-fg">{bar.label}</span>
                  <span className="font-display text-2xl font-semibold text-fg">
                    <Odometer value={`${bar.value}%`} />
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8" role="presentation">
                  <div
                    className="bar-fill h-full rounded-full bg-gradient-to-r from-glow via-[#45b6f2] to-aqua shadow-[0_0_20px_rgb(56_232_220/0.5)]"
                    style={{ "--v": bar.value / 100 } as CSSProperties}
                  />
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
