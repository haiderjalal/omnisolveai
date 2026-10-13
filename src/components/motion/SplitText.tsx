import { Fragment, type CSSProperties } from "react";

import type { MotionTag } from "@/types/polymorphic";
import { cn } from "@/utils/cn";

export interface SplitLine {
  text: string;
  /** Renders the line in the brand gradient (always split by word — a per-letter gradient looks wrong). */
  accent?: boolean;
}

interface SplitTextProps {
  as?: MotionTag;
  /** Plain text. Use `lines` instead when part of the heading needs the accent gradient. */
  children?: string;
  lines?: readonly SplitLine[];
  className?: string;
  id?: string;
  /** Split by word (default) or by letter. */
  unit?: "words" | "chars";
  /** "view" reveals on scroll; "load" plays immediately via CSS (use for the hero). */
  trigger?: "view" | "load";
  /** Delay in milliseconds before the first unit moves. */
  delay?: number;
}

/**
 * Animated text that is split on the SERVER into masked words/letters. Nothing is measured in
 * the browser, so it never causes layout shift, survives resizing and fonts loading, and the
 * first paint already contains the real text (good for LCP and SEO).
 *
 * It is plain markup (no client JavaScript of its own): <PageEffects /> flips `data-in` when
 * it scrolls into view and CSS does the animating. Headings get an aria-label with the full
 * string while the split spans are hidden from assistive tech.
 */
export function SplitText({
  as = "span",
  children,
  lines,
  className,
  id,
  unit = "words",
  trigger = "view",
  delay = 0,
}: SplitTextProps) {
  const resolved: readonly SplitLine[] = lines ?? [{ text: children ?? "" }];
  const label = resolved.map((line) => line.text).join(" ");
  // aria-label is only permitted on elements with a role that supports naming (headings do)
  const isHeading = /^h[1-6]$/.test(as);
  let index = 0;

  // the tag is chosen at runtime; typing it as "div" keeps props checking simple
  const Component = as as "div";
  return (
    <Component
      id={id}
      className={className}
      data-split={trigger}
      aria-label={isHeading ? label : undefined}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      <span aria-hidden={isHeading ? true : undefined}>
        {resolved.map((line, lineIndex) => {
          const byChar = unit === "chars" && !line.accent;
          const words = line.text.split(" ");
          return (
            <Fragment key={`${lineIndex}-${line.text}`}>
              {lineIndex > 0 && <br />}
              {words.map((word, wordIndex) => (
                <Fragment key={`${wordIndex}-${word}`}>
                  {byChar ? (
                    <span className="split-word">
                      {Array.from(word).map((char, charIndex) => (
                        <span key={charIndex} className="split-mask">
                          <span className="split-unit" style={{ "--i": index++ } as CSSProperties}>
                            {char}
                          </span>
                        </span>
                      ))}
                    </span>
                  ) : (
                    // word mode: the mask and the word share one element (one fewer node per word)
                    <span className="split-word split-mask">
                      <span
                        className={cn("split-unit", line.accent && "text-gradient shimmer")}
                        style={{ "--i": index++ } as CSSProperties}
                      >
                        {word}
                      </span>
                    </span>
                  )}
                  {wordIndex < words.length - 1 && " "}
                </Fragment>
              ))}
            </Fragment>
          );
        })}
      </span>
    </Component>
  );
}
