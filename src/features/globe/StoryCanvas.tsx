"use client";

import { useEffect, useRef, useState } from "react";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { live } from "@/features/story/sceneState";
import { gsap } from "@/lib/gsap";
import { useStoryStore } from "@/store/storyStore";

import { GlobeScene } from "./components/GlobeScene";
import { TIER_CONFIG, VOID_HEX, type GlobeTier } from "./constants";
import { isSoftwareRenderer } from "./detectTier";

interface StoryCanvasProps {
  tier: GlobeTier;
  staticMode: boolean;
}

const COMFORTABLE_DPR = 1.5;

/**
 * The one persistent WebGL canvas, fixed behind the whole page. Loaded lazily (see StoryScene)
 * so none of three.js blocks first paint.
 *
 * Order matters: the canvas is created EMPTY, the renderer is inspected, and only then is the
 * scene mounted at the right quality. (Building the full scene first and downgrading afterwards
 * would pay the cost of both on machines that render in software.)
 */
export default function StoryCanvas({ tier, staticMode }: StoryCanvasProps) {
  // null until the renderer has been inspected
  const [software, setSoftware] = useState<boolean | null>(null);
  const effectiveTier: GlobeTier = software ? "medium" : tier;
  const config = TIER_CONFIG[effectiveTier];
  const [dpr, setDpr] = useState(Math.min(TIER_CONFIG[tier].maxDpr, COMFORTABLE_DPR));
  const wrapper = useRef<HTMLDivElement>(null);

  // A static globe can't dim itself in-scene (nothing re-renders), so fade the layer instead.
  useEffect(() => {
    if (!staticMode) return;
    const fade = (): void => {
      if (wrapper.current) wrapper.current.style.opacity = String(0.12 + 0.88 * live.heroVisibility);
    };
    gsap.ticker.add(fade);
    return () => gsap.ticker.remove(fade);
  }, [staticMode]);

  return (
    <div ref={wrapper} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={dpr}
        flat
        frameloop={staticMode ? "demand" : "always"}
        camera={{ fov: 35, near: 0.1, far: 60, position: [0, 0, 5] }}
        gl={{ antialias: effectiveTier === "medium", powerPreference: "high-performance", alpha: false }}
        onCreated={({ gl }) => setSoftware(isSoftwareRenderer(gl.getContext()))}
      >
        <color attach="background" args={[VOID_HEX]} />
        <PerformanceMonitor
          onDecline={() => {
            // sustained low frame-rate: shed pixels first, then drop bloom
            setDpr(1);
            if (tier === "high") useStoryStore.getState().setTier("medium");
          }}
          onIncline={() => setDpr(Math.min(config.maxDpr, COMFORTABLE_DPR))}
        />
        {software !== null && <GlobeScene tier={effectiveTier} staticMode={staticMode} />}
      </Canvas>
    </div>
  );
}
