"use client";

import { useMemo } from "react";

import type { GlobeUniforms } from "../constants";
import { createGeometry } from "../geometry/attributes";
import { buildLandPoints } from "../geometry/land";
import { buildNetwork } from "../geometry/network";
import { createGlobeMaterial, useDisposeMaterial } from "../materials";
import {
  edgeFragmentShader,
  edgeVertexShader,
  nodeFragmentShader,
  nodeVertexShader,
} from "../shaders/network";
import { landFragmentShader, landVertexShader } from "../shaders/planet";

interface LayerProps {
  uniforms: GlobeUniforms;
}

/** The continents as a fine dot-matrix. */
export function LandDots({ uniforms, count }: LayerProps & { count: number }) {
  const geometry = useMemo(() => {
    const land = buildLandPoints(count);
    return createGeometry({
      position: [land.positions, 3],
      aScatter: [land.scatter, 3],
      aRand: [land.random, 1],
      aSize: [land.sizes, 1],
    });
  }, [count]);

  const material = useMemo(
    () =>
      createGlobeMaterial({
        vertexShader: landVertexShader,
        fragmentShader: landFragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  );
  useDisposeMaterial(material);

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={1} />;
}

/** The network lattice — nodes joined by edges that carry travelling data packets. */
export function GlobeNetwork({ uniforms, nodeCount }: LayerProps & { nodeCount: number }) {
  const { nodeGeometry, edgeGeometry } = useMemo(() => {
    const { nodes, edges } = buildNetwork(nodeCount);
    return {
      nodeGeometry: createGeometry({
        position: [nodes.positions, 3],
        aScatter: [nodes.scatter, 3],
        aDrift: [nodes.directions, 3],
        aRand: [nodes.random, 1],
        aSize: [nodes.sizes, 1],
      }),
      edgeGeometry: createGeometry({
        position: [edges.positions, 3],
        aScatter: [edges.scatter, 3],
        aDrift: [edges.directions, 3],
        aNodeRand: [edges.nodeRandom, 1],
        aEdgeRand: [edges.edgeRandom, 1],
        aAlong: [edges.along, 1],
      }),
    };
  }, [nodeCount]);

  const nodeMaterial = useMemo(
    () =>
      createGlobeMaterial({
        vertexShader: nodeVertexShader,
        fragmentShader: nodeFragmentShader,
        uniforms: { ...uniforms, uSizeBoost: { value: 1 } },
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  );
  const edgeMaterial = useMemo(
    () =>
      createGlobeMaterial({
        vertexShader: edgeVertexShader,
        fragmentShader: edgeFragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  );
  useDisposeMaterial(nodeMaterial);
  useDisposeMaterial(edgeMaterial);

  return (
    <>
      <lineSegments geometry={edgeGeometry} material={edgeMaterial} frustumCulled={false} renderOrder={2} />
      <points geometry={nodeGeometry} material={nodeMaterial} frustumCulled={false} renderOrder={3} />
    </>
  );
}
