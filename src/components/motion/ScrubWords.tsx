"use client";

import { Fragment, useRef } from "react";

import { chapterProgress } from "@/features/story/sceneState";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/utils/cn";
import { clamp } from "@/utils/math";

interface ScrubWordsProps {
  text: string;
  /** Which chapter's scroll progress drives the reveal (see features/story/chapters). */
  progressKey: string;
  /** Words (case-insensitive, punctuation ignored) that get the accent gradient. */
  highlight?: readonly string[];
  className?: string;
  /** Progress window over which the words light up. */
  from?: number;
  to?: number;
}

const normalise = (word: string): string => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** Opacity of a word that has not been "lit" yet. Keep in sync with `.scrub-word` in globals.css. */
const UNLIT_OPACITY = 0.56;

/**
 * A statement whose words light up one by one as the visitor scrolls through a chapter.
 * Without JS (or with reduced motion) every word is simply fully visible.
 */
export function ScrubWords({
  text,
  progressKey,
  highlight = [],
  className,
  from = 0.1,
  to = 0.72,
}: ScrubWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  const accent = new Set(highlight.map(normalise));

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const nodes = Array.from(element.querySelectorAll<HTMLElement>("[data-word]"));
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        let lastProgress = Number.NaN;
        const update = (): void => {
          const progress = chapterProgress[progressKey] ?? 0;
          if (progress === lastProgress) return; // at rest: nothing to redraw
          lastProgress = progress;
          const fraction = clamp((progress - from) / (to - from));
          nodes.forEach((node, index) => {
            const own = clamp(fraction * nodes.length - index);
            // unlit words stay above WCAG AA contrast; "lit" is simply brighter, never the only way to read
            node.style.opacity = String(UNLIT_OPACITY + (1 - UNLIT_OPACITY) * own);
          });
        };
        update();
        gsap.ticker.add(update);
        return () => {
          gsap.ticker.remove(update);
          nodes.forEach((node) => node.style.removeProperty("opacity"));
        };
      });

      return () => media.revert();
    },
    { scope: ref, dependencies: [progressKey, from, to] },
  );

  return (
    // words stay real, readable text in the DOM (screen readers read the sentence as written)
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          <span
            data-word=""
            className={cn("scrub-word inline-block", accent.has(normalise(word)) && "text-gradient")}
          >
            {word}
          </span>
          {index < words.length - 1 && " "}
        </Fragment>
      ))}
    </p>
  );
}
