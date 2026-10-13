"use client";

import { useEffect, useRef } from "react";

import { live } from "@/features/story/sceneState";
import { clamp } from "@/utils/math";

const DRAG_SPEED_X = 0.006;
const DRAG_SPEED_Y = 0.004;
const MAX_TILT = 0.55;

/**
 * Invisible surface over the globe that lets mouse users spin it. Touch is deliberately
 * ignored so vertical scrolling on phones is never captured. The globe eases back on release.
 */
export function HeroDragZone() {
  const zone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = zone.current;
    if (!element) return;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (event: PointerEvent): void => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      element.setPointerCapture(event.pointerId);
      element.style.cursor = "grabbing";
    };
    const onMove = (event: PointerEvent): void => {
      if (!dragging) return;
      live.dragX += (event.clientX - lastX) * DRAG_SPEED_X;
      live.dragY = clamp(live.dragY + (event.clientY - lastY) * DRAG_SPEED_Y, -MAX_TILT, MAX_TILT);
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onUp = (event: PointerEvent): void => {
      if (!dragging) return;
      dragging = false;
      element.releasePointerCapture(event.pointerId);
      element.style.cursor = "grab";
    };

    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointercancel", onUp);
    return () => {
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      ref={zone}
      aria-hidden="true"
      className="absolute top-0 right-0 hidden h-full w-[52%] cursor-grab touch-pan-y md:block"
    />
  );
}
