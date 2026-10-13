"use client";

import { useEffect } from "react";

import { gsap } from "@/lib/gsap";
import { observeReveal } from "@/lib/reveal";

type QuickSetter = (value: number) => unknown;

interface PointerTargets {
  tilt: { rotateX: QuickSetter; rotateY: QuickSetter };
  magnet: { moveX: QuickSetter; moveY: QuickSetter };
}

const REVEAL_SELECTOR = '[data-reveal], [data-split="view"], [data-draw], [data-odo]';
const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const MAGNET_STRENGTH = 0.3;
const DEFAULT_TILT = 7;

/**
 * One small client component that powers the page's decorative interactions for ALL the
 * static, server-rendered markup:
 *
 *   - scroll reveals   → watches every [data-reveal] / split-text / draw / odometer element,
 *   - card tilt + spotlight → [data-tilt] elements follow the pointer,
 *   - magnetic buttons  → [data-magnetic] elements lean towards the pointer.
 *
 * Doing this once (instead of one client component per element) keeps hydration cheap:
 * the markup stays plain HTML and only this controller needs JavaScript. Renders nothing.
 */
export function PageEffects(): null {
  useEffect(() => {
    const stopObserving = Array.from(document.querySelectorAll(REVEAL_SELECTOR)).map((element) =>
      observeReveal(element),
    );
    return () => stopObserving.forEach((stop) => stop());
  }, []);

  useEffect(() => {
    const media = gsap.matchMedia();

    media.add(FINE_POINTER, () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const tilting = new WeakMap<HTMLElement, PointerTargets["tilt"]>();
      const leaning = new WeakMap<HTMLElement, PointerTargets["magnet"]>();
      let activeTilt: HTMLElement | null = null;
      let activeMagnet: HTMLElement | null = null;

      const tiltFor = (element: HTMLElement): PointerTargets["tilt"] => {
        let setters = tilting.get(element);
        if (!setters) {
          gsap.set(element, { transformPerspective: 900, transformOrigin: "center" });
          setters = {
            rotateX: gsap.quickTo(element, "rotationX", { duration: 0.6, ease: "power3.out" }),
            rotateY: gsap.quickTo(element, "rotationY", { duration: 0.6, ease: "power3.out" }),
          };
          tilting.set(element, setters);
        }
        return setters;
      };

      const magnetFor = (element: HTMLElement): PointerTargets["magnet"] => {
        let setters = leaning.get(element);
        if (!setters) {
          setters = {
            moveX: gsap.quickTo(element, "x", { duration: 0.55, ease: "power3.out" }),
            moveY: gsap.quickTo(element, "y", { duration: 0.55, ease: "power3.out" }),
          };
          leaning.set(element, setters);
        }
        return setters;
      };

      const releaseTilt = (element: HTMLElement | null): void => {
        if (!element || reducedMotion.matches) return;
        const setters = tilting.get(element);
        setters?.rotateX(0);
        setters?.rotateY(0);
      };

      const releaseMagnet = (element: HTMLElement | null): void => {
        if (!element) return;
        const setters = leaning.get(element);
        setters?.moveX(0);
        setters?.moveY(0);
      };

      const onPointerMove = (event: PointerEvent): void => {
        if (event.pointerType !== "mouse") return;
        const origin = event.target instanceof Element ? event.target : null;

        const tiltTarget = origin?.closest<HTMLElement>("[data-tilt]") ?? null;
        if (tiltTarget !== activeTilt) {
          releaseTilt(activeTilt);
          activeTilt = tiltTarget;
        }
        if (activeTilt) {
          const rect = activeTilt.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          activeTilt.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
          activeTilt.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
          if (!reducedMotion.matches) {
            const max = Number(activeTilt.dataset.tiltMax ?? DEFAULT_TILT);
            const setters = tiltFor(activeTilt);
            setters.rotateY((px - 0.5) * 2 * max);
            setters.rotateX(-(py - 0.5) * 2 * max);
          }
        }

        const magnetTarget = origin?.closest<HTMLElement>("[data-magnetic]") ?? null;
        if (magnetTarget !== activeMagnet) {
          releaseMagnet(activeMagnet);
          activeMagnet = magnetTarget;
        }
        if (activeMagnet && !reducedMotion.matches) {
          const rect = activeMagnet.getBoundingClientRect();
          const setters = magnetFor(activeMagnet);
          setters.moveX((event.clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH);
          setters.moveY((event.clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH);
        }
      };

      const onPointerLeaveWindow = (): void => {
        releaseTilt(activeTilt);
        releaseMagnet(activeMagnet);
        activeTilt = null;
        activeMagnet = null;
      };

      document.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeaveWindow);
      return () => {
        document.removeEventListener("pointermove", onPointerMove);
        document.documentElement.removeEventListener("pointerleave", onPointerLeaveWindow);
      };
    });

    return () => media.revert();
  }, []);

  return null;
}
