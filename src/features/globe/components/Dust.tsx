"use client";

import { useMemo, useRef } from "react";

import { useFrame } from "@react-three/fiber";
import type { Points } from "three";

import { createRandom } from "@/utils/random";

import type { GlobeUniforms } from "../constants";
import { createGeometry } from "../geometry/attributes";
import { randomDirection } from "../geometry/sphere";
import { createGlobeMaterial, useDisposeMaterial } from "../materials";
import { glowFragmentShader, glowVertexShader } from "../shaders/ring";

interface DustProps {
  uniforms: GlobeUniforms;
  count: number;
}

/** Sparse depth-layered dust that gives the void scale and parallax. */
export function Dust({ uniforms, count }: DustProps) {
  const geometry = useMemo(() => {
    const random = createRandom(99);
    const positions = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const [x, y, z] = randomDirection(random);
      const radius = 3.6 + random() * 8;
      positions[i * 3] = x * radius;
      positions[i * 3 + 1] = y * radius * 0.75;
      // keep dust behind the camera plane so nothing balloons into the lens
      positions[i * 3 + 2] = (z > 0.35 ? -z : z) * radius;
      rand[i] = random();
    }
    return createGeometry({ position: [positions, 3], aRand: [rand, 1] });
  }, [count]);

  const material = useMemo(
    () =>
      createGlobeMaterial({
        vertexShader: glowVertexShader,
        fragmentShader: glowFragmentShader,
        uniforms: {
          ...uniforms,
          uSize: { value: 0.03 },
          uIntensity: { value: 0.85 },
          uAlpha: { value: 0.55 },
          uMix: { value: 0.6 },
          uReveal: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  );
  useDisposeMaterial(material);

  const points = useRef<Points>(null);
  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += Math.min(delta, 0.05) * 0.012;
  });

  return (
    <points ref={points} geometry={geometry} material={material} frustumCulled={false} renderOrder={0} />
  );
}
