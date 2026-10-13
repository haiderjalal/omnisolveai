"use client";

import { CHAPTERS } from "@/features/story/chapters";
import { useStoryStore } from "@/store/storyStore";
import { cn } from "@/utils/cn";

/**
 * Right-edge progress rail: one dot per chapter. Reinforces that the page is a sequence,
 * shows where you are, and jumps between chapters. Hidden on small screens.
 */
export function ChapterRail() {
  const activeChapter = useStoryStore((state) => state.activeChapter);
  const activeIndex = CHAPTERS.findIndex((chapter) => chapter.id === activeChapter);

  return (
    <nav
      aria-label="Story chapters"
      className="pointer-events-none fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ol className="pointer-events-auto relative flex flex-col items-end gap-3.5">
        <span aria-hidden="true" className="absolute top-1.5 right-[5px] bottom-1.5 w-px bg-white/10" />
        {CHAPTERS.map((chapter, index) => {
          const active = index === activeIndex;
          const passed = index < activeIndex;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.anchor}`}
                aria-label={`Go to ${chapter.label}`}
                aria-current={active ? "true" : undefined}
                className="group relative flex items-center gap-3"
              >
                <span
                  className={cn(
                    "font-mono text-[0.65rem] tracking-[0.14em] uppercase opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                    "translate-x-2",
                    active ? "text-aqua opacity-100 translate-x-0" : "text-muted",
                  )}
                >
                  {chapter.label}
                </span>
                <span
                  className={cn(
                    "relative z-10 block size-[11px] rounded-full border transition-all duration-500 ease-(--ease-expo)",
                    active
                      ? "scale-125 border-aqua bg-aqua shadow-[0_0_14px_rgb(56_232_220/0.9)]"
                      : passed
                        ? "border-aqua/60 bg-aqua/40"
                        : "border-white/25 bg-void group-hover:border-white/60",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
