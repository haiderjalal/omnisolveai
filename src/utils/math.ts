/** Small, pure numeric helpers shared by the 3D scene and the scroll driver. */

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** 0 → 1 as `value` moves from `edge0` to `edge1`, eased (same curve as GLSL smoothstep). */
export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Frame-rate independent exponential damping.
 * `lambda` ≈ how fast the value catches up (higher = snappier).
 */
export function damp(current: number, target: number, lambda: number, deltaSeconds: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * deltaSeconds));
}

/** Shortest-path angular interpolation (radians). */
export function lerpAngle(from: number, to: number, t: number): number {
  const twoPi = Math.PI * 2;
  const delta = ((((to - from) % twoPi) + Math.PI * 3) % twoPi) - Math.PI;
  return from + delta * t;
}

/**
 * Maps progress 0..1 across `count` stops to a continuous index, holding on each
 * stop for `hold` of its segment before easing to the next. Used by pinned tours.
 */
export function steppedIndex(progress: number, count: number, hold = 0.62): number {
  const scaled = clamp(progress) * count;
  const base = Math.min(count - 1, Math.floor(scaled));
  const local = scaled - base;
  const move = smoothstep(hold, 1, local);
  return Math.min(count - 1, base + (base < count - 1 ? move : 0));
}
