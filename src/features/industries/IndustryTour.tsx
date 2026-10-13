"use client";

import type { Industry } from "@/content/home";
import { useStoryStore } from "@/store/storyStore";
import { cn } from "@/utils/cn";

interface IndustryTourProps {
  items: readonly Industry[];
}

const pad = (value: number): string => String(value).padStart(2, "0");

/**
 * The card that changes as the globe tours each industry. All five cards are always in the
 * DOM (good for SEO and screen readers); only the active one is visible while the tour runs,
 * and with reduced motion they simply stack as a list.
 */
export function IndustryTour({ items }: IndustryTourProps) {
  const activeIndex = useStoryStore((state) => state.industryIndex);
  const reducedMotion = useStoryStore((state) => state.reducedMotion);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 font-mono text-xs tracking-[0.2em] text-subtle motion-reduce:hidden">
        <span className="text-aqua tabular-nums">{pad(activeIndex + 1)}</span>
        <span className="tabular-nums">/ {pad(items.length)}</span>
        <ol className="flex flex-1 gap-1.5" aria-hidden="true">
          {items.map((item, index) => (
            <li
              key={item.title}
              className={cn(
                "h-0.5 flex-1 rounded-full bg-white/12 transition-colors duration-500",
                index <= activeIndex && "bg-aqua",
              )}
            />
          ))}
        </ol>
      </div>

      <ul className="grid gap-4 motion-reduce:gap-5">
        {items.map((item, index) => {
          const active = index === activeIndex;
          return (
            <li
              key={item.title}
              aria-hidden={!reducedMotion && !active}
              className={cn(
                "glass col-start-1 row-start-1 rounded-3xl p-6 transition-[opacity,transform,filter] duration-700 ease-(--ease-expo) sm:p-8",
                "motion-reduce:col-auto motion-reduce:row-auto motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-none",
                active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0 blur-sm",
              )}
            >
              <p className="font-mono text-xs tracking-[0.2em] text-aqua">{pad(index + 1)}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-fg sm:text-[1.75rem]">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{item.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {item.focus.map((focus) => (
                  <li
                    key={focus}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[0.68rem] tracking-[0.06em] text-fg/80"
                  >
                    {focus}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
