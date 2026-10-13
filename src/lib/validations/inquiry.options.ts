/**
 * What the visitor is enquiring about. Kept separate from the zod schema so the UI can list
 * the options without pulling the validation library into the initial JavaScript bundle.
 */
export const INQUIRY_INTERESTS = ["ai-ml", "genai", "data", "software", "cloud", "team", "other"] as const;
export type InquiryInterest = (typeof INQUIRY_INTERESTS)[number];

export const INQUIRY_INTEREST_LABELS: Record<InquiryInterest, string> = {
  "ai-ml": "AI & machine learning",
  genai: "Generative AI & agents",
  data: "Data engineering",
  software: "Custom software",
  cloud: "Cloud & DevOps",
  team: "Build or extend a team",
  other: "Something else",
};
