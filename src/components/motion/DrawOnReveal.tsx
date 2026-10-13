import type { ReactNode } from "react";

interface DrawOnRevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper for SVG illustrations: children with class `.draw` (and `pathLength="1"`) trace
 * themselves in and `.pop` elements scale in once the wrapper scrolls into view
 * (<PageEffects /> sets `data-in`; the animation is pure CSS).
 */
export function DrawOnReveal({ children, className }: DrawOnRevealProps) {
  return (
    <div data-draw="" className={className}>
      {children}
    </div>
  );
}
