"use client";

import { useRef } from "react";

import { tagScreen } from "@/features/globe/tagAnchors";
import { live } from "@/features/story/sceneState";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/utils/cn";

interface HeroTagsProps {
  tags: readonly string[];
}

/**
 * Where each label sits relative to its node: [x side, y side]. The globe bleeds off the right
 * edge of the screen, so every label extends leftwards over the globe rather than off-screen.
 */
const PLACEMENT: readonly (readonly ["left" | "right", "up" | "down"])[] = [
  ["left", "up"],
  ["left", "up"],
  ["left", "down"],
  ["left", "down"],
];

/**
 * Capability labels tethered to nodes on the 3D globe. Real HTML (accessible, selectable);
 * the scene writes each node's screen position and this component follows it every frame.
 */
export function HeroTags({ tags }: HeroTagsProps) {
  const container = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const items = Array.from(container.current?.querySelectorAll<HTMLElement>("[data-tag]") ?? []);
      const update = (): void => {
        items.forEach((item, index) => {
          const state = tagScreen[index];
          if (!state) return;
          item.style.transform = `translate3d(${state.x.toFixed(1)}px, ${state.y.toFixed(1)}px, 0)`;
          // a static (reduced-motion) canvas never refreshes its own fade, so also respect the scroll
          item.style.opacity = Math.min(state.opacity, live.heroVisibility).toFixed(3);
        });
      };
      gsap.ticker.add(update);
      return () => gsap.ticker.remove(update);
    },
    { scope: container },
  );

  return (
    <ul
      ref={container}
      aria-label="Capabilities"
      className="pointer-events-none fixed top-0 left-0 z-20 hidden h-0 w-0 md:block"
    >
      {tags.slice(0, tagScreen.length).map((tag, index) => {
        const [side, vertical] = PLACEMENT[index] ?? PLACEMENT[0];
        return (
          <li key={tag} data-tag="" className="absolute top-0 left-0 opacity-0 will-change-transform">
            <span className="absolute -top-[3px] -left-[3px] block size-1.5 rounded-full bg-aqua shadow-[0_0_14px_3px_rgb(56_232_220/0.8)]" />
            <span
              aria-hidden="true"
              className={cn(
                "absolute h-px w-9 bg-gradient-to-r from-aqua/80 to-transparent",
                side === "right" ? "left-1 origin-left" : "right-1 origin-right rotate-180",
                vertical === "up"
                  ? side === "right"
                    ? "-rotate-[28deg]"
                    : "rotate-[152deg]"
                  : side === "right"
                    ? "rotate-[28deg]"
                    : "rotate-[208deg]",
              )}
            />
            <span
              className={cn(
                "glass absolute flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.1em] whitespace-nowrap text-fg uppercase",
                side === "right" ? "left-9" : "right-9",
                vertical === "up" ? "-top-[3.1rem]" : "top-5",
              )}
            >
              {tag}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
