"use client";

import { useRef } from "react";

import { chapterProgress } from "@/features/story/sceneState";
import { gsap, useGSAP } from "@/lib/gsap";
import { smoothstep } from "@/utils/math";

interface GapFragmentsProps {
  items: readonly string[];
}

/** Where each fragment drifts to as the gap opens up (px, px, degrees). */
const DRIFT: readonly { x: number; y: number; rotate: number }[] = [
  { x: -90, y: -28, rotate: -5 },
  { x: 24, y: 40, rotate: 3 },
  { x: 100, y: -18, rotate: 6 },
];

/**
 * Three "broken pieces" that appear and drift apart as the visitor scrolls through the gap
 * chapter — the DOM echo of the network falling apart on the globe behind.
 * Without motion they are simply a static row.
 */
export function GapFragments({ items }: GapFragmentsProps) {
  const list = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const nodes = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-fragment]") ?? []);
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        let lastProgress = Number.NaN;
        const update = (): void => {
          const progress = chapterProgress.gap ?? 0;
          if (progress === lastProgress) return; // at rest: nothing to redraw
          lastProgress = progress;
          const drift = smoothstep(0.4, 1, progress);
          nodes.forEach((node, index) => {
            const offset = DRIFT[index % DRIFT.length];
            const reveal = smoothstep(0.2 + index * 0.08, 0.42 + index * 0.08, progress);
            node.style.opacity = (reveal * (1 - 0.4 * drift)).toFixed(3);
            node.style.transform = `translate3d(${(offset.x * drift).toFixed(1)}px, ${(offset.y * drift).toFixed(1)}px, 0) rotate(${(offset.rotate * drift).toFixed(2)}deg)`;
          });
        };
        update();
        gsap.ticker.add(update);
        return () => {
          gsap.ticker.remove(update);
          nodes.forEach((node) => {
            node.style.removeProperty("opacity");
            node.style.removeProperty("transform");
          });
        };
      });

      return () => media.revert();
    },
    { scope: list },
  );

  return (
    <ul ref={list} className="mt-10 flex flex-wrap gap-3 md:mt-14">
      {items.map((item) => (
        <li
          key={item}
          data-fragment=""
          className="glass rounded-full px-5 py-2.5 font-mono text-[0.78rem] tracking-[0.08em] text-muted uppercase"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
