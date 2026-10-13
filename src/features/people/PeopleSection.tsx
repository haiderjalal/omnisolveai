import { Clock } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { CoverArt } from "@/components/shared/CoverArt";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { insightsIntro, leadership, peopleIntro, posts } from "@/content/home";

/** Chapter 09 — the people behind the delivery, and notes from the engineers. */
export function PeopleSection() {
  return (
    <section
      id="people"
      data-chapter="people"
      aria-labelledby="people-title"
      className="container-x relative py-24 md:py-36"
    >
      <SectionHeading
        headingId="people-title"
        eyebrow={peopleIntro.eyebrow}
        title={peopleIntro.title}
        accent={peopleIntro.accent}
        lead={peopleIntro.lead}
      />

      <ul className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {leadership.map((person, index) => (
          <li key={person.role}>
            <Reveal index={index}>
              <TiltCard className="glass group overflow-hidden rounded-3xl" max={5}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <CoverArt
                    hue={person.hue}
                    seed={index * 13 + 5}
                    className="size-full scale-125 transition-transform duration-1000 ease-(--ease-expo) group-hover:scale-150"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-4 left-4 font-display text-5xl font-semibold text-white/20 select-none"
                  >
                    {person.monogram}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-fg">{person.role}</h3>
                  <p className="mt-1 text-sm text-muted">{person.area}</p>
                </div>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-28 md:mt-36">
        <SectionHeading
          as="h3"
          eyebrow={insightsIntro.eyebrow}
          title={insightsIntro.title}
          accent={insightsIntro.accent}
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {posts.map((post, index) => (
            <li key={post.title}>
              <Reveal index={index} className="h-full">
                <TiltCard as="article" className="glass flex h-full flex-col rounded-3xl p-7" max={4}>
                  <span className="w-fit rounded-full border border-aqua/25 bg-aqua/8 px-3 py-1 font-mono text-[0.66rem] tracking-[0.12em] text-aqua uppercase">
                    {post.category}
                  </span>
                  <h4 className="mt-6 font-display text-xl leading-snug font-semibold text-fg">
                    {post.title}
                  </h4>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{post.excerpt}</p>
                  <p className="mt-auto flex items-center gap-2 pt-7 font-mono text-xs tracking-[0.08em] text-subtle">
                    <Clock aria-hidden="true" className="size-3.5" />
                    {post.readTime}
                  </p>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
