import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { plans, plansIntro } from "@/content/home";
import { cn } from "@/utils/cn";

import { PlanButton } from "./PlanButton";

/** Chapter 08 — plans. The featured plan is raised, with a light beam circling its border. */
export function PricingSection() {
  return (
    <section
      id="pricing"
      data-chapter="plans"
      aria-labelledby="pricing-title"
      className="container-x relative py-24 md:py-36"
    >
      <SectionHeading
        headingId="pricing-title"
        align="center"
        eyebrow={plansIntro.eyebrow}
        title={plansIntro.title}
        accent={plansIntro.accent}
        lead={plansIntro.lead}
      />

      <ul className="mx-auto mt-16 grid max-w-5xl items-stretch gap-5 lg:grid-cols-3 lg:gap-6">
        {plans.map((plan, index) => (
          <li key={plan.name} className={cn(plan.featured && "lg:-my-5")}>
            <Reveal index={index} className="h-full">
              <TiltCard
                max={plan.featured ? 4 : 6}
                className={cn(
                  "flex h-full flex-col rounded-[2rem] p-7 sm:p-8",
                  plan.featured
                    ? "beam-border bg-[linear-gradient(180deg,rgb(40_60_150/0.45),rgb(10_16_48/0.85))] shadow-[0_0_90px_-25px_rgb(56_232_220/0.55)] backdrop-blur-xl"
                    : "glass",
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[image:var(--gradient-brand)] px-4 py-1 font-mono text-[0.65rem] font-bold tracking-[0.16em] text-void uppercase">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-2xl font-semibold text-fg">{plan.name}</h3>
                <p className="mt-2 min-h-12 text-[0.95rem] leading-relaxed text-muted">{plan.tagline}</p>
                <p className="mt-6 font-display text-[1.65rem] leading-tight font-semibold text-fg">
                  {plan.model}
                  <span className="mt-1 block text-sm font-normal text-subtle">
                    Pricing tailored to your scope
                  </span>
                </p>
                <ul className="mt-7 flex flex-1 flex-col gap-3.5 border-t border-white/10 pt-7">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[0.95rem] text-fg/90">
                      <Check aria-hidden="true" className="mt-0.5 size-[1.1rem] shrink-0 text-aqua" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-9">
                  <PlanButton planName={plan.name} label={plan.cta} featured={plan.featured} />
                </div>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
