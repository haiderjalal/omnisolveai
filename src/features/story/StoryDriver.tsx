"use client";

import { useEffect } from "react";

import { gsap } from "@/lib/gsap";
import { scroll as scrollCache, subscribeToScroll } from "@/lib/scrollState";
import { useStoryStore } from "@/store/storyStore";
import { clamp, damp, smoothstep, steppedIndex } from "@/utils/math";

import { CHAPTER_IDS, INDUSTRY_STOPS, computeTarget, getChapterMode, type ChapterId } from "./chapters";
import { chapterProgress, live, target } from "./sceneState";

interface MeasuredChapter {
  id: ChapterId;
  index: number;
  sticky: boolean;
  /** Scroll range over which this chapter drives the globe. */
  zoneStart: number;
  /** Scroll range in which `progress` runs 0 → 1. */
  start: number;
  end: number;
}

/**
 * Turns scroll position into scene state, once per frame:
 *
 *   1. every chapter's progress (0..1) is published in `chapterProgress` for DOM scenes,
 *   2. the chapter whose top has passed the viewport centre becomes "active",
 *   3. that chapter's keyframes are solved into `target` for the renderer to damp towards.
 *
 * Chapter boundaries are defined as "section top at viewport centre", so each chapter ends
 * exactly where the next begins and the globe never jumps. Renders nothing.
 */
export function StoryDriver(): null {
  useEffect(() => {
    let measured: MeasuredChapter[] = [];
    // scroll position comes from a cache refreshed by scroll events — reading window.scrollY in
    // this per-frame loop would force a layout flush every frame (see lib/scrollState.ts)
    const stopTrackingScroll = subscribeToScroll();
    let lastScroll = scrollCache.y;
    /** Set whenever layout is re-measured, so the next frame recomputes even without scrolling. */
    let stale = true;

    const measure = (): void => {
      const vh = window.innerHeight;
      const found = CHAPTER_IDS.flatMap((id, index) => {
        const element = document.querySelector<HTMLElement>(`[data-chapter="${id}"]`);
        if (!element) return [];
        const rect = element.getBoundingClientRect();
        return [{ id, index, top: rect.top + window.scrollY, height: rect.height }];
      });
      const docEnd = Math.max(0, document.documentElement.scrollHeight - vh);

      measured = found.map((chapter, position) => {
        const sticky = getChapterMode(chapter.id) === "sticky";
        const zoneStart = position === 0 ? Number.NEGATIVE_INFINITY : chapter.top - vh / 2;
        const next = found[position + 1];
        const zoneEnd = next ? next.top - vh / 2 : docEnd;
        const flowStart = position === 0 ? 0 : zoneStart;
        return {
          id: chapter.id,
          index: chapter.index,
          sticky,
          zoneStart,
          start: sticky ? chapter.top : flowStart,
          end: sticky ? chapter.top + chapter.height - vh : Math.max(flowStart + 1, zoneEnd),
        };
      });
      stale = true;
    };

    const frame = (_time: number, deltaMs: number): void => {
      if (measured.length === 0) return;
      const scroll = scrollCache.y;
      // Nothing to do while the page is at rest: same scroll position, velocity settled, layout unchanged.
      if (!stale && scroll === lastScroll && Math.abs(live.scrollVelocity) < 0.0005) return;
      stale = false;

      const dt = Math.min(0.1, deltaMs / 1000);
      const vh = window.innerHeight;

      let activePosition = 0;
      measured.forEach((chapter, position) => {
        chapterProgress[chapter.id] = clamp(
          (scroll - chapter.start) / Math.max(1, chapter.end - chapter.start),
        );
        if (scroll >= chapter.zoneStart) activePosition = position;
      });

      const active = measured[activePosition];
      const progress = chapterProgress[active.id] ?? 0;
      computeTarget(active.index, progress, target);

      live.scrollVelocity = damp(
        live.scrollVelocity,
        (scroll - lastScroll) / vh / Math.max(dt, 0.001),
        6,
        dt,
      );
      lastScroll = scroll;
      live.heroVisibility = 1 - smoothstep(0.5, 0.95, chapterProgress.hero ?? 1);

      const store = useStoryStore.getState();
      if (store.activeChapter !== active.id) store.setActiveChapter(active.id);
      if (active.id === "industries") {
        const index = Math.round(steppedIndex(clamp((progress - 0.04) / 0.94), INDUSTRY_STOPS.length));
        if (store.industryIndex !== index) store.setIndustryIndex(index);
      }
    };

    measure();
    gsap.ticker.add(frame);

    const remeasure = (): void => measure();
    window.addEventListener("resize", remeasure);
    window.addEventListener("load", remeasure);
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    void document.fonts?.ready.then(remeasure);

    return () => {
      gsap.ticker.remove(frame);
      stopTrackingScroll();
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", remeasure);
      observer.disconnect();
    };
  }, []);

  return null;
}
