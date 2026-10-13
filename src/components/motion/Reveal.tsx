import type { CSSProperties, ReactNode } from "react";

import type { MotionTag } from "@/types/polymorphic";

interface RevealProps {
  as?: MotionTag;
  children: ReactNode;
  className?: string;
  /** Position in a staggered group (each step adds ~70ms). */
  index?: number;
  /** Extra delay in milliseconds. */
  delay?: number;
  id?: string;
}

/**
 * Fades, lifts and un-blurs its content as it scrolls into view.
 * Plain server-rendered markup: <PageEffects /> watches `data-reveal` and the styles live
 * in globals.css, so this costs no client JavaScript.
 */
export function Reveal({ as = "div", children, className, index = 0, delay = 0, id }: RevealProps) {
  // the tag is chosen at runtime; typing it as "div" keeps props checking simple
  const Component = as as "div";
  return (
    <Component
      id={id}
      className={className}
      data-reveal=""
      style={{ "--i": index, "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Component>
  );
}
