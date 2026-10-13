/**
 * Draft copy for every homepage chapter. See the notice in ./site.ts — anything marked
 * `// CONFIRM` is a factual claim that needs OmniSolve's sign-off before launch.
 */

export interface HeroContent {
  eyebrow: string;
  title: string;
  accent: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  trust: string;
  tags: readonly string[];
}

export const hero: HeroContent = {
  eyebrow: "AI engineering · Enterprise software",
  title: "Enterprise AI and software,",
  accent: "built to scale.",
  lead: "OmniSolve designs, builds and scales AI systems and enterprise software, with engineers who already understand your industry.",
  primaryCta: "Start a project",
  secondaryCta: "See our work",
  trust: "Trusted by engineering and product teams across fintech, healthcare, retail and logistics.", // CONFIRM
  tags: ["AI agents", "Data platforms", "Cloud native", "Secure by design"],
};

export const gap = {
  eyebrow: "The gap",
  statement:
    "Strategy decks are easy to buy. Shipping them to production is where most AI and software initiatives quietly break.",
  highlight: ["production", "break"],
  fragments: ["Pilots that stall", "Context lost between teams", "Systems that never connect"],
} as const;

export interface Industry {
  title: string;
  description: string;
  focus: readonly string[];
}

export const industriesIntro = {
  eyebrow: "Industries",
  title: "Engineers who already know",
  accent: "your industry.",
  lead: "Domain context is the difference between a demo and a system your business relies on. Our teams start with your world, not a blank page.",
};

export const industries: readonly Industry[] = [
  {
    title: "Financial services",
    description:
      "Risk, fraud and decisioning systems plus the data platforms behind them, built for banks, insurers and fintechs.",
    focus: ["Fraud & risk models", "Real-time decisioning", "Regulatory reporting"],
  },
  {
    title: "Healthcare & life sciences",
    description:
      "Data pipelines, document intelligence and patient-facing products designed with privacy and regulation in mind.",
    focus: ["Clinical data pipelines", "Document intelligence", "Patient experience"],
  },
  {
    title: "Retail & commerce",
    description:
      "Demand forecasting, personalisation and commerce platforms that turn customer signals into revenue.",
    focus: ["Demand forecasting", "Personalisation", "Catalogue & pricing"],
  },
  {
    title: "Logistics & supply chain",
    description:
      "Route optimisation, predictive operations and live visibility across fleets, warehouses and partners.",
    focus: ["Route optimisation", "Predictive operations", "Live tracking"],
  },
  {
    title: "Technology & SaaS",
    description:
      "AI features, platform engineering and extra product capacity for teams scaling faster than they can hire.",
    focus: ["AI product features", "Platform engineering", "Team scaling"],
  },
];

export interface Service {
  title: string;
  description: string;
  tags: readonly string[];
}

export const servicesIntro = {
  eyebrow: "Services",
  title: "From strategy",
  accent: "to production.",
  lead: "One accountable team across the whole journey, so nothing is lost in hand-offs.",
};

export const services: readonly Service[] = [
  {
    title: "AI & machine learning",
    description: "Custom models, evaluation and MLOps that move from notebook to dependable product.",
    tags: ["Modelling", "MLOps", "Evaluation"],
  },
  {
    title: "Generative AI & agents",
    description: "LLM applications, retrieval and autonomous agents grounded in your data and guardrails.",
    tags: ["LLM apps", "RAG", "Agents"],
  },
  {
    title: "Data engineering",
    description: "Pipelines, warehouses and governance that give every AI initiative a trustworthy base.",
    tags: ["Pipelines", "Warehousing", "Governance"],
  },
  {
    title: "Custom software",
    description: "Web, mobile and enterprise platforms engineered for scale, maintainability and speed.",
    tags: ["Web", "Mobile", "Platforms"],
  },
  {
    title: "Cloud & DevOps",
    description: "Infrastructure as code, CI/CD and observability so releases are routine, not events.",
    tags: ["Cloud", "CI/CD", "Observability"],
  },
  {
    title: "Quality & security",
    description: "Test automation, security reviews and compliance-ready delivery built into every sprint.",
    tags: ["Testing", "AppSec", "Compliance"],
  },
];

export const engagementIntro = {
  eyebrow: "How we work",
  title: "Pick the model that fits.",
};

export const engagementModels = [
  { title: "Dedicated team", description: "A full squad focused solely on your roadmap." },
  { title: "Embedded engineers", description: "Specialists who join your team and rituals." },
  { title: "Project delivery", description: "A defined outcome, scope and timeline, owned end to end." },
  {
    title: "Advisory & audits",
    description: "Architecture, AI readiness and code reviews to unblock decisions.",
  },
] as const;

export interface Stat {
  value: string;
  label: string;
}

export const proofIntro = {
  eyebrow: "Proof",
  title: "Backed by",
  accent: "proof.",
  lead: "Numbers we can stand behind, and the work that earned them.",
};

export const stats: readonly Stat[] = [
  { value: "120+", label: "Projects delivered" }, // CONFIRM
  { value: "98%", label: "Client satisfaction" }, // CONFIRM
  { value: "48h", label: "To a first shortlist" }, // CONFIRM
  { value: "8+", label: "Years building" }, // CONFIRM
];

export interface CaseStudy {
  sector: string;
  title: string;
  summary: string;
  outcomes: readonly string[];
  /** Hue (degrees) for the generated cover art, until real project imagery exists. */
  hue: number;
}

export const caseStudies: readonly CaseStudy[] = [
  {
    sector: "Financial services",
    title: "Real-time fraud decisioning for a regional bank",
    summary: "Replaced batch rules with streaming models and a review workspace analysts actually use.",
    outcomes: ["Streaming pipeline", "Analyst tooling"],
    hue: 238,
  },
  {
    sector: "Retail & commerce",
    title: "Demand forecasting across a multi-region retail group",
    summary: "Unified siloed sales data and shipped forecasts that planners trust and can explain.",
    outcomes: ["Unified data layer", "Explainable forecasts"],
    hue: 188,
  },
  {
    sector: "Healthcare",
    title: "Document intelligence for a hospital network",
    summary: "Turned unstructured clinical paperwork into searchable, governed, structured data.",
    outcomes: ["Document AI", "Privacy-first design"],
    hue: 262,
  },
];

export interface Testimonial {
  quote: string;
  role: string;
  context: string;
}

// CONFIRM — placeholder statements; replace with real, approved client quotes
export const testimonials: readonly Testimonial[] = [
  {
    quote: "They understood our domain in days, and shipped in weeks what we had been circling for a year.",
    role: "VP Engineering",
    context: "Fintech scale-up",
  },
  {
    quote: "It felt like our own team, with the discipline and speed we could not hire for fast enough.",
    role: "Chief Product Officer",
    context: "Retail group",
  },
  {
    quote: "Clear communication, honest estimates, and production systems that simply keep running.",
    role: "Head of Data",
    context: "Healthcare network",
  },
];

export interface Role {
  title: string;
  description: string;
}

export const teamBuilderIntro = {
  eyebrow: "Build your team",
  title: "Assemble the roles",
  accent: "you need.",
  lead: "Pick the engineers you need. We'll shape the team and come back with a plan.",
};

export const roles: readonly Role[] = [
  { title: "AI / ML engineer", description: "Models, evaluation and MLOps." },
  { title: "Full-stack engineer", description: "Product features end to end." },
  { title: "Data engineer", description: "Pipelines, warehouses, quality." },
  { title: "Cloud & DevOps", description: "Infrastructure, CI/CD, reliability." },
  { title: "QA & security", description: "Test automation and secure delivery." },
];

export type StackCategory = "ai" | "frontend" | "backend" | "cloud" | "mobile";

export const stackIntro = {
  eyebrow: "Tech stack",
  title: "Engineers for",
  accent: "every stack.",
  lead: "Filter by discipline. If it ships to production, we have people who've done it.",
};

export const stackFilters: readonly { id: "all" | StackCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI & data" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "cloud", label: "Cloud & DevOps" },
  { id: "mobile", label: "Mobile" },
];

export const stackChips: readonly { name: string; categories: readonly StackCategory[] }[] = [
  { name: "Python", categories: ["ai", "backend"] },
  { name: "PyTorch", categories: ["ai"] },
  { name: "TensorFlow", categories: ["ai"] },
  { name: "LangChain", categories: ["ai"] },
  { name: "Spark", categories: ["ai", "backend"] },
  { name: "dbt", categories: ["ai"] },
  { name: "React", categories: ["frontend"] },
  { name: "Next.js", categories: ["frontend"] },
  { name: "TypeScript", categories: ["frontend", "backend"] },
  { name: "Node.js", categories: ["backend"] },
  { name: "Java", categories: ["backend"] },
  { name: ".NET", categories: ["backend"] },
  { name: "Go", categories: ["backend", "cloud"] },
  { name: "PostgreSQL", categories: ["backend", "ai"] },
  { name: "AWS", categories: ["cloud"] },
  { name: "Azure", categories: ["cloud"] },
  { name: "Google Cloud", categories: ["cloud"] },
  { name: "Kubernetes", categories: ["cloud"] },
  { name: "Terraform", categories: ["cloud"] },
  { name: "React Native", categories: ["mobile", "frontend"] },
  { name: "Flutter", categories: ["mobile"] },
  { name: "Swift", categories: ["mobile"] },
];

export const processIntro = {
  eyebrow: "Getting started",
  title: "Three steps to",
  accent: "start.",
};

export const processSteps = [
  { title: "Tell us what you need", description: "A short call to understand goals, stack and timeline." },
  { title: "Meet your engineers", description: "A shortlist of vetted specialists matched to your context." },
  { title: "Ship together", description: "Kick off in days, with weekly demos and full transparency." },
] as const;

export const trustIntro = {
  eyebrow: "Security",
  title: "Your data and code",
  accent: "stay protected.",
  lead: "Security is part of how we deliver, not an add-on at the end.",
};

export const securityPillars = [
  {
    title: "Your IP stays yours",
    description: "Contracts and workflows that keep ownership of code, models and data with you.",
  },
  {
    title: "Least-privilege access",
    description: "Scoped credentials, isolated environments and audited access to everything we touch.",
  },
  {
    title: "Audit-ready delivery",
    description: "Documented practices and traceable changes that stand up to your security review.",
  },
] as const;

export const measuredIntro = {
  eyebrow: "Accountability",
  title: "Measured,",
  accent: "not promised.",
  lead: "We report on delivery the same way we build it: openly, with numbers.",
};

// CONFIRM — placeholder metrics; replace with figures OmniSolve actually tracks
export const measuredBars = [
  { label: "On-time delivery", value: 96 },
  { label: "Sprint goals met", value: 92 },
  { label: "Client retention", value: 94 },
  { label: "Engineer retention", value: 90 },
] as const;

export interface Plan {
  name: string;
  tagline: string;
  /** How the engagement is structured (pricing itself is tailored to scope). */
  model: string;
  features: readonly string[];
  featured?: boolean;
  cta: string;
}

export const plansIntro = {
  eyebrow: "Plans",
  title: "Choose a plan that",
  accent: "fits your stage.",
  lead: "Flexible engagements that scale up or down with your roadmap. Pricing is tailored to your scope.",
};

export const plans: readonly Plan[] = [
  {
    name: "Starter",
    tagline: "For a first AI or software initiative.",
    model: "Project-based",
    features: ["Discovery & roadmap", "Small focused squad", "Fixed-scope delivery", "Weekly demos"],
    cta: "Talk to us",
  },
  {
    name: "Growth",
    tagline: "For teams scaling a product or platform.",
    model: "Dedicated team",
    features: [
      "Dedicated cross-functional team",
      "Embedded with your rituals",
      "Architecture & quality guidance",
      "Flexible scaling up or down",
      "Priority support",
    ],
    featured: true,
    cta: "Build my team",
  },
  {
    name: "Enterprise",
    tagline: "For programmes that span the organisation.",
    model: "Multi-team programme",
    features: [
      "Multiple teams & workstreams",
      "Governance & compliance alignment",
      "Dedicated delivery lead",
      "Custom commercial terms",
    ],
    cta: "Contact sales",
  },
];

export const peopleIntro = {
  eyebrow: "The people",
  title: "The people behind",
  accent: "the delivery.",
  lead: "Senior leadership stays close to every engagement.",
};

// CONFIRM — leadership names and photos to be supplied
export const leadership = [
  { role: "Chief Executive", monogram: "CEO", area: "Vision & client partnerships", hue: 238 },
  { role: "Head of AI", monogram: "AI", area: "Research & applied ML", hue: 188 },
  { role: "Head of Engineering", monogram: "ENG", area: "Architecture & delivery", hue: 262 },
  { role: "Client Success", monogram: "CS", area: "Onboarding & outcomes", hue: 168 },
] as const;

export const insightsIntro = {
  eyebrow: "Insights",
  title: "Notes from",
  accent: "our engineers.",
};

export const posts = [
  {
    category: "AI strategy",
    title: "From prototype to production: why most AI pilots stall",
    excerpt: "The patterns that separate demos from systems people depend on.",
    readTime: "6 min read",
  },
  {
    category: "Architecture",
    title: "Build or buy your LLM platform? A decision framework",
    excerpt: "A practical way to weigh cost, control, speed and risk.",
    readTime: "8 min read",
  },
  {
    category: "Delivery",
    title: "How embedded engineering teams really work",
    excerpt: "Rituals, communication and trust when a team joins yours.",
    readTime: "5 min read",
  },
] as const;

export const solved = {
  eyebrow: "Solved",
  title: "Connect the dots.",
  accent: "Ship what scales.",
  lead: "Tell us where you are. We'll map the shortest path to production.",
  cta: "Start a project",
};

export const faqIntro = {
  eyebrow: "FAQ",
  title: "Questions clients",
  accent: "ask us.",
};

export const faqs = [
  {
    question: "How quickly can your engineers start?",
    answer:
      "Typically within days of agreeing scope. We shortlist matched engineers quickly so kickoff isn't held up by hiring.",
  },
  {
    question: "Do you work alongside our existing team?",
    answer:
      "Yes. Many engagements embed our engineers directly into your squads, tools and rituals, so there is one team and one backlog.",
  },
  {
    question: "How do you protect our code and data?",
    answer:
      "Ownership stays with you, access is least-privilege and audited, and delivery practices are documented for your security review.",
  },
  {
    question: "What engagement models do you offer?",
    answer:
      "Dedicated teams, embedded engineers, fixed-scope projects and advisory work. We can combine them as your needs change.",
  },
  {
    question: "Which technologies do you work with?",
    answer:
      "Across AI and data, web and mobile, backend and cloud. If you do not see your stack above, ask: we likely have it covered.",
  },
] as const;

export const contactIntro = {
  eyebrow: "Contact",
  title: "Let's discuss",
  accent: "your project.",
  lead: "Share a few details and a senior engineer will reply with next steps.",
};
