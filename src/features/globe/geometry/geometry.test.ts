import { describe, expect, it } from "vitest";

import { createRandom } from "@/utils/random";

import { buildLandPoints, LAND_RADIUS } from "./land";
import { buildNetwork, NODE_RADIUS } from "./network";
import { createRingGeometry, ringPoint, RING_DEFAULTS } from "./ring";
import { fibonacciSphere, lonLatToVector } from "./sphere";

const length = (a: Float32Array, i: number): number => Math.hypot(a[i * 3], a[i * 3 + 1], a[i * 3 + 2]);

describe("fibonacciSphere", () => {
  it("returns unit vectors, even with jitter", () => {
    const points = fibonacciSphere(300, 0.1, createRandom(3));
    for (let i = 0; i < 300; i++) expect(length(points, i)).toBeCloseTo(1, 4);
  });
});

describe("lonLatToVector", () => {
  it("puts (0°, 0°) facing the camera and 90°E on the right", () => {
    const [x0, y0, z0] = lonLatToVector(0, 0);
    expect([x0, y0, z0].map((v) => Math.round(v * 1000) / 1000)).toEqual([0, 0, 1]);
    const [x1, , z1] = lonLatToVector(Math.PI / 2, 0);
    expect(x1).toBeCloseTo(1, 5);
    expect(z1).toBeCloseTo(0, 5);
  });
});

describe("buildNetwork", () => {
  it("is deterministic — identical on server and client", () => {
    const a = buildNetwork(120, 7);
    const b = buildNetwork(120, 7);
    expect(Array.from(a.nodes.positions)).toEqual(Array.from(b.nodes.positions));
    expect(a.edges.vertexCount).toBe(b.edges.vertexCount);
  });

  it("places every node on the shell and builds edges between real nodes", () => {
    const { nodes, edges } = buildNetwork(160);
    for (let i = 0; i < nodes.count; i++) expect(length(nodes.positions, i)).toBeCloseTo(NODE_RADIUS, 3);
    expect(edges.vertexCount).toBeGreaterThan(nodes.count); // a connected lattice has more edges than nodes
    expect(edges.vertexCount % 2).toBe(0); // two vertices per edge
  });

  it("gives each edge a 0 → 1 'along' coordinate for the travelling packets", () => {
    const { edges } = buildNetwork(100);
    for (let v = 0; v < edges.vertexCount; v += 2) {
      expect(edges.along[v]).toBe(0);
      expect(edges.along[v + 1]).toBe(1);
    }
  });
});

describe("buildLandPoints", () => {
  it("covers the continents with the requested number of dots, all on the surface", () => {
    const land = buildLandPoints(3000);
    expect(land.count).toBeGreaterThan(2500);
    expect(land.count).toBeLessThanOrEqual(3000);
    for (let i = 0; i < land.count; i += 50) expect(length(land.positions, i)).toBeCloseTo(LAND_RADIUS, 3);
  });

  it("only places dots on land: Europe/Africa have dots, the mid-Pacific has none", () => {
    const land = buildLandPoints(9000);
    const near = (lonDeg: number, latDeg: number, radiusDeg: number): number => {
      const [tx, ty, tz] = lonLatToVector((lonDeg * Math.PI) / 180, (latDeg * Math.PI) / 180);
      let count = 0;
      for (let i = 0; i < land.count; i++) {
        const dot =
          (land.positions[i * 3] * tx + land.positions[i * 3 + 1] * ty + land.positions[i * 3 + 2] * tz) /
          LAND_RADIUS;
        if (Math.acos(Math.min(1, dot)) < (radiusDeg * Math.PI) / 180) count++;
      }
      return count;
    };
    expect(near(20, 5, 12)).toBeGreaterThan(10); // central Africa
    expect(near(10, 48, 8)).toBeGreaterThan(5); // central Europe
    expect(near(-150, 0, 12)).toBe(0); // open Pacific
  });
});

describe("orbit ring", () => {
  it("builds a tapered tube: thin tips, fuller body", () => {
    const geometry = createRingGeometry({ ...RING_DEFAULTS, segments: 40, radial: 6 });
    const position = geometry.getAttribute("position");
    expect(position.count).toBe(41 * 7);
    expect(geometry.getAttribute("aT").getX(0)).toBe(0);
    expect(geometry.getAttribute("aT").getX(position.count - 1)).toBe(1);
  });

  it("starts at the left and sweeps through the FRONT of the globe (positive z)", () => {
    const [, , startZ] = ringPoint(0);
    const [, , midZ] = ringPoint(0.5);
    expect(midZ).toBeGreaterThan(startZ);
    expect(midZ).toBeGreaterThan(RING_DEFAULTS.radius * 0.9);
    expect(ringPoint(0)[0]).toBeLessThan(0);
    expect(ringPoint(1)[0]).toBeGreaterThan(0);
  });
});
