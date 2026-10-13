/**
 * ⚠️ PLACEHOLDER CONTENT NOTICE
 * The old site's body copy could not be read from the screenshot (171px wide). Everything in
 * src/content/ is DRAFT copy written to match the section headings that were legible.
 * Items marked `// CONFIRM` are factual claims (numbers, contact details, certifications,
 * client statements) that MUST be replaced or verified by OmniSolve before launch.
 */

export const siteConfig = {
  name: "OmniSolve AI",
  shortName: "OmniSolve",
  tagline: "Enterprise AI and software, built to scale.",
  description:
    "OmniSolve AI designs, builds and scales enterprise AI systems and software with engineers who already understand your industry.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** E.164 digits only (e.g. 15551234567). When unset the floating button scrolls to the contact form. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  contact: {
    email: "hello@omnisolve.example", // CONFIRM — placeholder address on a reserved domain
    responseTime: "Within one business day", // CONFIRM
    location: "Global · remote-first", // CONFIRM
  },
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: readonly NavLink[] = [
  { label: "Industries", href: "#industries" },
  { label: "Services", href: "#services" },
  { label: "Proof", href: "#proof" },
  { label: "Team", href: "#team" },
  { label: "Pricing", href: "#pricing" },
];

export const footerColumns: readonly { title: string; links: readonly NavLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Industries", href: "#industries" },
      { label: "Services", href: "#services" },
      { label: "Proof", href: "#proof" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our team", href: "#team" },
      { label: "Security", href: "#security" },
      { label: "Insights", href: "#people" },
      { label: "FAQ", href: "#contact" },
    ],
  },
];
