"use client";

import { useEffect, useRef } from "react";

import { firePulse } from "@/features/story/sceneState";

/**
 * Invisible marker: each time it scrolls into view the globe sends a network-wide pulse.
 * Used by the finale so the "solved" moment is felt, not just read.
 */
export function PulseOnEnter() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = marker.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) firePulse(1);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <span ref={marker} aria-hidden="true" className="absolute top-1/2 left-1/2 size-px" />;
}
