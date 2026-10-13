import { ScrubWords } from "@/components/motion/ScrubWords";
import { gap } from "@/content/home";

import { GapFragments } from "./GapFragments";

/**
 * Chapter 02 — the problem. A tall wrapper with a sticky stage: while it is pinned, the
 * statement lights up word by word and the globe behind it comes apart.
 */
export function GapSection() {
  return (
    <section
      id="gap"
      data-chapter="gap"
      aria-labelledby="gap-label"
      className="relative h-[280vh] motion-reduce:h-auto motion-reduce:py-28"
    >
      <div className="sticky top-0 flex h-svh items-center motion-reduce:static motion-reduce:h-auto">
        <div className="container-x">
          <p id="gap-label" className="eyebrow">
            {gap.eyebrow}
          </p>
          <ScrubWords
            text={gap.statement}
            progressKey="gap"
            highlight={gap.highlight}
            className="mt-7 max-w-5xl font-display text-[clamp(1.85rem,4.6vw,4rem)] leading-[1.12] font-semibold tracking-tight text-fg"
          />
          <GapFragments items={gap.fragments} />
        </div>
      </div>
    </section>
  );
}
