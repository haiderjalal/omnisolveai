"use client";

import { useEffect } from "react";

import Lenis from "lenis";

import { gsap } from "@/lib/gsap";
import { scrollToHash, setLenis } from "@/lib/lenis";
import { useStoryStore } from "@/store/storyStore";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Owns the page's scrolling behaviour:
 *  - Lenis smoothing (momentum only — native scroll is never hijacked),
 *  - hash-link navigation,
 *  - reduced-motion detection, mirrored to <html class="rm"> and the story store.
 * Renders nothing.
 */
export function SmoothScroll(): null {
  useEffect(() => {
    const root = document.documentElement;
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const stopSmoothing = (): void => {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      tick = null;
      setLenis(null);
    };

    const startSmoothing = (): void => {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true });
      setLenis(lenis);
      const instance = lenis;
      tick = (time: number): void => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };

    const applyPreference = (reduced: boolean): void => {
      root.classList.toggle("rm", reduced);
      useStoryStore.getState().setReducedMotion(reduced);
      stopSmoothing();
      if (!reduced) startSmoothing();
    };

    applyPreference(query.matches);
    root.classList.add("ready");

    const onPreferenceChange = (event: MediaQueryListEvent): void => applyPreference(event.matches);
    query.addEventListener("change", onPreferenceChange);

    const onClick = (event: MouseEvent): void => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey)
        return;
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!anchor) return;
      const hash = anchor.getAttribute("href") ?? "";
      if (hash === "#") return;
      if (scrollToHash(hash)) {
        event.preventDefault();
        history.pushState(null, "", hash === "#top" ? window.location.pathname : hash);
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      query.removeEventListener("change", onPreferenceChange);
      stopSmoothing();
    };
  }, []);

  return null;
}
