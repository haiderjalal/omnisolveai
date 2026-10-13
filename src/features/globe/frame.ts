import type { RootState } from "@react-three/fiber";
import type { Group, Points, Vector3 } from "three";

import { live, target, type SceneTarget } from "@/features/story/sceneState";
import { clamp, damp, smoothstep } from "@/utils/math";

import type { GlobeUniforms } from "./constants";
import { NODE_RADIUS } from "./geometry/network";
import { RING_DEFAULTS, ringPoint } from "./geometry/ring";
import { lonLatToVector } from "./geometry/sphere";
import { TAG_ANCHORS, tagScreen } from "./tagAnchors";

/**
 * Per-frame logic for the globe, kept in plain functions outside the React components.
 * The render loop mutates GPU-bound objects (uniforms, transforms) sixty times a second;
 * that imperative work does not belong inside a component body.
 */

const FOV_RADIANS = (35 * Math.PI) / 180;
const DEG = Math.PI / 180;

/** How quickly each scene value chases the scroll-driven target (higher = snappier). */
const DAMP_RATE: Record<keyof SceneTarget, number> = {
  camZ: 3.2,
  fx: 3.2,
  fy: 3.2,
  scale: 3.2,
  rotX: 2.6,
  rotY: 2.6,
  rotZ: 2.6,
  integrity: 2.4,
  dim: 3.4,
  ringScale: 2.6,
  ringTiltX: 2.6,
  ringTiltZ: 2.6,
  ringOpacity: 3,
  focus: 4,
  focusLon: 4,
  focusLat: 4,
  spin: 2,
};
const DAMPED_KEYS = Object.keys(DAMP_RATE) as (keyof SceneTarget)[];

export interface GlobeFrameContext {
  groups: {
    root: Group | null;
    axis: Group | null;
    spin: Group | null;
    ring: Group | null;
  };
  uniforms: GlobeUniforms;
  /** Pointer position in -1..1. */
  pointer: { x: number; y: number };
  /** Scratch vectors, reused every frame to avoid allocating. */
  scratch: { point: Vector3; facing: Vector3; toCamera: Vector3 };
  /** Whether this tier renders the bloom pass (controls how much HDR glow to emit). */
  bloom: boolean;
  /** Reduced motion: one calm frame, nothing is animated towards a target. */
  staticMode: boolean;
}

/** Moves every live value one step towards its scroll-driven target. */
function dampLiveState(dt: number, pointer: GlobeFrameContext["pointer"]): void {
  for (const key of DAMPED_KEYS) live[key] = damp(live[key], target[key], DAMP_RATE[key], dt);

  // Idle spin accumulates only while a chapter asks for it; otherwise it unwinds, so
  // pinned tours land exactly on their target longitude.
  const wrapped = ((((live.idleAngle + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
  live.idleAngle =
    live.spin > 0.02
      ? wrapped + (live.spin + live.scrollVelocity * 0.14) * dt
      : damp(wrapped, 0, 1.6, dt) + live.scrollVelocity * 0.05 * dt;

  live.pointerX = damp(live.pointerX, pointer.x, 2.6, dt);
  live.pointerY = damp(live.pointerY, pointer.y, 2.6, dt);
  live.pulse = damp(live.pulse, 0, 2.2, dt);
  live.dragX = damp(live.dragX, 0, 0.9, dt);
  live.dragY = damp(live.dragY, 0, 0.9, dt);
}

/** One frame of the globe scene: damping, layout, uniforms, and HTML tag projection. */
export function stepGlobeScene(state: RootState, delta: number, context: GlobeFrameContext): void {
  const { groups, uniforms, pointer, scratch, bloom, staticMode } = context;
  const { size, gl, camera, clock } = state;
  const dt = Math.min(delta, 0.05);

  if (!staticMode) dampLiveState(dt, pointer);

  // --- layout: responsive placement of the globe in the viewport -----------------
  const cameraZ = live.camZ + live.introZ;
  const viewHeight = 2 * cameraZ * Math.tan(FOV_RADIANS / 2);
  const aspect = size.width / size.height;
  const viewWidth = viewHeight * aspect;
  const narrow = 1 - smoothstep(0.62, 1.05, aspect); // 0 on desktop → 1 on phones
  const x = live.fx * viewWidth * (1 - narrow);
  // on phones the hero globe rides high, above the copy, then settles to centre as you scroll
  const y = (live.fy + narrow * 0.27 * live.heroVisibility) * viewHeight;
  // never wider than ~85% of a phone screen (55% of the width as a radius on desktop)
  const scale = Math.min(live.scale * (1 - 0.2 * narrow), viewWidth * (0.55 - 0.13 * narrow));

  camera.position.set(live.pointerX * 0.1, live.pointerY * 0.06, cameraZ);
  camera.lookAt(0, 0, 0);

  groups.root?.position.set(x + live.pointerX * 0.05, y + live.pointerY * 0.03, 0);
  groups.root?.scale.setScalar(scale);
  groups.axis?.rotation.set(0, 0, live.rotZ);
  groups.spin?.rotation.set(
    live.rotX + live.pointerY * 0.1 + live.dragY,
    live.rotY + live.idleAngle + live.pointerX * 0.16 + live.dragX,
    0,
  );
  // 'ZYX': dip the ring's plane about X first, then roll it in the screen plane about Z
  groups.ring?.rotation.set(live.ringTiltX, 0, live.ringTiltZ, "ZYX");
  groups.ring?.scale.setScalar(live.ringScale);

  // --- shared shader uniforms ----------------------------------------------------
  uniforms.uTime.value = clock.elapsedTime;
  uniforms.uAssemble.value = live.assemble;
  uniforms.uIntegrity.value = live.integrity;
  uniforms.uPulse.value = live.pulse;
  // content chapters sit directly over the globe on phones, so dim it further there
  uniforms.uDim.value = clamp(live.dim * (1 - 0.42 * narrow * (1 - live.heroVisibility)), 0, 1.2);
  uniforms.uFocus.value = live.focus;
  uniforms.uFocusDir.value.set(...lonLatToVector(live.focusLon, live.focusLat));
  uniforms.uPointScale.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan(FOV_RADIANS / 2));
  uniforms.uHdr.value = bloom ? 1 : 0.35;

  // --- HTML tags tethered to nodes ----------------------------------------------
  const { root, spin } = groups;
  if (!root || !spin) return;
  root.updateMatrixWorld(true);
  const reveal = smoothstep(0.9, 1, live.assemble) * live.heroVisibility;
  TAG_ANCHORS.forEach((anchor, index) => {
    scratch.point
      .set(...lonLatToVector(anchor.lon * DEG, anchor.lat * DEG))
      .multiplyScalar(NODE_RADIUS * 1.01);
    spin.localToWorld(scratch.point);
    // how directly this point faces the camera (1 = head-on, <0 = on the far side)
    scratch.facing.copy(scratch.point).sub(root.position).normalize();
    scratch.toCamera.copy(camera.position).sub(scratch.point).normalize();
    const towardCamera = scratch.facing.dot(scratch.toCamera);
    scratch.point.project(camera);
    const tag = tagScreen[index];
    tag.x = (scratch.point.x * 0.5 + 0.5) * size.width;
    tag.y = (-scratch.point.y * 0.5 + 0.5) * size.height;
    tag.opacity = smoothstep(0.18, 0.5, towardCamera) * reveal;
  });
}

/** Seconds-per-lap factor shared by the ring's shader highlight and the satellite. */
export const RING_LAP_SPEED = 0.075;

export interface RingFrameContext {
  ringUniforms: { uDraw: { value: number }; uOpacity: { value: number } };
  satelliteUniforms: { uReveal: { value: number } };
  satellite: Points | null;
}

/** One frame of the orbit ring: draw-in progress and the satellite riding the arc. */
export function stepOrbitRing(elapsed: number, context: RingFrameContext): void {
  const { ringUniforms, satelliteUniforms, satellite } = context;
  // `* 1.06` so the leading soft edge fully clears the end of the arc once drawn
  ringUniforms.uDraw.value = live.ringDraw * 1.06;
  ringUniforms.uOpacity.value = live.ringOpacity;

  const t = (elapsed * RING_LAP_SPEED) % 1;
  const [x, y, z] = ringPoint(t, RING_DEFAULTS);
  satellite?.position.set(x, y, z);
  const onArc = t <= live.ringDraw ? 1 : 0;
  satelliteUniforms.uReveal.value = onArc * smoothstep(0, 0.06, t) * (1 - smoothstep(0.93, 1, t));
}
