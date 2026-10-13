"use client";

import { useMemo, useRef } from "react";

import { useFrame } from "@react-three/fiber";
import { DoubleSide, type Points } from "three";

import type { GlobeUniforms } from "../constants";
import { stepOrbitRing } from "../frame";
import { createGeometry } from "../geometry/attributes";
import { RING_DEFAULTS, createRingGeometry } from "../geometry/ring";
import { createGlobeMaterial, useDisposeMaterial } from "../materials";
import { glowFragmentShader, glowVertexShader, ringFragmentShader, ringVertexShader } from "../shaders/ring";

interface OrbitRingProps {
  uniforms: GlobeUniforms;
  segments: number;
}

/**
 * The logo's orbit swoosh, rebuilt in 3D. It draws itself in during the intro and a
 * bright satellite travels along it. Lives inside a group the scene tilts and scales.
 */
export function OrbitRing({ uniforms, segments }: OrbitRingProps) {
  const geometry = useMemo(() => createRingGeometry({ ...RING_DEFAULTS, segments }), [segments]);
  const ringUniforms = useMemo(
    () => ({ ...uniforms, uDraw: { value: 0 }, uOpacity: { value: 1 } }),
    [uniforms],
  );
  const satelliteUniforms = useMemo(
    () => ({
      ...uniforms,
      uSize: { value: 0.2 },
      uIntensity: { value: 3.6 },
      uAlpha: { value: 1 },
      uMix: { value: 0.95 },
      uReveal: { value: 0 },
    }),
    [uniforms],
  );
  const ringMaterial = useMemo(
    () =>
      createGlobeMaterial({
        vertexShader: ringVertexShader,
        fragmentShader: ringFragmentShader,
        uniforms: ringUniforms,
        transparent: true,
        depthWrite: false,
        // the arc is wound in the negative direction, so render both faces
        side: DoubleSide,
      }),
    [ringUniforms],
  );
  const satelliteMaterial = useMemo(
    () =>
      createGlobeMaterial({
        vertexShader: glowVertexShader,
        fragmentShader: glowFragmentShader,
        uniforms: satelliteUniforms,
        transparent: true,
        depthWrite: false,
      }),
    [satelliteUniforms],
  );
  useDisposeMaterial(ringMaterial);
  useDisposeMaterial(satelliteMaterial);

  const satelliteGeometry = useMemo(
    () =>
      createGeometry({
        position: [new Float32Array([0, 0, 0]), 3],
        aRand: [new Float32Array([0.35]), 1],
      }),
    [],
  );
  const satellite = useRef<Points>(null);

  useFrame((state) => {
    stepOrbitRing(state.clock.elapsedTime, {
      ringUniforms,
      satelliteUniforms,
      satellite: satellite.current,
    });
  });

  return (
    <>
      <mesh geometry={geometry} material={ringMaterial} renderOrder={4} frustumCulled={false} />
      <points
        ref={satellite}
        geometry={satelliteGeometry}
        material={satelliteMaterial}
        frustumCulled={false}
        renderOrder={5}
      />
    </>
  );
}
