import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import {
  processIntro,
  processSteps,
  roles,
  stackChips,
  stackFilters,
  stackIntro,
  teamBuilderIntro,
} from "@/content/home";

import { ProcessTimeline } from "./ProcessTimeline";
import { RoleBuilder } from "./RoleBuilder";
import { StackExplorer } from "./StackExplorer";

/**
 * Chapter 06 — build your team: choose roles, explore the stack, see how starting works.
 * Interactions here also feed the globe (a pulse per role) and the contact form (a drafted brief).
 */
export function TeamSection() {
  return (
    <section
      id="team"
      data-chapter="team"
      aria-labelledby="team-title"
      className="container-x relative py-24 md:py-36"
    >
      <SectionHeading
        headingId="team-title"
        eyebrow={teamBuilderIntro.eyebrow}
        title={teamBuilderIntro.title}
        accent={teamBuilderIntro.accent}
        lead={teamBuilderIntro.lead}
      />
      <div className="mt-12">
        <RoleBuilder roles={roles} />
      </div>

      <div className="mt-28 md:mt-36">
        <SectionHeading
          as="h3"
          eyebrow={stackIntro.eyebrow}
          title={stackIntro.title}
          accent={stackIntro.accent}
          lead={stackIntro.lead}
        />
        <div className="mt-10">
          <StackExplorer filters={stackFilters} chips={stackChips} />
        </div>
      </div>

      <div className="mt-28 md:mt-36">
        <SectionHeading
          as="h3"
          align="center"
          eyebrow={processIntro.eyebrow}
          title={processIntro.title}
          accent={processIntro.accent}
        />
        <div className="mt-14">
          <ProcessTimeline steps={processSteps} />
        </div>
        <Reveal className="mt-14 flex justify-center">
          <ButtonLink href="#contact" size="lg">
            Start step one
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
