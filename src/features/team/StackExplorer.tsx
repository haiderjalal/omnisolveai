"use client";

import { useEffect, useRef, useState } from "react";

import type { Flip as FlipPlugin } from "gsap/Flip";

import type { StackCategory } from "@/content/home";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/utils/cn";

type Filter = "all" | StackCategory;
type FlipApi = typeof FlipPlugin;

interface StackExplorerProps {
  filters: readonly { id: Filter; label: string }[];
  chips: readonly { name: string; categories: readonly StackCategory[] }[];
}

/** Start loading the Flip plugin when the explorer is this close to the viewport. */
const PRELOAD_MARGIN = "800px";

/**
 * Filter engineers by discipline. Matching chips glide to their new positions (GSAP Flip)
 * while the rest fade out. All chips stay in the markup, so the full stack list is always
 * readable by crawlers and screen readers.
 *
 * Flip is fetched on demand as the section approaches the viewport, so it never weighs on the
 * initial bundle. Until it has loaded (or with reduced motion) filtering simply swaps instantly.
 */
export function StackExplorer({ filters, chips }: StackExplorerProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const flip = useRef<FlipApi | null>(null);
  const previousState = useRef<ReturnType<FlipApi["getState"]> | null>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void import("gsap/Flip").then((module) => {
          if (cancelled) return;
          gsap.registerPlugin(module.Flip);
          flip.current = module.Flip;
        });
      },
      { rootMargin: PRELOAD_MARGIN },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const select = (next: Filter): void => {
    if (next === filter) return;
    const items = grid.current?.querySelectorAll("[data-chip]");
    if (items && flip.current) previousState.current = flip.current.getState(items);
    setFilter(next);
  };

  useGSAP(
    () => {
      const state = previousState.current;
      previousState.current = null;
      const plugin = flip.current;
      if (!state || !plugin) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      plugin.from(state, {
        duration: 0.75,
        ease: "power3.inOut",
        absolute: true,
        stagger: 0.012,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, scale: 0.6 },
            { opacity: 1, scale: 1, duration: 0.55, delay: 0.25, ease: "back.out(1.6)" },
          ),
        onLeave: (elements) =>
          gsap.to(elements, { opacity: 0, scale: 0.6, duration: 0.3, ease: "power2.in" }),
      });
    },
    { scope: grid, dependencies: [filter] },
  );

  return (
    <div ref={root}>
      <div role="group" aria-label="Filter by discipline" className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const pressed = item.id === filter;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => select(item.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-500 ease-(--ease-expo)",
                pressed
                  ? "border-transparent bg-[image:var(--gradient-brand)] text-void shadow-glow"
                  : "glass text-muted hover:text-fg",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <ul ref={grid} className="mt-8 flex min-h-36 flex-wrap content-start gap-3" aria-live="polite">
        {chips.map((chip) => {
          const visible = filter === "all" || chip.categories.includes(filter);
          return (
            <li
              key={chip.name}
              data-chip=""
              hidden={!visible}
              className="glass rounded-full px-5 py-2.5 font-display text-[0.95rem] font-medium text-fg"
            >
              {chip.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
