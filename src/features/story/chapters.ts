import { clamp, easeInOutCubic, lerp, smoothstep, steppedIndex } from "@/utils/math";

import { BASE_TARGET, TARGET_KEYS, type SceneTarget } from "./sceneState";

/** Order here is the order of the story. */
export const CHAPTER_IDS = [
  "hero",
  "gap",
  "industries",
  "services",
  "proof",
  "team",
  "trust",
  "plans",
  "people",
  "cta",
  "contact",
] as const;

export type ChapterId = (typeof CHAPTER_IDS)[number];

export interface ChapterMeta {
  id: ChapterId;
  /** Short label for the chapter rail and nav. */
  label: string;
  /** DOM anchor id of the chapter's section. */
  anchor: string;
}

export const CHAPTERS: readonly ChapterMeta[] = [
  { id: "hero", label: "Start", anchor: "top" },
  { id: "gap", label: "The gap", anchor: "gap" },
  { id: "industries", label: "Industries", anchor: "industries" },
  { id: "services", label: "Services", anchor: "services" },
  { id: "proof", label: "Proof", anchor: "proof" },
  { id: "team", label: "Team", anchor: "team" },
  { id: "trust", label: "Trust", anchor: "security" },
  { id: "plans", label: "Plans", anchor: "pricing" },
  { id: "people", label: "People", anchor: "people" },
  { id: "cta", label: "Solved", anchor: "solved" },
  { id: "contact", label: "Contact", anchor: "contact" },
];

/**
 * `sticky` chapters are tall wrappers with a sticky stage: progress runs while the stage is
 * pinned. `flow` chapters scroll normally: progress runs while the section crosses the
 * viewport centre.
 */
type ChapterMode = "sticky" | "flow";

interface ChapterDefinition {
  id: ChapterId;
  mode: ChapterMode;
  to: Partial<SceneTarget>;
  /** Overrides applied to `from` for the very first chapter only. */
  from?: Partial<SceneTarget>;
  /** Optional per-frame refinement (tours, scrubbed values). `from` = the state the chapter began in. */
  during?: (progress: number, out: SceneTarget, from: SceneTarget) => void;
}

/** Longitude / latitude (degrees) each industry stop brings to the front. */
export const INDUSTRY_STOPS: readonly { lon: number; lat: number }[] = [
  { lon: -98, lat: 38 }, // North America
  { lon: -58, lat: -14 }, // South America
  { lon: 12, lat: 48 }, // Europe
  { lon: 38, lat: 8 }, // Africa / Middle East
  { lon: 104, lat: 28 }, // Asia
];

const DEG = Math.PI / 180;

const DEFINITIONS: readonly ChapterDefinition[] = [
  {
    id: "hero",
    mode: "flow",
    from: { camZ: 4.5, fx: 0.285, scale: 1.0, spin: 0.07 },
    to: { camZ: 4.7, fx: 0.24, scale: 0.98, dim: 0.9, spin: 0.05 },
  },
  {
    id: "gap",
    mode: "sticky",
    to: {
      camZ: 3.6,
      fx: 0.06,
      fy: 0,
      scale: 1.12,
      integrity: 0.1,
      dim: 0.4,
      spin: 0.015,
      ringScale: 1.25,
      ringOpacity: 0.55,
      // pre-aim the (still invisible) focus at the first industry stop, so the tour starts without a jump
      focusLon: INDUSTRY_STOPS[0].lon * DEG,
      focusLat: INDUSTRY_STOPS[0].lat * DEG,
    },
    during: (p, out) => {
      // the network visibly comes apart as the statement lands
      out.integrity = lerp(1, 0.08, smoothstep(0.08, 0.85, p));
    },
  },
  {
    id: "industries",
    mode: "sticky",
    to: {
      camZ: 4.5,
      fx: 0.31,
      fy: 0,
      scale: 0.94,
      integrity: 1,
      dim: 1,
      focus: 1,
      spin: 0,
      ringScale: 1.0,
      ringOpacity: 0.3,
      // end exactly on the last stop so the next chapter starts from where the tour finished
      rotY: -INDUSTRY_STOPS[INDUSTRY_STOPS.length - 1].lon * DEG,
      rotX: INDUSTRY_STOPS[INDUSTRY_STOPS.length - 1].lat * DEG * 0.85,
      focusLon: INDUSTRY_STOPS[INDUSTRY_STOPS.length - 1].lon * DEG,
      focusLat: INDUSTRY_STOPS[INDUSTRY_STOPS.length - 1].lat * DEG,
    },
    during: (p, out, from) => {
      // reconnect the network, then tour the five industry clusters
      out.integrity = lerp(0.08, 1, smoothstep(0.0, 0.2, p));
      const index = steppedIndex(clamp((p - 0.04) / 0.94), INDUSTRY_STOPS.length);
      const base = Math.floor(index);
      const next = Math.min(INDUSTRY_STOPS.length - 1, base + 1);
      const t = index - base;
      const a = INDUSTRY_STOPS[base];
      const b = INDUSTRY_STOPS[next];
      const lon = lerp(a.lon, b.lon, t);
      const lat = lerp(a.lat, b.lat, t);
      // ease into the tour from wherever the previous chapter left the globe
      const enter = smoothstep(0, 0.1, p);
      out.rotY = lerp(from.rotY, -lon * DEG, enter);
      out.rotX = lerp(from.rotX, lat * DEG * 0.85, enter);
      out.focusLon = lon * DEG;
      out.focusLat = lat * DEG;
      out.focus = smoothstep(0, 0.12, p);
    },
  },
  {
    id: "services",
    mode: "sticky",
    to: {
      camZ: 5.6,
      fx: 0,
      fy: 0.02,
      scale: 0.7,
      rotX: 0.22,
      rotY: 0.6,
      integrity: 1,
      dim: 0.34,
      // flat "Saturn" ring behind the service carousel
      focus: 0,
      ringScale: 1.75,
      ringTiltX: 0.2,
      ringTiltZ: 0.04,
      ringOpacity: 0.85,
      spin: 0.04,
    },
  },
  {
    id: "proof",
    mode: "flow",
    to: {
      camZ: 5.6,
      fx: 0.34,
      fy: -0.06,
      scale: 0.86,
      rotY: -0.2,
      dim: 0.26,
      ringScale: 1.1,
      ringTiltX: 0.42,
      ringTiltZ: 0.55,
      ringOpacity: 0.25,
      spin: 0.03,
    },
  },
  {
    id: "team",
    mode: "flow",
    to: { camZ: 5.6, fx: -0.34, fy: 0.04, scale: 0.86, rotY: 0.9, dim: 0.3, spin: 0.03 },
  },
  {
    id: "trust",
    mode: "flow",
    to: { camZ: 5.6, fx: 0.32, fy: -0.02, scale: 0.88, rotY: 2.2, dim: 0.26, spin: 0.03 },
  },
  {
    id: "plans",
    mode: "flow",
    to: { camZ: 6.2, fx: 0, fy: 0, scale: 1.25, rotY: 3.4, dim: 0.18, spin: 0.02 },
  },
  {
    id: "people",
    mode: "flow",
    to: { camZ: 6.2, fx: -0.2, fy: 0.02, scale: 1.1, rotY: 4.4, dim: 0.2, spin: 0.02 },
  },
  {
    id: "cta",
    mode: "flow",
    // the globe lights up fully by the time the closing statement is centred
    during: (p, out, from) => {
      const k = smoothstep(0, 0.45, p);
      out.dim = lerp(from.dim, 1, k);
      out.ringOpacity = lerp(from.ringOpacity, 1, k);
    },
    to: {
      camZ: 4.5,
      fx: 0,
      fy: 0,
      scale: 1.12,
      rotX: 0.32,
      rotY: 5.9,
      rotZ: -0.28,
      dim: 1,
      integrity: 1,
      ringScale: 1,
      ringTiltX: 0.42,
      ringTiltZ: 0.55,
      ringOpacity: 1,
      spin: 0.08,
    },
  },
  {
    id: "contact",
    mode: "flow",
    // dim quickly: the FAQ and form need a calm backdrop, not a lit globe
    during: (p, out, from) => {
      const k = smoothstep(0, 0.05, p);
      out.dim = lerp(from.dim, 0.3, k);
      out.ringOpacity = lerp(from.ringOpacity, 0.3, k);
    },
    to: { camZ: 5.4, fx: 0.3, fy: 0, scale: 0.95, dim: 0.3, ringOpacity: 0.3, spin: 0.03 },
  },
];

interface ResolvedChapter {
  id: ChapterId;
  mode: ChapterMode;
  from: SceneTarget;
  to: SceneTarget;
  during?: ChapterDefinition["during"];
}

/** Each chapter starts exactly where the previous one ended, so the globe never jumps. */
const RESOLVED: readonly ResolvedChapter[] = (() => {
  const result: ResolvedChapter[] = [];
  DEFINITIONS.forEach((definition, index) => {
    const previousTo = index === 0 ? BASE_TARGET : result[index - 1].to;
    const from: SceneTarget = { ...previousTo, ...(definition.from ?? {}) };
    const to: SceneTarget = { ...from, ...definition.to };
    // keep the rotation continuous so a new chapter never spins the globe backwards
    if (index > 0 && definition.to.rotY === undefined) to.rotY = from.rotY;
    result.push({ id: definition.id, mode: definition.mode, from, to, during: definition.during });
  });
  return result;
})();

/** The globe's resting pose at the top of the page (also used for the static / reduced-motion globe). */
export function getInitialTarget(): SceneTarget {
  return { ...RESOLVED[0].from };
}

export function getChapterMode(id: ChapterId): ChapterMode {
  return RESOLVED.find((c) => c.id === id)?.mode ?? "flow";
}

/**
 * Fills `out` with the scene state for chapter `index` at local progress `progress` (0..1).
 * Mutates `out` to avoid allocating every frame.
 */
export function computeTarget(index: number, progress: number, out: SceneTarget): void {
  const chapter = RESOLVED[index];
  const eased = easeInOutCubic(clamp(progress));
  for (const key of TARGET_KEYS) {
    out[key] = lerp(chapter.from[key], chapter.to[key], eased);
  }
  chapter.during?.(clamp(progress), out, chapter.from);
}
