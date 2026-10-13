import type { QualityTier } from "@/store/storyStore";

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

/** Software rasterisers (headless Chrome, VMs) technically work but are far too slow for bloom. */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software|basic render/i;

/**
 * Picks the starting quality tier from cheap signals only — it deliberately does NOT create a
 * WebGL context (that costs tens to hundreds of milliseconds, and react-three-fiber is about to
 * create the real one anyway).
 *   high   – desktop-class device: full scene + bloom
 *   medium – phones, tablets, modest laptops: lighter scene, no bloom
 * The renderer is inspected once it exists (see isSoftwareRenderer), the frame-rate monitor can
 * step "high" down at runtime, and a failed context falls back to the static globe ("low").
 */
export function detectQualityTier(): QualityTier {
  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const touchFirst = window.matchMedia("(pointer: coarse)").matches;
  const smallScreen = Math.min(window.screen.width, window.screen.height) < 700;

  return touchFirst || smallScreen || cores <= 4 || memory <= 4 ? "medium" : "high";
}

/** True when the WebGL context is backed by a CPU rasteriser. */
export function isSoftwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  if (!info) return false;
  return SOFTWARE_RENDERER.test(String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)));
}
