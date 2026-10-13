import { Color, Vector3 } from "three";

/** Tiers that render WebGL. "low" (no WebGL / very weak GPU) renders a static fallback instead. */
export type GlobeTier = "high" | "medium";

export interface TierConfig {
  nodes: number;
  landDots: number;
  dust: number;
  ringSegments: number;
  bloom: boolean;
  /** Upper bound for the renderer pixel ratio. */
  maxDpr: number;
}

export const TIER_CONFIG: Record<GlobeTier, TierConfig> = {
  high: { nodes: 240, landDots: 9000, dust: 1300, ringSegments: 260, bloom: true, maxDpr: 1.75 },
  medium: { nodes: 170, landDots: 5200, dust: 650, ringSegments: 160, bloom: false, maxDpr: 1.4 },
};

/** Page background — the canvas clears to the same colour so it blends seamlessly. */
export const VOID_HEX = "#050816";

/** Brand palette for the scene. `Color` converts these sRGB hex values to linear for shaders. */
export const SCENE_COLORS = {
  glow: new Color("#7a7cff"),
  mid: new Color("#45b6f2"),
  aqua: new Color("#28ecd2"),
  coreA: new Color("#0a1136"),
  coreB: new Color("#0c2748"),
  void: new Color(VOID_HEX),
} as const;

/** Uniforms shared by every globe material: update once per frame, all materials follow. */
export function createGlobeUniforms() {
  return {
    uTime: { value: 0 },
    uAssemble: { value: 0 },
    uIntegrity: { value: 1 },
    uPulse: { value: 0 },
    uDim: { value: 1 },
    uFocus: { value: 0 },
    uFocusDir: { value: new Vector3(0, 0, 1) },
    uPointScale: { value: 1000 },
    /** How much over-bright "HDR" glow to emit. Only the bloom pass can turn that into a soft halo. */
    uHdr: { value: 1 },
    uColorA: { value: SCENE_COLORS.glow },
    uColorB: { value: SCENE_COLORS.mid },
    uColorC: { value: SCENE_COLORS.aqua },
  };
}

export type GlobeUniforms = ReturnType<typeof createGlobeUniforms>;
