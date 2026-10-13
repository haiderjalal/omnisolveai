/**
 * Bridge between the 3D scene and HTML labels.
 *
 * The scene projects each anchor (a lon/lat on the globe) to screen pixels every frame and
 * writes the result here; DOM components read it from the GSAP ticker. This keeps labels as
 * real, accessible HTML while still being "tethered" to nodes in 3D.
 */
export interface TagAnchor {
  /** Degrees. */
  lon: number;
  lat: number;
}

export interface TagScreenState {
  x: number;
  y: number;
  /** 0..1: fades with facing, hero visibility and intro progress. */
  opacity: number;
}

/** Positions chosen to sit on the visible, right-hand side of the hero globe. */
export const TAG_ANCHORS: readonly TagAnchor[] = [
  { lon: -30, lat: 38 },
  { lon: 16, lat: 46 },
  { lon: -24, lat: -22 },
  { lon: 24, lat: -30 },
];

export const tagScreen: TagScreenState[] = TAG_ANCHORS.map(() => ({ x: 0, y: 0, opacity: 0 }));
