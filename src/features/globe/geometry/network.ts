import { createRandom } from "@/utils/random";

import { fibonacciSphere, randomDirection } from "./sphere";

/** Nodes sit slightly above the land dots so the network reads as a layer on the planet. */
export const NODE_RADIUS = 1.014;

export interface NetworkNodes {
  count: number;
  /** Resting position on the globe (xyz). */
  positions: Float32Array;
  /** Where the node starts the intro, far from the globe (xyz). */
  scatter: Float32Array;
  /** Random unit direction the node drifts along when the network breaks apart (xyz). */
  directions: Float32Array;
  random: Float32Array;
  /** World-space diameter of the node sprite. */
  sizes: Float32Array;
}

export interface NetworkEdges {
  /** Vertex count (2 per edge). */
  vertexCount: number;
  positions: Float32Array;
  scatter: Float32Array;
  directions: Float32Array;
  nodeRandom: Float32Array;
  edgeRandom: Float32Array;
  /** 0 at the first endpoint, 1 at the second — lets the shader slide "data packets" along. */
  along: Float32Array;
}

export interface NetworkData {
  nodes: NetworkNodes;
  edges: NetworkEdges;
}

const NEIGHBOURS_PER_NODE = 3;
/** Edges longer than this multiple of the average nearest-neighbour distance are dropped. */
const MAX_EDGE_STRETCH = 2.1;

/**
 * Builds the network that wraps the globe: jittered Fibonacci nodes joined to their nearest
 * neighbours — the same "polygon lattice" look as the OmniSolve logo. Fully deterministic.
 */
export function buildNetwork(nodeCount: number, seed = 7): NetworkData {
  const random = createRandom(seed);
  const unit = fibonacciSphere(nodeCount, 0.09, random);

  const positions = new Float32Array(nodeCount * 3);
  const scatter = new Float32Array(nodeCount * 3);
  const directions = new Float32Array(nodeCount * 3);
  const nodeRandom = new Float32Array(nodeCount);
  const sizes = new Float32Array(nodeCount);

  for (let i = 0; i < nodeCount; i++) {
    positions[i * 3] = unit[i * 3] * NODE_RADIUS;
    positions[i * 3 + 1] = unit[i * 3 + 1] * NODE_RADIUS;
    positions[i * 3 + 2] = unit[i * 3 + 2] * NODE_RADIUS;

    const away = randomDirection(random);
    const distance = 2.6 + random() * 5.5;
    scatter[i * 3] = away[0] * distance;
    scatter[i * 3 + 1] = away[1] * distance * 0.8;
    scatter[i * 3 + 2] = away[2] * distance - 1.5;

    const drift = randomDirection(random);
    directions[i * 3] = drift[0];
    directions[i * 3 + 1] = drift[1];
    directions[i * 3 + 2] = drift[2];

    nodeRandom[i] = random();
    // a few large hub nodes among many small ones — like the logo
    const roll = random();
    sizes[i] = roll > 0.9 ? 0.05 + random() * 0.018 : 0.022 + random() * 0.022;
  }

  // k-nearest-neighbour edges, de-duplicated
  const edgeKeys = new Set<number>();
  const pairs: [number, number][] = [];
  let nearestSum = 0;
  const candidates: { index: number; distance: number }[] = [];

  for (let i = 0; i < nodeCount; i++) {
    candidates.length = 0;
    for (let j = 0; j < nodeCount; j++) {
      if (i === j) continue;
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      candidates.push({ index: j, distance: Math.hypot(dx, dy, dz) });
    }
    candidates.sort((a, b) => a.distance - b.distance);
    nearestSum += candidates[0].distance;
    for (let k = 0; k < NEIGHBOURS_PER_NODE; k++) {
      const { index } = candidates[k];
      const low = Math.min(i, index);
      const high = Math.max(i, index);
      const key = low * nodeCount + high;
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      pairs.push([low, high]);
    }
  }

  const averageNearest = nearestSum / nodeCount;
  const maxLength = averageNearest * MAX_EDGE_STRETCH;
  const kept = pairs.filter(([a, b]) => {
    const dx = positions[a * 3] - positions[b * 3];
    const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
    const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
    return Math.hypot(dx, dy, dz) <= maxLength;
  });

  const vertexCount = kept.length * 2;
  const edges: NetworkEdges = {
    vertexCount,
    positions: new Float32Array(vertexCount * 3),
    scatter: new Float32Array(vertexCount * 3),
    directions: new Float32Array(vertexCount * 3),
    nodeRandom: new Float32Array(vertexCount),
    edgeRandom: new Float32Array(vertexCount),
    along: new Float32Array(vertexCount),
  };

  kept.forEach(([a, b], edgeIndex) => {
    const edgeValue = random();
    [a, b].forEach((node, endpoint) => {
      const v = edgeIndex * 2 + endpoint;
      for (let c = 0; c < 3; c++) {
        edges.positions[v * 3 + c] = positions[node * 3 + c];
        edges.scatter[v * 3 + c] = scatter[node * 3 + c];
        edges.directions[v * 3 + c] = directions[node * 3 + c];
      }
      edges.nodeRandom[v] = nodeRandom[node];
      edges.edgeRandom[v] = edgeValue;
      edges.along[v] = endpoint;
    });
  });

  return {
    nodes: { count: nodeCount, positions, scatter, directions, random: nodeRandom, sizes },
    edges,
  };
}
