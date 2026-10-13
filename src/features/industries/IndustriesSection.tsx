import { SectionHeading } from "@/components/shared/SectionHeading";
import { industries, industriesIntro } from "@/content/home";

import { IndustryTour } from "./IndustryTour";

/**
 * Chapter 03 — the answer. Sticky stage: the globe on the right tours five industry
 * clusters while the matching card swaps on the left.
 */
export function IndustriesSection() {
  return (
    <section
      id="industries"
      data-chapter="industries"
      aria-labelledby="industries-title"
      className="relative h-[560vh] motion-reduce:h-auto motion-reduce:py-28"
    >
      <div className="sticky top-0 h-svh motion-reduce:static motion-reduce:h-auto">
        <div className="container-x flex h-full flex-col justify-between gap-6 pt-24 pb-8 md:justify-center md:gap-10 md:py-24 motion-reduce:gap-12">
          <div className="max-w-[34rem]">
            <SectionHeading
              headingId="industries-title"
              eyebrow={industriesIntro.eyebrow}
              title={industriesIntro.title}
              accent={industriesIntro.accent}
              lead={industriesIntro.lead}
            />
          </div>
          <div className="w-full max-w-[34rem]">
            <IndustryTour items={industries} />
          </div>
        </div>
      </div>
    </section>
  );
}
