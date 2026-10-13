import { GLSL_COMMON, GLSL_DISPLACE } from "./common";

/** Network nodes: glowing discs, bigger and brighter inside the focus cluster. */
export const nodeVertexShader = /* glsl */ `
${GLSL_DISPLACE}
uniform float uPointScale;
uniform float uFocus;
uniform vec3 uFocusDir;
uniform float uPulse;
uniform float uSizeBoost;

attribute vec3 aScatter;
attribute vec3 aDrift;
attribute float aRand;
attribute float aSize;

varying float vGradient;
varying float vFocus;
varying float vArrive;

void main() {
  vec3 p = displace(position, aScatter, aDrift, aRand, 1.0);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float focus = uFocus * smoothstep(0.6, 0.97, dot(normalize(position), uFocusDir));
  float size = aSize * (1.0 + focus * 1.15 + uPulse * 0.45) * uSizeBoost;
  gl_PointSize = size * uPointScale / -mv.z;

  vec3 worldDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
  vGradient = clamp(0.5 + 0.5 * dot(worldDir.xy, vec2(0.8, 0.6)), 0.0, 1.0);
  vFocus = focus;
  vArrive = easeOutCubic((uAssemble - aRand * 0.55) / 0.45);
}
`;

export const nodeFragmentShader = /* glsl */ `
${GLSL_COMMON}
uniform float uDim;
uniform float uPulse;
uniform float uHdr;

varying float vGradient;
varying float vFocus;
varying float vArrive;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float disc = 1.0 - smoothstep(0.78, 1.0, d);
  if (disc < 0.01) discard;
  float core = 1.0 - smoothstep(0.0, 0.62, d);

  // focused nodes shift towards aqua rather than white, so they stay saturated without bloom
  vec3 color = mix(brandGradient(vGradient), uColorC, vFocus * 0.55 + uPulse * 0.3);
  float intensity = 0.95 + (core * 1.4 + vFocus * 1.1 + uPulse * 0.8) * uHdr;

  gl_FragColor = vec4(color * intensity, disc * vArrive * uDim);
  #include <colorspace_fragment>
}
`;

/** Network edges: hairlines with "data packets" travelling along a share of them. */
export const edgeVertexShader = /* glsl */ `
${GLSL_DISPLACE}
uniform float uFocus;
uniform vec3 uFocusDir;

attribute vec3 aScatter;
attribute vec3 aDrift;
attribute float aNodeRand;
attribute float aEdgeRand;
attribute float aAlong;

varying float vGradient;
varying float vAlong;
varying float vEdgeRand;
varying float vVisible;
varying float vFocus;

void main() {
  vec3 p = displace(position, aScatter, aDrift, aNodeRand, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

  // edges with a high random value are the first to vanish when integrity drops
  float threshold = uIntegrity * 1.3 - 0.12;
  vVisible = 1.0 - smoothstep(threshold - 0.22, threshold, aEdgeRand);
  vVisible *= smoothstep(0.62, 1.0, uAssemble);

  vec3 worldDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
  vGradient = clamp(0.5 + 0.5 * dot(worldDir.xy, vec2(0.8, 0.6)), 0.0, 1.0);
  vAlong = aAlong;
  vEdgeRand = aEdgeRand;
  vFocus = uFocus * smoothstep(0.55, 0.96, dot(normalize(position), uFocusDir));
}
`;

export const edgeFragmentShader = /* glsl */ `
${GLSL_COMMON}
uniform float uTime;
uniform float uDim;
uniform float uPulse;
uniform float uHdr;

varying float vGradient;
varying float vAlong;
varying float vEdgeRand;
varying float vVisible;
varying float vFocus;

void main() {
  float speed = 0.2 + vEdgeRand * 0.28;
  float head = fract(uTime * speed + vEdgeRand * 7.0);
  float packet = (1.0 - smoothstep(0.0, 0.1, abs(vAlong - head))) * step(0.5, vEdgeRand);

  vec3 color = brandGradient(vGradient);
  float intensity = 0.8 + (packet * 3.0 + vFocus * 1.0 + uPulse * 1.2) * uHdr + packet * 0.6;
  float alpha = (0.3 + packet * 0.7 + vFocus * 0.4 + uPulse * 0.25) * vVisible * uDim;

  gl_FragColor = vec4(color * intensity, alpha);
  #include <colorspace_fragment>
}
`;
