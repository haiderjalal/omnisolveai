/**
 * Shared, mutable scene state.
 *
 * The 3D loop runs at 60fps and must never trigger React renders, so everything the
 * renderer reads lives in plain module-level objects instead of React state:
 *
 *   scroll position ──▶ computeTarget() ──▶ `target`        (what the story wants)
 *                                              │ damped every frame
 *                                              ▼
 *                                            `live`          (what the renderer draws)
 *
 * Low-frequency UI state (active chapter, quality tier…) lives in the Zustand store.
 */

/** Everything a chapter can ask the globe to do. All values are unitless or radians. */
export interface SceneTarget {
  /** Camera distance from the globe centre. */
  camZ: number;
  /** Globe offset as a fraction of the visible width/height at the globe plane. */
  fx: number;
  fy: number;
  scale: number;
  /** Globe orientation: rotY = spin towards a longitude, rotX = tilt towards a latitude. */
  rotX: number;
  rotY: number;
  /** Constant axis tilt (the logo's globe leans). */
  rotZ: number;
  /** 1 = fully connected network, 0 = scattered nodes. */
  integrity: number;
  /** Global brightness multiplier (content chapters dim the globe for legibility). */
  dim: number;
  ringScale: number;
  ringTiltX: number;
  ringTiltZ: number;
  ringOpacity: number;
  /** 0..1 strength of the "focus cluster" highlight, and where it points. */
  focus: number;
  focusLon: number;
  focusLat: number;
  /** Idle spin speed in rad/s. */
  spin: number;
}

export const BASE_TARGET: Readonly<SceneTarget> = {
  camZ: 4.6,
  fx: 0,
  fy: 0,
  scale: 1,
  rotX: 0.32,
  rotY: -0.35,
  rotZ: -0.28,
  integrity: 1,
  dim: 1,
  ringScale: 1,
  ringTiltX: 0.42,
  ringTiltZ: 0.55,
  ringOpacity: 1,
  focus: 0,
  focusLon: 0,
  focusLat: 0,
  spin: 0,
};

export const TARGET_KEYS = Object.keys(BASE_TARGET) as (keyof SceneTarget)[];

/** Values the renderer reads each frame: damped targets plus non-scroll-driven extras. */
export interface LiveState extends SceneTarget {
  /** Intro: 0 = nodes scattered in the dark, 1 = assembled globe. */
  assemble: number;
  /** Intro: how much of the orbit ring has been drawn (0..1). */
  ringDraw: number;
  /** Intro: extra camera distance that pulls in as the globe forms. */
  introZ: number;
  /** Accumulated idle rotation (radians) added on top of `rotY`. */
  idleAngle: number;
  /** Pointer position in -1..1, used for parallax. */
  pointerX: number;
  pointerY: number;
  /** Extra rotation from the user dragging the hero globe. */
  dragX: number;
  dragY: number;
  /** Smoothed scroll velocity (screen-heights per second), adds spin + warp. */
  scrollVelocity: number;
  /** One-shot energy 0..1 that decays — set it to make the whole network flash. */
  pulse: number;
  /** Hero tag visibility (1 while the hero is the active chapter). */
  heroVisibility: number;
}

export const live: LiveState = {
  ...BASE_TARGET,
  assemble: 0,
  ringDraw: 0,
  introZ: 2.4,
  idleAngle: 0,
  pointerX: 0,
  pointerY: 0,
  dragX: 0,
  dragY: 0,
  scrollVelocity: 0,
  pulse: 0,
  heroVisibility: 1,
};

/** What the scroll position currently asks for. Written by the story driver. */
export const target: SceneTarget = { ...BASE_TARGET };

/** 0..1 progress of each chapter, refreshed every frame by the story driver. */
export const chapterProgress: Record<string, number> = {};

/** Triggers a network-wide flash (e.g. when a team role is picked). */
export function firePulse(strength = 1): void {
  live.pulse = Math.max(live.pulse, strength);
}
