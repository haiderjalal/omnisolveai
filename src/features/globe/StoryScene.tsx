"use client";

import { useEffect } from "react";

import dynamic from "next/dynamic";

import { StoryDriver } from "@/features/story/StoryDriver";
import { useStoryStore } from "@/store/storyStore";

import { CanvasBoundary } from "./CanvasBoundary";
import { detectQualityTier } from "./detectTier";
import { StaticGlobe } from "./StaticGlobe";

// three.js, react-three-fiber and the shaders ship as a separate chunk, fetched after first paint
const StoryCanvas = dynamic(() => import("./StoryCanvas"), { ssr: false });

/** Picks a starting quality tier, runs the scroll→scene driver, and mounts the right backdrop. */
export function StoryScene() {
  const tier = useStoryStore((state) => state.tier);
  const reducedMotion = useStoryStore((state) => state.reducedMotion);
  const setTier = useStoryStore((state) => state.setTier);

  useEffect(() => {
    // `requestIdleCallback` keeps this (and the heavy chunk it unlocks) off the critical path
    const run = (): void => setTier(detectQualityTier());
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(run, { timeout: 800 });
      return () => window.cancelIdleCallback(handle);
    }
    const timeout = setTimeout(run, 150);
    return () => clearTimeout(timeout);
  }, [setTier]);

  return (
    <>
      <StoryDriver />
      {tier === "low" && <StaticGlobe />}
      {(tier === "high" || tier === "medium") && (
        <CanvasBoundary onError={() => setTier("low")}>
          <StoryCanvas tier={tier} staticMode={reducedMotion} />
        </CanvasBoundary>
      )}
    </>
  );
}
