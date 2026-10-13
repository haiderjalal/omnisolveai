import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/utils/cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Optional second line rendered in the brand gradient. */
  accent?: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
  /** Heading level — sections use h2, the hero supplies its own h1. */
  as?: "h2" | "h3";
  /** id placed on the heading element, so the section can reference it with aria-labelledby. */
  headingId?: string;
}

/** Eyebrow pill + animated heading + lead paragraph, used by every chapter. */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  lead,
  align = "left",
  className,
  as = "h2",
  headingId,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <header className={cn("flex flex-col gap-5", centered && "items-center text-center", className)}>
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <SplitText
        as={as}
        id={headingId}
        className={cn(
          "font-display text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.06] font-semibold text-balance text-fg",
          centered && "max-w-4xl",
        )}
        lines={accent ? [{ text: title }, { text: accent, accent: true }] : [{ text: title }]}
        delay={80}
      />
      {lead && (
        <Reveal
          delay={180}
          as="p"
          className={cn("max-w-2xl text-lg leading-relaxed text-muted", centered && "mx-auto")}
        >
          {lead}
        </Reveal>
      )}
    </header>
  );
}
