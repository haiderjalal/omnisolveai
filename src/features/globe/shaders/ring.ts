import { GLSL_COMMON } from "./common";

/** The orbit ring: a tapered tube that draws itself in and carries a travelling highlight. */
export const ringVertexShader = /* glsl */ `
attribute float aT;

varying float vT;
varying vec3 vNormalView;

void main() {
  vT = aT;
  vNormalView = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const ringFragmentShader = /* glsl */ `
${GLSL_COMMON}
uniform float uTime;
uniform float uDraw;
uniform float uOpacity;
uniform float uDim;
uniform float uPulse;
uniform float uHdr;

varying float vT;
varying vec3 vNormalView;

void main() {
  // draw-in: the arc grows from its start; the leading edge is soft
  float drawn = 1.0 - smoothstep(uDraw - 0.04, uDraw, vT);
  if (drawn < 0.01) discard;

  float rim = pow(1.0 - abs(dot(normalize(vNormalView), vec3(0.0, 0.0, 1.0))), 1.4);
  float comet = 1.0 - smoothstep(0.0, 0.14, abs(vT - fract(uTime * 0.075)));

  // violet at the thick start → aqua at the fine tip, like the logo's swoosh
  vec3 color = brandGradient(vT);
  float intensity = 0.78 + rim * 0.3 + (comet * 1.9 + uPulse * 1.4) * uHdr + comet * 0.3;
  float alpha = drawn * uOpacity * uDim * (0.7 + rim * 0.3);

  gl_FragColor = vec4(color * intensity, clamp(alpha, 0.0, 1.0));
  #include <colorspace_fragment>
}
`;

/** Soft glowing sprite — the satellite riding the ring and the ambient dust. */
export const glowVertexShader = /* glsl */ `
uniform float uPointScale;
uniform float uSize;
uniform float uTime;
attribute float aRand;

varying float vTwinkle;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min(uSize * (0.6 + aRand * 0.8) * uPointScale / -mv.z, 64.0);
  vTwinkle = 0.55 + 0.45 * sin(uTime * (0.4 + aRand) + aRand * 60.0);
}
`;

export const glowFragmentShader = /* glsl */ `
${GLSL_COMMON}
uniform float uDim;
uniform float uIntensity;
uniform float uAlpha;
uniform float uMix;
uniform float uReveal;

varying float vTwinkle;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float glow = pow(clamp(1.0 - d, 0.0, 1.0), 2.2);
  if (glow < 0.004) discard;
  vec3 color = brandGradient(uMix);
  gl_FragColor = vec4(color * uIntensity, glow * uAlpha * vTwinkle * uDim * uReveal);
  #include <colorspace_fragment>
}
`;
