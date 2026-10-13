/**
 * GLSL shared by every globe material.
 *
 * Colour handling: uniforms carry LINEAR colours (three.js converts sRGB hex → linear for us),
 * and every fragment shader ends with `<colorspace_fragment>`, so output is correct both when
 * drawing straight to the screen and when rendering into the post-processing buffer.
 */
export const GLSL_COMMON = /* glsl */ `
uniform vec3 uColorA; // indigo-glow
uniform vec3 uColorB; // mid blue
uniform vec3 uColorC; // aqua

vec3 brandGradient(float t) {
  t = clamp(t, 0.0, 1.0);
  return t < 0.5 ? mix(uColorA, uColorB, t * 2.0) : mix(uColorB, uColorC, (t - 0.5) * 2.0);
}
`;

/**
 * Shared vertex logic for anything that is part of the intro "assembly" and the
 * network "break-apart": returns the displaced position of a point.
 *   uAssemble  0 → scattered in the dark, 1 → resting on the globe
 *   uIntegrity 1 → connected, 0 → drifted apart
 */
export const GLSL_DISPLACE = /* glsl */ `
uniform float uTime;
uniform float uAssemble;
uniform float uIntegrity;

float easeOutCubic(float x) {
  float y = 1.0 - clamp(x, 0.0, 1.0);
  return 1.0 - y * y * y;
}

vec3 displace(vec3 rest, vec3 scatter, vec3 drift, float rand, float driftStrength) {
  float a = easeOutCubic((uAssemble - rand * 0.55) / 0.45);
  vec3 p = mix(scatter, rest, a);
  p += drift * sin(uTime * 0.7 + rand * 6.2831) * 0.006;
  float broken = clamp((1.0 - uIntegrity) * (0.55 + rand * 0.9), 0.0, 1.0);
  p += drift * broken * (0.28 + rand * 0.55) * driftStrength;
  return p;
}
`;
