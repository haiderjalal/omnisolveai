"use client";

import { useMemo } from "react";

import { AdditiveBlending, BackSide } from "three";

import { SCENE_COLORS, type GlobeUniforms } from "../constants";
import { createGlobeMaterial, useDisposeMaterial } from "../materials";
import {
  atmosphereFragmentShader,
  atmosphereVertexShader,
  coreFragmentShader,
  coreVertexShader,
} from "../shaders/planet";

interface PlanetBodyProps {
  uniforms: GlobeUniforms;
}

/** Opaque planet body — hides the far side and carries the lit rim. */
export function PlanetCore({ uniforms }: PlanetBodyProps) {
  const material = useMemo(
    () =>
      createGlobeMaterial({
        vertexShader: coreVertexShader,
        fragmentShader: coreFragmentShader,
        uniforms: {
          ...uniforms,
          uCoreA: { value: SCENE_COLORS.coreA },
          uCoreB: { value: SCENE_COLORS.coreB },
          uVoid: { value: SCENE_COLORS.void },
        },
      }),
    [uniforms],
  );
  useDisposeMaterial(material);

  return (
    <mesh renderOrder={0} material={material}>
      <sphereGeometry args={[0.992, 72, 54]} />
    </mesh>
  );
}

/** Soft additive halo around the globe. */
export function Atmosphere({ uniforms }: PlanetBodyProps) {
  const material = useMemo(
    () =>
      createGlobeMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        uniforms,
        side: BackSide,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [uniforms],
  );
  useDisposeMaterial(material);

  return (
    <mesh renderOrder={6} scale={1.16} material={material}>
      <sphereGeometry args={[1, 48, 36]} />
    </mesh>
  );
}
