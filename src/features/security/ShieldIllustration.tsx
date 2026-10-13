import type { CSSProperties } from "react";

import { DrawOnReveal } from "@/components/motion/DrawOnReveal";

/** Outer points of the network drawn inside the shield: [x, y]. */
const NODES: readonly (readonly [number, number])[] = [
  [100, 62],
  [58, 92],
  [142, 92],
  [52, 146],
  [148, 146],
  [100, 190],
];
const CENTER: readonly [number, number] = [100, 124];

/**
 * A shield formed from the same network language as the globe: nodes joined to a central
 * lock. Traces itself in when scrolled into view.
 */
export function ShieldIllustration({ className }: { className?: string }) {
  return (
    <DrawOnReveal className={className}>
      <svg
        viewBox="0 0 200 240"
        fill="none"
        role="img"
        aria-label="A shield made of connected nodes, representing security"
        className="size-full"
      >
        <defs>
          <linearGradient id="shield-stroke" x1="20" y1="10" x2="180" y2="232" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8587ff" />
            <stop offset="0.5" stopColor="#45b6f2" />
            <stop offset="1" stopColor="#28ecd2" />
          </linearGradient>
          <radialGradient id="shield-fill" cx="0.5" cy="0.4" r="0.7">
            <stop stopColor="#38e8dc" stopOpacity="0.16" />
            <stop offset="1" stopColor="#6f72f5" stopOpacity="0.02" />
          </radialGradient>
        </defs>

        <path
          pathLength="1"
          className="draw"
          d="M100 10 L180 40 V110 C180 170 140 210 100 232 C60 210 20 170 20 110 V40 Z"
          fill="url(#shield-fill)"
          stroke="url(#shield-stroke)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        <g stroke="url(#shield-stroke)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
          {NODES.map(([x, y], index) => (
            <line
              key={`spoke-${index}`}
              pathLength="1"
              className="draw"
              x1={CENTER[0]}
              y1={CENTER[1]}
              x2={x}
              y2={y}
              style={{ "--i": index + 2 } as CSSProperties}
            />
          ))}
          {NODES.map(([x, y], index) => {
            const [nx, ny] = NODES[(index + 1) % NODES.length];
            return (
              <line
                key={`rim-${index}`}
                pathLength="1"
                className="draw"
                x1={x}
                y1={y}
                x2={nx}
                y2={ny}
                opacity="0.45"
                style={{ "--i": index + 5 } as CSSProperties}
              />
            );
          })}
        </g>

        <g fill="#38e8dc">
          {NODES.map(([x, y], index) => (
            <circle
              key={index}
              className="pop"
              cx={x}
              cy={y}
              r="4.2"
              style={{ "--i": index + 6 } as CSSProperties}
            />
          ))}
        </g>

        {/* the lock at the centre */}
        <g className="pop" style={{ "--i": 12 } as CSSProperties}>
          <rect
            x="84"
            y="116"
            width="32"
            height="26"
            rx="6"
            fill="#050816"
            stroke="url(#shield-stroke)"
            strokeWidth="2"
          />
          <path
            d="M91 116 v-8 a9 9 0 0 1 18 0 v8"
            stroke="url(#shield-stroke)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="100" cy="128" r="3" fill="#38e8dc" />
        </g>
      </svg>
    </DrawOnReveal>
  );
}
