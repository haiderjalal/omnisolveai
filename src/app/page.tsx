import { Footer } from "@/components/layout/Footer";
import { faqs } from "@/content/home";
import { siteConfig } from "@/content/site";
import { ContactSection } from "@/features/contact/ContactSection";
import { CtaSection } from "@/features/finale/CtaSection";
import { HeroSection } from "@/features/hero/HeroSection";
import { IndustriesSection } from "@/features/industries/IndustriesSection";
import { PeopleSection } from "@/features/people/PeopleSection";
import { PricingSection } from "@/features/pricing/PricingSection";
import { ProofSection } from "@/features/proof/ProofSection";
import { TrustSection } from "@/features/security/TrustSection";
import { ServicesSection } from "@/features/services/ServicesSection";
import { GapSection } from "@/features/story/GapSection";
import { TeamSection } from "@/features/team/TeamSection";

/** Structured data: who we are, and the FAQ shown on the page (must match visible content). */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/brand/omnisolve-mark.png`,
      description: siteConfig.description,
    },
    {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

// "<" is escaped so the JSON can never close the script tag early
const structuredDataJson = JSON.stringify(structuredData).replace(/</g, "\\u003c");

export default function HomePage() {
  return (
    <>
      <main id="main">
        <HeroSection />
        <GapSection />
        <IndustriesSection />
        <ServicesSection />
        <ProofSection />
        <TeamSection />
        <TrustSection />
        <PricingSection />
        <PeopleSection />
        <CtaSection />
        <ContactSection />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJson }} />
    </>
  );
}
