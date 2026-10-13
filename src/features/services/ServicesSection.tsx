import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { engagementIntro, engagementModels, services, servicesIntro } from "@/content/home";

import { ServiceCarousel } from "./ServiceCarousel";

/**
 * Chapter 04 — the capabilities. The logo's orbit becomes a 3D carousel: six services ride
 * the ring as the visitor scrolls. The "how we work" strip follows in normal flow.
 */
export function ServicesSection() {
  return (
    <>
      <section
        id="services"
        data-chapter="services"
        aria-labelledby="services-title"
        className="relative h-[460vh] motion-reduce:h-auto motion-reduce:py-28"
      >
        <div className="sticky top-0 flex h-svh flex-col justify-center gap-8 py-20 motion-reduce:static motion-reduce:h-auto motion-reduce:gap-12 motion-reduce:py-0">
          <div className="container-x">
            <SectionHeading
              headingId="services-title"
              align="center"
              eyebrow={servicesIntro.eyebrow}
              title={servicesIntro.title}
              accent={servicesIntro.accent}
              lead={servicesIntro.lead}
            />
          </div>
          <div className="container-x">
            <ServiceCarousel items={services} />
          </div>
        </div>
      </section>

      <section aria-labelledby="engagement-title" className="container-x py-20 md:py-28">
        <Reveal>
          <h3 id="engagement-title" className="font-display text-2xl font-semibold text-fg sm:text-3xl">
            {engagementIntro.title}
          </h3>
          <p className="mt-2 font-mono text-xs tracking-[0.2em] text-aqua uppercase">
            {engagementIntro.eyebrow}
          </p>
        </Reveal>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {engagementModels.map((model, index) => (
            <li key={model.title}>
              <Reveal index={index} className="h-full">
                <TiltCard className="glass h-full rounded-3xl p-6">
                  <span className="font-mono text-xs tracking-[0.2em] text-aqua">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h4 className="mt-4 font-display text-xl font-semibold text-fg">{model.title}</h4>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{model.description}</p>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
