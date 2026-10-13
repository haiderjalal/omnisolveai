"use client";

import { useEffect, useId, useState } from "react";

import { AlertCircle, Check, Sparkles } from "lucide-react";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site";
import { INQUIRY_INTERESTS, INQUIRY_INTEREST_LABELS } from "@/lib/validations/inquiry.options";
import type { InquiryFormValues } from "@/lib/validations/inquiry.schema";
import { useStoryStore } from "@/store/storyStore";
import type { ApiResponse } from "@/types/api";
import { cn } from "@/utils/cn";

type SubmitState = "idle" | "success";

/**
 * Validation is loaded on first use (first blur or submit), not with the page: zod and the
 * resolver are ~50 KB that nobody needs until they start filling the form in. The server
 * validates with the very same schema, so behaviour is identical either way.
 */
const lazyZodResolver: Resolver<InquiryFormValues> = async (values, context, options) => {
  const [{ zodResolver }, { inquirySchema }] = await Promise.all([
    import("@hookform/resolvers/zod"),
    import("@/lib/validations/inquiry.schema"),
  ]);
  return zodResolver(inquirySchema)(values, context, options) as ReturnType<Resolver<InquiryFormValues>>;
};

const FIELD_BASE =
  "w-full rounded-xl border bg-white px-4 py-3 text-[0.95rem] text-slate-900 shadow-sm outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-slate-500 focus:border-teal-brand focus:shadow-[0_0_0_4px_rgb(10_158_162/0.18)]";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (describedBy: string | undefined) => React.ReactNode;
}

/** Label + control + error wiring (aria-describedby / aria-invalid handled by the caller). */
function Field({ id, label, error, hint, required, className, children }: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-slate-800"
      >
        <span>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-teal-ink">
              *
            </span>
          )}
        </span>
        {!required && <span className="text-xs font-normal text-slate-600">Optional</span>}
      </label>
      {children(describedBy)}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-600">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
        >
          <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** Animated confirmation: the orbit ring sweeps round a check mark. */
function SuccessPanel({ delivery, onReset }: { delivery: "sent" | "demo"; onReset: () => void }) {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center text-center" role="status">
      <svg viewBox="0 0 120 120" className="size-28" fill="none" aria-hidden="true">
        <circle cx="60" cy="60" r="50" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="url(#success-ring)"
          strokeWidth="5"
          strokeLinecap="round"
          pathLength="1"
          className="success-ring"
          transform="rotate(-90 60 60)"
        />
        <path
          d="M38 62 l15 15 l30 -34"
          stroke="#0a9ea2"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          className="success-check"
        />
        <defs>
          <linearGradient id="success-ring" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6f72f5" />
            <stop offset="1" stopColor="#12c9b8" />
          </linearGradient>
        </defs>
      </svg>
      <h3 className="mt-8 font-display text-3xl font-semibold text-slate-900">Message received</h3>
      <p className="mt-3 max-w-sm text-[0.97rem] leading-relaxed text-slate-600">
        Thank you. A senior engineer will reply — {siteConfig.contact.responseTime.toLowerCase()}.
      </p>
      {delivery === "demo" && (
        <p className="mt-5 flex max-w-sm items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-left text-xs leading-relaxed text-amber-800">
          <Sparkles aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Demo mode: this preview isn&apos;t connected to an email provider yet, so the message was validated
          but not sent.
        </p>
      )}
      <button
        type="button"
        onClick={onReset}
        className="mt-8 rounded-full px-5 py-2.5 text-sm font-semibold text-teal-ink underline-offset-4 hover:underline"
      >
        Send another message
      </button>
    </div>
  );
}

/**
 * The inquiry form. Validation runs in the browser (instant, specific messages) and again on
 * the server with the same schema. A hidden honeypot and an idempotency key guard against
 * bots and double submits.
 */
export function ContactForm() {
  const formId = useId();
  const [state, setState] = useState<SubmitState>("idle");
  const [delivery, setDelivery] = useState<"sent" | "demo">("demo");
  const [formError, setFormError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);
  /** Created on first submit and reused for retries, so a retry can never create a duplicate. */
  const [submissionKey, setSubmissionKey] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: lazyZodResolver,
    mode: "onTouched",
    defaultValues: { name: "", email: "", company: "", phone: "", message: "", consent: false, website: "" },
  });

  // A role / plan chosen elsewhere on the page arrives here as a drafted message.
  useEffect(
    () =>
      useStoryStore.subscribe((current, previous) => {
        if (!current.inquiryDraft || current.inquiryDraft === previous.inquiryDraft) return;
        setValue("message", current.inquiryDraft, { shouldDirty: true, shouldValidate: false });
        setPrefilled(true);
        current.setInquiryDraft("");
      }),
    [setValue],
  );

  const onSubmit = async (values: InquiryFormValues): Promise<void> => {
    setFormError(null);
    const key = submissionKey ?? crypto.randomUUID();
    setSubmissionKey(key);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": key },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as ApiResponse<{ id: string; delivery: "sent" | "demo" }>;

      if (result.success) {
        setDelivery(result.data.delivery);
        setState("success");
        return;
      }

      if (result.errors) {
        for (const [field, messages] of Object.entries(result.errors)) {
          if (messages?.[0]) setError(field as keyof InquiryFormValues, { message: messages[0] });
        }
      }
      setFormError(result.message);
    } catch {
      setFormError("We couldn't reach the server. Please check your connection and try again.");
    }
  };

  const resetForm = (): void => {
    reset();
    setPrefilled(false);
    setSubmissionKey(null);
    setState("idle");
  };

  if (state === "success") return <SuccessPanel delivery={delivery} onReset={resetForm} />;

  const id = (name: string): string => `${formId}-${name}`;
  const invalid = (name: keyof InquiryFormValues): boolean => Boolean(errors[name]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Project inquiry"
      className="grid gap-5 sm:grid-cols-2"
    >
      <Field id={id("name")} label="Full name" required error={errors.name?.message}>
        {(describedBy) => (
          <input
            id={id("name")}
            type="text"
            autoComplete="name"
            placeholder="Jane Cooper"
            aria-invalid={invalid("name")}
            aria-describedby={describedBy}
            className={cn(FIELD_BASE, invalid("name") ? "border-red-400" : "border-slate-200")}
            {...register("name")}
          />
        )}
      </Field>

      <Field id={id("email")} label="Work email" required error={errors.email?.message}>
        {(describedBy) => (
          <input
            id={id("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="jane@company.com"
            aria-invalid={invalid("email")}
            aria-describedby={describedBy}
            className={cn(FIELD_BASE, invalid("email") ? "border-red-400" : "border-slate-200")}
            {...register("email")}
          />
        )}
      </Field>

      <Field id={id("company")} label="Company" error={errors.company?.message}>
        {(describedBy) => (
          <input
            id={id("company")}
            type="text"
            autoComplete="organization"
            placeholder="Acme Inc."
            aria-invalid={invalid("company")}
            aria-describedby={describedBy}
            className={cn(FIELD_BASE, invalid("company") ? "border-red-400" : "border-slate-200")}
            {...register("company")}
          />
        )}
      </Field>

      <Field id={id("phone")} label="Phone" error={errors.phone?.message}>
        {(describedBy) => (
          <input
            id={id("phone")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+1 555 000 0000"
            aria-invalid={invalid("phone")}
            aria-describedby={describedBy}
            className={cn(FIELD_BASE, invalid("phone") ? "border-red-400" : "border-slate-200")}
            {...register("phone")}
          />
        )}
      </Field>

      <Field
        id={id("interest")}
        label="What do you need?"
        required
        error={errors.interest?.message}
        className="sm:col-span-2"
      >
        {(describedBy) => (
          <select
            id={id("interest")}
            defaultValue=""
            aria-invalid={invalid("interest")}
            aria-describedby={describedBy}
            className={cn(
              FIELD_BASE,
              "appearance-none",
              invalid("interest") ? "border-red-400" : "border-slate-200",
            )}
            {...register("interest")}
          >
            <option value="" disabled>
              Choose one…
            </option>
            {INQUIRY_INTERESTS.map((interest) => (
              <option key={interest} value={interest}>
                {INQUIRY_INTEREST_LABELS[interest]}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field
        id={id("message")}
        label="Tell us about your project"
        required
        error={errors.message?.message}
        hint={prefilled ? "We pre-filled this from your selection. Edit it freely." : undefined}
        className="sm:col-span-2"
      >
        {(describedBy) => (
          <textarea
            id={id("message")}
            rows={5}
            placeholder="Goals, timeline, current stack, anything that helps us prepare…"
            aria-invalid={invalid("message")}
            aria-describedby={describedBy}
            className={cn(FIELD_BASE, "resize-y", invalid("message") ? "border-red-400" : "border-slate-200")}
            {...register("message")}
          />
        )}
      </Field>

      {/* Honeypot: invisible to people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input id={id("website")} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-600">
          <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
            <input
              type="checkbox"
              aria-invalid={invalid("consent")}
              aria-describedby={errors.consent ? id("consent-error") : undefined}
              className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition-colors checked:border-teal-brand checked:bg-teal-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-brand"
              {...register("consent")}
            />
            <Check
              aria-hidden="true"
              className="pointer-events-none relative size-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            />
          </span>
          <span>
            I agree that OmniSolve may contact me about this inquiry and store my details for that purpose.
          </span>
        </label>
        {errors.consent && (
          <p
            id={id("consent-error")}
            role="alert"
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
          >
            <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
            {errors.consent.message}
          </p>
        )}
      </div>

      {formError && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {formError}
        </p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          {isSubmitting ? "Sending…" : "Send inquiry"}
        </Button>
        <p className="mt-3 text-center text-xs text-slate-600">
          Your details are used only to reply to this inquiry. {siteConfig.contact.responseTime} reply.
        </p>
      </div>
    </form>
  );
}
