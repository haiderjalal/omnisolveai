import { BufferAttribute, BufferGeometry } from "three";

export interface RingOptions {
  radius: number;
  /** Start angle (radians) of the arc in the ring's own plane. */
  startAngle: number;
  /** Arc length in radians. */
  span: number;
  segments: number;
  radial: number;
  maxTube: number;
}

/**
 * Mirrors the logo's swoosh: the arc runs from the thick lower-left, sweeps across the FRONT
 * of the globe and tapers to a fine tip at the upper-right. In the ring's own plane, +z faces
 * the camera, so angles increasing from 0° towards 90° move to the front; we travel from
 * ~198° (left) back through the front (90°) to ~-18° (right), i.e. a negative span.
 */
export const RING_DEFAULTS: RingOptions = {
  radius: 1.27,
  startAngle: Math.PI * 1.1,
  span: -Math.PI * 1.14,
  segments: 220,
  radial: 10,
  maxTube: 0.03,
};

/** Tube thickness along the arc: tapered at both ends, fuller towards the start (like the logo's swoosh). */
function thickness(t: number): number {
  const body = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t))), 0.85);
  const lean = 1.2 - 0.62 * t;
  return Math.max(0.0, body * lean);
}

/** Position on the ring's centre line for parameter t ∈ [0, 1] (in the ring's local XZ plane). */
export function ringPoint(t: number, options: RingOptions = RING_DEFAULTS): [number, number, number] {
  const angle = options.startAngle + options.span * t;
  return [options.radius * Math.cos(angle), 0, options.radius * Math.sin(angle)];
}

/**
 * A tapered tube along an arc. Attribute `aT` (0..1 along the arc) drives the colour
 * gradient, draw-in animation and the travelling highlight in the shader.
 */
export function createRingGeometry(options: RingOptions = RING_DEFAULTS): BufferGeometry {
  const { radius, startAngle, span, segments, radial, maxTube } = options;
  const vertexCount = (segments + 1) * (radial + 1);
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const along = new Float32Array(vertexCount);
  const indices: number[] = [];

  for (let s = 0; s <= segments; s++) {
    const t = s / segments;
    const angle = startAngle + span * t;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const tube = maxTube * thickness(t);

    for (let r = 0; r <= radial; r++) {
      const phi = (r / radial) * Math.PI * 2;
      // cross-section lies in the plane spanned by the outward radial (cos, 0, sin) and up (0, 1, 0)
      const nx = Math.cos(phi) * cos;
      const ny = Math.sin(phi);
      const nz = Math.cos(phi) * sin;
      const v = s * (radial + 1) + r;
      positions[v * 3] = radius * cos + tube * nx;
      positions[v * 3 + 1] = tube * ny;
      positions[v * 3 + 2] = radius * sin + tube * nz;
      normals[v * 3] = nx;
      normals[v * 3 + 1] = ny;
      normals[v * 3 + 2] = nz;
      along[v] = t;
    }
  }

  for (let s = 0; s < segments; s++) {
    for (let r = 0; r < radial; r++) {
      const a = s * (radial + 1) + r;
      const b = a + radial + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new BufferAttribute(normals, 3));
  geometry.setAttribute("aT", new BufferAttribute(along, 1));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}
