import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/ui/Button";
import { solved } from "@/content/home";

import { PulseOnEnter } from "./PulseOnEnter";

/**
 * Chapter 10 — solved. The globe is fully connected behind this section and sends a pulse
 * through the network as it arrives; the page asks for one clear action.
 */
export function CtaSection() {
  return (
    <section
      id="solved"
      data-chapter="cta"
      aria-labelledby="solved-title"
      className="relative flex min-h-[100svh] items-center justify-center py-28"
    >
      <PulseOnEnter />
      {/* soft dark spotlight so the headline stays crisp over the fully lit globe */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_44rem_17rem_at_50%_50%,rgb(5_8_22/0.86),rgb(5_8_22/0.55)_55%,transparent_80%)]"
      />
      <div className="container-x relative flex flex-col items-center text-center">
        <Reveal>
          <span className="eyebrow">{solved.eyebrow}</span>
        </Reveal>
        <SplitText
          as="h2"
          id="solved-title"
          className="mt-7 max-w-4xl font-display text-[clamp(2.4rem,6.4vw,5.6rem)] leading-[1.03] font-semibold text-balance text-fg [text-shadow:0_2px_40px_rgb(5_8_22/0.9)]"
          lines={[{ text: solved.title }, { text: solved.accent, accent: true }]}
          delay={100}
        />
        <Reveal
          as="p"
          delay={250}
          className="mt-7 max-w-xl text-lg leading-relaxed text-muted [text-shadow:0_2px_24px_rgb(5_8_22/0.9)]"
        >
          {solved.lead}
        </Reveal>
        <Reveal delay={400} className="mt-10">
          <ButtonLink href="#contact" size="lg">
            {solved.cta}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
