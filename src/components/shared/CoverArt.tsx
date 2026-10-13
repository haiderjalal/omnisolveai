import { createRandom } from "@/utils/random";

interface CoverArtProps {
  /** Base hue in degrees (e.g. 238 indigo, 188 teal). */
  hue: number;
  /** Different seeds give different networks. */
  seed: number;
  className?: string;
}

interface ArtNode {
  x: number;
  y: number;
  r: number;
}

const WIDTH = 240;
const HEIGHT = 150;
const NODE_COUNT = 22;

/**
 * Generated on-brand cover art: a small constellation network in a given hue.
 * Stands in for real project imagery until OmniSolve supplies it. Deterministic, so the
 * server and client always render the same thing.
 */
export function CoverArt({ hue, seed, className }: CoverArtProps) {
  const random = createRandom(seed);
  const nodes: ArtNode[] = Array.from({ length: NODE_COUNT }, () => ({
    x: 12 + random() * (WIDTH - 24),
    y: 12 + random() * (HEIGHT - 24),
    r: 1.3 + random() * 3.2,
  }));

  const edges: [ArtNode, ArtNode][] = [];
  nodes.forEach((node, index) => {
    nodes
      .map((other, otherIndex) => ({
        other,
        otherIndex,
        distance: Math.hypot(node.x - other.x, node.y - other.y),
      }))
      .filter((entry) => entry.otherIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .forEach((entry) => {
        if (entry.otherIndex > index) edges.push([node, entry.other]);
      });
  });

  const id = `cover-${seed}`;
  const start = `hsl(${hue} 85% 66%)`;
  const end = `hsl(${(hue + 55) % 360} 90% 62%)`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={start} />
          <stop offset="1" stopColor={end} />
        </linearGradient>
        <radialGradient id={`${id}-bg`} cx="0.7" cy="0.25" r="1">
          <stop offset="0" stopColor={`hsl(${hue} 70% 28%)`} />
          <stop offset="0.55" stopColor={`hsl(${hue} 60% 12%)`} />
          <stop offset="1" stopColor="#060a22" />
        </radialGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill={`url(#${id}-bg)`} />
      <g stroke={`url(#${id}-line)`} strokeWidth="0.6" opacity="0.55">
        {edges.map(([a, b], index) => (
          <line key={index} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
        ))}
      </g>
      <g fill={`url(#${id}-line)`}>
        {nodes.map((node, index) => (
          <circle key={index} cx={node.x} cy={node.y} r={node.r} opacity={0.55 + (index % 4) * 0.12} />
        ))}
      </g>
    </svg>
  );
}
