import { describe, expect, it } from "vitest";

import { inquirySchema, sanitizeInquiry, type InquiryFormValues } from "./inquiry.schema";

const valid: InquiryFormValues = {
  name: "Jane Cooper",
  email: "Jane@Company.com",
  company: "Acme Inc.",
  phone: "+1 (555) 000-0000",
  interest: "genai",
  message: "We want to build an internal assistant on our data.",
  consent: true,
  website: "",
};

const issuesFor = (input: unknown): Record<string, string[]> => {
  const result = inquirySchema.safeParse(input);
  return result.success ? {} : (result.error.flatten().fieldErrors as Record<string, string[]>);
};

describe("inquirySchema", () => {
  it("accepts a complete, valid inquiry and normalises the email", () => {
    const result = inquirySchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("jane@company.com");
  });

  it("allows company and phone to be empty", () => {
    expect(inquirySchema.safeParse({ ...valid, company: "", phone: "" }).success).toBe(true);
  });

  it("gives people-friendly messages, not technical ones", () => {
    const errors = issuesFor({
      ...valid,
      name: "",
      email: "nope",
      message: "short",
      consent: false,
      interest: undefined,
    });
    expect(errors.name?.[0]).toBe("Please enter your name.");
    expect(errors.email?.[0]).toBe("Please enter a valid email address.");
    expect(errors.message?.[0]).toMatch(/at least 10 characters/);
    expect(errors.consent?.[0]).toMatch(/agree/);
    expect(errors.interest?.[0]).toBe("Please choose what you need help with.");
  });

  it("rejects malformed phone numbers but accepts common formats", () => {
    expect(issuesFor({ ...valid, phone: "call me maybe" }).phone).toBeDefined();
    expect(issuesFor({ ...valid, phone: "+44 20 7946 0958" }).phone).toBeUndefined();
  });

  it("enforces length limits", () => {
    expect(issuesFor({ ...valid, message: "x".repeat(2001) }).message).toBeDefined();
    expect(issuesFor({ ...valid, name: "x".repeat(81) }).name).toBeDefined();
  });

  it("rejects an unknown interest value", () => {
    expect(issuesFor({ ...valid, interest: "hack-the-planet" }).interest).toBeDefined();
  });

  it("keeps the honeypot field empty-only", () => {
    expect(issuesFor({ ...valid, website: "http://spam.example" }).website).toBeDefined();
  });
});

describe("sanitizeInquiry", () => {
  it("strips control characters and collapses whitespace in single-line fields", () => {
    const parsed = inquirySchema.parse({
      ...valid,
      name: "Jane\u0000 \n Cooper\u0007",
      company: "Acme\r\nInc",
    });
    const clean = sanitizeInquiry(parsed);
    expect(clean.name).toBe("Jane Cooper");
    expect(clean.company).toBe("Acme Inc");
  });

  it("keeps paragraph breaks in the message but caps blank lines", () => {
    const parsed = inquirySchema.parse({ ...valid, message: "Line one.\n\n\n\n\nLine two.\u0001" });
    expect(sanitizeInquiry(parsed).message).toBe("Line one.\n\nLine two.");
  });

  it("cannot be used for email header injection via the name", () => {
    const parsed = inquirySchema.parse({ ...valid, name: "Jane\r\nBcc: attacker@evil.com" });
    expect(sanitizeInquiry(parsed).name).not.toMatch(/[\r\n]/);
  });
});
