import { GLSL_COMMON, GLSL_DISPLACE } from "./common";

/** Continent dots: a fine dot-matrix of the world, flying in during the intro. */
export const landVertexShader = /* glsl */ `
${GLSL_DISPLACE}
uniform float uPointScale;
uniform float uFocus;
uniform vec3 uFocusDir;
uniform float uPulse;

attribute vec3 aScatter;
attribute float aRand;
attribute float aSize;

varying float vGradient;
varying float vArrive;
varying float vTwinkle;
varying float vFocus;

void main() {
  vec3 p = displace(position, aScatter, vec3(0.0), aRand, 0.0);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float focus = uFocus * smoothstep(0.55, 0.97, dot(normalize(position), uFocusDir));
  gl_PointSize = aSize * (1.0 + focus * 0.8) * uPointScale / -mv.z;

  vec3 worldDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
  vGradient = clamp(0.5 + 0.5 * dot(worldDir.xy, vec2(0.8, 0.6)), 0.0, 1.0);
  vArrive = easeOutCubic((uAssemble - aRand * 0.55) / 0.45);
  vTwinkle = 0.78 + 0.22 * sin(uTime * (0.8 + aRand * 1.6) + aRand * 40.0);
  vFocus = focus;
}
`;

export const landFragmentShader = /* glsl */ `
${GLSL_COMMON}
uniform float uDim;
uniform float uPulse;

varying float vGradient;
varying float vArrive;
varying float vTwinkle;
varying float vFocus;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float disc = 1.0 - smoothstep(0.55, 1.0, d);
  if (disc < 0.01) discard;

  // continents lean teal, like the logo's lit hemisphere
  vec3 color = brandGradient(0.42 + vGradient * 0.58);
  float intensity = 0.95 + vFocus * 0.8 + uPulse * 0.7;
  gl_FragColor = vec4(color * intensity, disc * vArrive * vTwinkle * (0.58 + vFocus * 0.3) * uDim);
  #include <colorspace_fragment>
}
`;

/** Opaque planet body: hides the far side and gives the globe a lit-rim, volumetric feel. */
export const coreVertexShader = /* glsl */ `
varying vec3 vNormalView;
varying vec3 vViewPosition;
varying float vGradient;

void main() {
  vNormalView = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mv.xyz;
  vec3 worldDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
  vGradient = clamp(0.5 + 0.5 * dot(worldDir.xy, vec2(0.8, 0.6)), 0.0, 1.0);
  gl_Position = projectionMatrix * mv;
}
`;

export const coreFragmentShader = /* glsl */ `
${GLSL_COMMON}
uniform vec3 uCoreA;
uniform vec3 uCoreB;
uniform vec3 uVoid;
uniform float uDim;

varying vec3 vNormalView;
varying vec3 vViewPosition;
varying float vGradient;

void main() {
  vec3 n = normalize(vNormalView);
  vec3 v = normalize(vViewPosition);
  float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.4);

  vec3 body = mix(uCoreA, uCoreB, vGradient);
  vec3 rim = brandGradient(vGradient) * fresnel;
  vec3 color = body + rim * 0.5 + brandGradient(vGradient) * 0.035;

  // as the globe dims for content chapters it dissolves into the page background
  gl_FragColor = vec4(mix(uVoid, color, uDim), 1.0);
  #include <colorspace_fragment>
}
`;

export const atmosphereVertexShader = /* glsl */ `
varying vec3 vNormalView;
varying float vGradient;

void main() {
  vNormalView = normalize(normalMatrix * normal);
  vec3 worldDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
  vGradient = clamp(0.5 + 0.5 * dot(worldDir.xy, vec2(0.8, 0.6)), 0.0, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const atmosphereFragmentShader = /* glsl */ `
${GLSL_COMMON}
uniform float uDim;
uniform float uPulse;

varying vec3 vNormalView;
varying float vGradient;

void main() {
  // We render the BACK of a slightly larger sphere. Its view-space normal faces away from the
  // camera, so -z is 0 at the halo's outer limb and ~0.5 where it meets the planet's edge.
  float s = clamp(-vNormalView.z / 0.52, 0.0, 1.0);
  float glow = pow(s, 2.8);
  vec3 color = brandGradient(vGradient) * (1.15 + uPulse * 1.5);
  gl_FragColor = vec4(color, glow * (0.42 + uPulse * 0.5) * uDim);
  #include <colorspace_fragment>
}
`;
