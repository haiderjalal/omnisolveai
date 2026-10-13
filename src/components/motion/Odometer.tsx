import type { CSSProperties } from "react";

import { cn } from "@/utils/cn";

interface OdometerProps {
  /** The final value, e.g. "120+", "98%", "48h". Digits roll; everything else stays put. */
  value: string;
  className?: string;
}

const DIGITS = Array.from({ length: 10 }, (_, digit) => digit);

/**
 * Mechanical-counter number. Each digit is a vertical strip of 0–9 that slides to its final
 * value when scrolled into view (<PageEffects /> sets `data-in`). The final value is in the
 * markup from the start, so the number is correct without JS and for crawlers; assistive
 * technology gets it from the aria-label.
 */
export function Odometer({ value, className }: OdometerProps) {
  let digitIndex = 0;
  return (
    <span
      role="img"
      aria-label={value}
      className={cn("odometer inline-flex tabular-nums", className)}
      data-odo=""
    >
      <span aria-hidden="true" className="inline-flex">
        {Array.from(value).map((char, position) => {
          if (!/\d/.test(char)) {
            return (
              <span key={position} className="inline-block">
                {char}
              </span>
            );
          }
          const style = { "--digit": Number(char), "--i": digitIndex++ } as CSSProperties;
          return (
            <span key={position} className="odo">
              <span className="odo-col" style={style}>
                {DIGITS.map((digit) => (
                  <span key={digit}>{digit}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
