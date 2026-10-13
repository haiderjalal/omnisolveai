"use client";

import { useEffect, useMemo, useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Group, Vector3 } from "three";

import { getInitialTarget } from "@/features/story/chapters";
import { live } from "@/features/story/sceneState";
import { gsap } from "@/lib/gsap";
import { useStoryStore } from "@/store/storyStore";

import { TIER_CONFIG, VOID_HEX, createGlobeUniforms, type GlobeTier } from "../constants";
import { stepGlobeScene } from "../frame";

import { Dust } from "./Dust";
import { GlobeNetwork, LandDots } from "./GlobeNetwork";
import { OrbitRing } from "./OrbitRing";
import { Atmosphere, PlanetCore } from "./PlanetBody";

const INTRO_SEEN_KEY = "omnisolve-intro-seen";

interface GlobeSceneProps {
  tier: GlobeTier;
  /** Reduced motion: render one calm frame of the assembled globe, no choreography. */
  staticMode: boolean;
}

/** The whole 3D scene: globe, ring, dust, and the glue between React and the frame loop. */
export function GlobeScene({ tier, staticMode }: GlobeSceneProps) {
  const config = TIER_CONFIG[tier];
  const uniforms = useMemo(() => createGlobeUniforms(), []);
  const invalidate = useThree((state) => state.invalidate);

  const root = useRef<Group>(null);
  const axis = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const ring = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scratch = useMemo(
    () => ({ point: new Vector3(), facing: new Vector3(), toCamera: new Vector3() }),
    [],
  );

  useEffect(() => {
    const onMove = (event: PointerEvent): void => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Intro: the network assembles out of the dark, the ring draws itself, the camera settles.
  useEffect(() => {
    const store = useStoryStore.getState();

    if (staticMode) {
      Object.assign(live, getInitialTarget(), { assemble: 1, ringDraw: 1, introZ: 0 });
      store.setSceneReady(true);
      invalidate();
      return;
    }

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
      window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // storage can be unavailable (private mode); the full intro simply plays
    }
    const pace = seen ? 0.5 : 1;

    const timeline = gsap.timeline();
    timeline
      .fromTo(live, { assemble: 0 }, { assemble: 1, duration: 2.8 * pace, ease: "power2.inOut" }, 0)
      .fromTo(live, { ringDraw: 0 }, { ringDraw: 1, duration: 1.8 * pace, ease: "power3.inOut" }, 1.0 * pace)
      .fromTo(live, { introZ: 2.6 }, { introZ: 0, duration: 3.2 * pace, ease: "expo.out" }, 0);
    store.setSceneReady(true);

    return () => {
      timeline.kill();
    };
  }, [staticMode, invalidate]);

  useFrame((state, delta) => {
    stepGlobeScene(state, delta, {
      groups: { root: root.current, axis: axis.current, spin: spin.current, ring: ring.current },
      uniforms,
      pointer: pointer.current,
      scratch,
      bloom: config.bloom,
      staticMode,
    });
  });

  return (
    <>
      <color attach="background" args={[VOID_HEX]} />
      <group ref={root}>
        <group ref={axis}>
          <group ref={spin}>
            <PlanetCore uniforms={uniforms} />
            <LandDots uniforms={uniforms} count={config.landDots} />
            <GlobeNetwork uniforms={uniforms} nodeCount={config.nodes} />
          </group>
        </group>
        <group ref={ring}>
          <OrbitRing uniforms={uniforms} segments={config.ringSegments} />
        </group>
        <Atmosphere uniforms={uniforms} />
      </group>
      <Dust uniforms={uniforms} count={config.dust} />
      {config.bloom && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.92}
            luminanceSmoothing={0.25}
            mipmapBlur
            radius={0.7}
          />
        </EffectComposer>
      )}
    </>
  );
}
