import type { CSSProperties } from "react";

import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/ui/Button";
import { hero } from "@/content/home";

import { HeroDragZone } from "./HeroDragZone";
import { HeroTags } from "./HeroTags";

const delay = (ms: number): CSSProperties => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Chapter 01. A server component: the headline, copy and buttons are in the first HTML paint
 * and animate with pure CSS, so the page's largest content never waits for JavaScript or WebGL.
 */
export function HeroSection() {
  return (
    <section
      id="top"
      data-chapter="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh items-end pt-[44svh] pb-14 md:items-center md:pt-32 md:pb-16"
    >
      <HeroDragZone />
      <HeroTags tags={hero.tags} />

      <div className="container-x relative z-10">
        <div className="max-w-[44rem] md:max-w-[40rem] lg:max-w-[46rem]">
          <p data-load-fade="" style={delay(150)} className="eyebrow">
            {hero.eyebrow}
          </p>

          <SplitText
            as="h1"
            id="hero-title"
            unit="chars"
            trigger="load"
            delay={120}
            className="mt-6 font-display text-[clamp(2.4rem,4.7vw,4.3rem)] leading-[1.04] font-semibold text-fg"
            lines={[{ text: hero.title }, { text: hero.accent, accent: true }]}
          />

          <p
            data-load-fade=""
            style={delay(650)}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:mt-7 sm:text-lg"
          >
            {hero.lead}
          </p>

          <div
            data-load-fade=""
            style={delay(780)}
            className="mt-7 flex items-center gap-2.5 sm:mt-9 sm:gap-3"
          >
            <ButtonLink href="#contact" className="sm:h-13 sm:px-7 sm:text-[0.95rem]">
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink
              href="#proof"
              variant="ghost"
              arrow={false}
              className="sm:h-13 sm:px-7 sm:text-[0.95rem]"
            >
              {hero.secondaryCta}
            </ButtonLink>
          </div>

          <p
            data-load-fade=""
            style={delay(900)}
            className="mt-10 hidden max-w-md text-sm leading-relaxed text-subtle sm:block"
          >
            {hero.trust}
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        data-load-fade=""
        style={delay(1200)}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-mono text-[0.62rem] tracking-[0.3em] text-subtle uppercase">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_var(--ease-smooth)_infinite] bg-aqua" />
        </span>
      </div>
    </section>
  );
}
