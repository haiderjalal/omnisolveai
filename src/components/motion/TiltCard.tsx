import type { ReactNode } from "react";

import type { MotionTag } from "@/types/polymorphic";
import { cn } from "@/utils/cn";

interface TiltCardProps {
  as?: MotionTag;
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
}

/**
 * A card that tilts towards the pointer in 3D and lights up under the cursor (the
 * `.spotlight` glow follows `--mx/--my`). It is plain markup: <PageEffects /> drives the
 * pointer behaviour for every `data-tilt` element, and only for mouse users with motion
 * allowed. Touch and reduced-motion users get a still card.
 */
export function TiltCard({ as = "div", children, className, max = 7 }: TiltCardProps) {
  // the tag is chosen at runtime; typing it as "div" keeps props checking simple
  const Component = as as "div";
  return (
    <Component className={cn("spotlight", className)} data-tilt="" data-tilt-max={max}>
      {children}
    </Component>
  );
}
