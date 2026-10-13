import { z } from "zod";

import { INQUIRY_INTERESTS } from "./inquiry.options";

const PHONE_PATTERN = /^[+()\d\s.-]{7,24}$/;

/**
 * Single source of truth for inquiry validation. The browser form (React Hook Form) and the
 * API route both use it, so the rules can never drift apart.
 * Messages are written for people, never for developers.
 */
export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "That name is a little long — please shorten it."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address.")
    .max(160, "That email address is too long."),
  company: z.string().trim().max(120, "Please keep the company name under 120 characters."),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || PHONE_PATTERN.test(value), "Please enter a valid phone number."),
  interest: z.enum(INQUIRY_INTERESTS, {
    errorMap: () => ({ message: "Please choose what you need help with." }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(2000, "Please keep your message under 2000 characters."),
  consent: z.boolean().refine((value) => value, "Please agree so we can reply to you."),
  /** Honeypot: hidden from people, irresistible to form-filling bots. Must stay empty. */
  website: z.string().max(0).optional(),
});

export type InquiryFormValues = z.input<typeof inquirySchema>;
export type InquiryInput = z.output<typeof inquirySchema>;

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const singleLine = (value: string): string =>
  value.replace(CONTROL_CHARACTERS, "").replace(/\s+/g, " ").trim();
const multiLine = (value: string): string =>
  value
    .replace(CONTROL_CHARACTERS, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

/**
 * Server-side sanitisation applied AFTER validation: removes control characters (which can be
 * used for header/log injection) and normalises whitespace. Output is plain text; it is never
 * rendered as HTML (the email template escapes it again).
 */
export function sanitizeInquiry(input: InquiryInput): Required<Omit<InquiryInput, "website" | "consent">> {
  return {
    name: singleLine(input.name),
    email: singleLine(input.email),
    company: singleLine(input.company),
    phone: singleLine(input.phone),
    interest: input.interest,
    message: multiLine(input.message),
  };
}
