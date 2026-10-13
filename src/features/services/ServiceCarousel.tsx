"use client";

import { useRef, useState, type CSSProperties } from "react";

import {
  ArrowRight,
  Bot,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code,
  Database,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import type { Service } from "@/content/home";
import { chapterProgress } from "@/features/story/sceneState";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { clamp, smoothstep, steppedIndex } from "@/utils/math";

interface ServiceCarouselProps {
  items: readonly Service[];
}

const ICONS: readonly LucideIcon[] = [BrainCircuit, Bot, Database, Code, Cloud, ShieldCheck];
/** Fraction of each stop's scroll segment spent holding still (see steppedIndex). */
const HOLD = 0.55;

const pad = (value: number): string => String(value).padStart(2, "0");

/**
 * Six service cards on a 3D ring that turns as the visitor scrolls through the chapter.
 * The geometry lives in CSS (see .carousel in globals.css); this component only drives
 * `--angle`, fades cards that face away, and tracks which card is in front.
 */
export function ServiceCarousel({ items }: ServiceCarouselProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = items.length;
  const step = 360 / count;

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const ring = element.querySelector<HTMLElement>("[data-ring]");
      const cards = Array.from(element.querySelectorAll<HTMLElement>("[data-card]"));
      if (!ring) return;
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        let lastActive = -1;
        let lastProgress = Number.NaN;
        const update = (): void => {
          const progress = chapterProgress.services ?? 0;
          if (progress === lastProgress) return; // at rest: nothing to redraw
          lastProgress = progress;
          const index = steppedIndex(clamp(progress), count, HOLD);
          ring.style.setProperty("--angle", (index * step).toFixed(2));
          cards.forEach((card, i) => {
            const facing = Math.cos(((i - index) * step * Math.PI) / 180);
            // cards facing away fade fully out (their backs would otherwise show through)
            card.style.opacity = (
              0.12 * smoothstep(0, 0.3, facing) +
              0.88 * smoothstep(0, 0.9, facing)
            ).toFixed(3);
            card.style.pointerEvents = facing > 0.6 ? "auto" : "none";
          });
          const nearest = Math.round(index);
          if (nearest !== lastActive) {
            lastActive = nearest;
            setActive(nearest);
          }
        };
        update();
        gsap.ticker.add(update);
        return () => {
          gsap.ticker.remove(update);
          ring.style.removeProperty("--angle");
          cards.forEach((card) => {
            card.style.removeProperty("opacity");
            card.style.removeProperty("pointer-events");
          });
        };
      });

      return () => media.revert();
    },
    { scope: root, dependencies: [count] },
  );

  /** Scrolls the page so the ring settles on `index` (keyboard / button navigation). */
  const goTo = (index: number): void => {
    const wrapper = root.current?.closest<HTMLElement>("[data-chapter]");
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const range = Math.max(1, rect.height - window.innerHeight);
    const target = rect.top + window.scrollY + ((clamp(index, 0, count - 1) + 0.3) / count) * range;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <div ref={root}>
      <div className="carousel" role="group" aria-roledescription="carousel" aria-label="Services">
        <ul data-ring="" className="carousel-ring">
          {items.map((service, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <li
                key={service.title}
                data-card=""
                data-active={index === active}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                className="carousel-card glass flex flex-col rounded-3xl p-7"
                style={{ "--i": index } as CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-aqua">{pad(index + 1)}</span>
                  <span className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-aqua">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                </div>
                <h3 className="mt-7 font-display text-[1.45rem] leading-tight font-semibold text-fg">
                  {service.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{service.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[0.64rem] tracking-[0.06em] text-fg/75"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="card-cta group mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-aqua"
                >
                  Discuss this service
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-1"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-center gap-5 motion-reduce:hidden">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Previous service"
          className="glass grid size-11 place-items-center rounded-full text-fg transition-opacity disabled:opacity-35"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <p className="min-w-28 text-center font-mono text-xs tracking-[0.2em] text-subtle" aria-live="polite">
          <span className="text-aqua tabular-nums">{pad(active + 1)}</span> / {pad(count)}
        </p>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === count - 1}
          aria-label="Next service"
          className="glass grid size-11 place-items-center rounded-full text-fg transition-opacity disabled:opacity-35"
        >
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>
  );
}
