"use client";

import { useRef, type CSSProperties } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { subscribeToScroll } from "@/lib/scrollState";
import { clamp } from "@/utils/math";

interface ProcessTimelineProps {
  steps: readonly { title: string; description: string }[];
}

/**
 * Each marker lights as the drawn line (--p) reaches its position (--t). `--lit` is a 0..1
 * value derived in CSS, so no JavaScript runs per frame beyond updating --p.
 */
const MARKER_STYLE = {
  "--lit": "clamp(0, calc((var(--p) - var(--t) + 0.06) * 9), 1)",
  // the unlit resting state must still meet AA contrast for its numeral
  opacity: "calc(0.62 + 0.38 * var(--lit))",
  boxShadow: "0 0 calc(var(--lit) * 40px) calc(var(--lit) * -6px) rgb(56 232 220 / 0.9)",
  borderColor: "color-mix(in oklab, #38e8dc calc(var(--lit) * 100%), rgb(255 255 255 / 0.15))",
} as CSSProperties;

/** The line starts drawing when the list's top reaches 78% of the viewport… */
const START_AT = 0.78;
/** …and finishes when its bottom reaches 62%. */
const END_AT = 0.62;

/**
 * Three steps joined by a line that draws itself as the section scrolls past, lighting each
 * step in turn. Progress is a single CSS variable (--p) so the browser does the animating.
 */
export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        let last = -1;
        let queued = false;
        const update = (): void => {
          queued = false;
          const rect = element.getBoundingClientRect();
          const viewport = window.innerHeight;
          // 0 when the top hits START_AT of the viewport, 1 when the bottom hits END_AT
          const travelled = viewport * START_AT - rect.top;
          const total = rect.height + viewport * (START_AT - END_AT);
          const progress = Math.round(clamp(travelled / total) * 1000) / 1000;
          if (progress !== last) {
            last = progress;
            element.style.setProperty("--p", progress.toFixed(3));
          }
        };
        // measure only when the page actually scrolls or resizes — never on idle frames
        const schedule = (): void => {
          if (queued) return;
          queued = true;
          window.requestAnimationFrame(update);
        };
        update();
        const unsubscribe = subscribeToScroll(schedule);
        window.addEventListener("resize", schedule);
        return () => {
          unsubscribe();
          window.removeEventListener("resize", schedule);
        };
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        element.style.setProperty("--p", "1");
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <ol
      ref={root}
      className="relative grid gap-10 md:grid-cols-3 md:gap-6"
      style={{ "--p": 1 } as CSSProperties}
    >
      {/* the line: horizontal on desktop, vertical on mobile */}
      <span
        aria-hidden="true"
        className="absolute top-6 bottom-6 left-[1.4rem] w-px bg-white/10 md:inset-x-[16%] md:top-[1.4rem] md:bottom-auto md:h-px md:w-auto"
      >
        <span className="absolute inset-0 origin-top scale-y-[var(--p)] bg-gradient-to-b from-glow via-[#45b6f2] to-aqua md:origin-left md:scale-x-[var(--p)] md:scale-y-100 md:bg-gradient-to-r" />
      </span>

      {steps.map((step, index) => (
        <li
          key={step.title}
          className="relative pl-16 md:pt-16 md:pl-0 md:text-center"
          style={{ "--t": index / (steps.length - 1 || 1) } as CSSProperties}
        >
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 grid size-[2.8rem] place-items-center rounded-full border bg-void font-mono text-sm text-fg md:left-1/2 md:-translate-x-1/2"
            style={MARKER_STYLE}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h4 className="font-display text-xl font-semibold text-fg">{step.title}</h4>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted md:mx-auto md:max-w-xs">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
