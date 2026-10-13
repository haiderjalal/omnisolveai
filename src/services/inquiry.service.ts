import { randomUUID } from "node:crypto";

import { EmailDeliveryError } from "@/lib/email/resend";
import { logger } from "@/lib/logger";
import { sanitizeInquiry, type InquiryInput } from "@/lib/validations/inquiry.schema";

export type InquiryDelivery = "sent" | "demo";

export interface InquiryRecord extends ReturnType<typeof sanitizeInquiry> {
  id: string;
}

export interface InquiryReceipt {
  id: string;
  /** "demo" means the environment has no email provider configured, so nothing was sent. */
  delivery: InquiryDelivery;
}

/** Anything that can tell the team about a new inquiry (email today; WhatsApp or CRM later). */
export interface InquiryNotifier {
  notify(record: InquiryRecord): Promise<InquiryDelivery>;
}

/** Raised when the team could not be notified, so the visitor is told instead of silently losing the lead. */
export class NotificationFailedError extends Error {
  constructor(options?: ErrorOptions) {
    super("Unable to notify the team about this inquiry.", options);
    this.name = "NotificationFailedError";
  }
}

const MAX_REMEMBERED_KEYS = 500;

/**
 * Business logic for inquiries: honeypot handling, de-duplication, sanitising, notifying.
 *
 * NOTE: there is no database yet. Until inquiries are persisted (see docs/architecture.md),
 * a failed notification must fail the request — otherwise the lead would exist nowhere.
 */
export class InquiryService {
  private readonly receipts = new Map<string, InquiryReceipt>();

  constructor(private readonly notifier: InquiryNotifier) {}

  async submit(input: InquiryInput, idempotencyKey?: string): Promise<InquiryReceipt> {
    // Bots that fill the hidden field get a convincing "success" and nothing else happens.
    if (input.website) {
      logger.warn("Honeypot field filled; inquiry discarded");
      return { id: randomUUID(), delivery: "demo" };
    }

    if (idempotencyKey) {
      const previous = this.receipts.get(idempotencyKey);
      if (previous) return previous;
    }

    const record: InquiryRecord = { id: randomUUID(), ...sanitizeInquiry(input) };
    logger.info("Inquiry received", { id: record.id, interest: record.interest });

    let delivery: InquiryDelivery;
    try {
      delivery = await this.notifier.notify(record);
    } catch (error) {
      logger.error("Inquiry notification failed", {
        id: record.id,
        error,
        retryable: error instanceof EmailDeliveryError,
      });
      throw new NotificationFailedError({ cause: error });
    }

    const receipt: InquiryReceipt = { id: record.id, delivery };
    if (idempotencyKey) {
      if (this.receipts.size >= MAX_REMEMBERED_KEYS) this.receipts.clear();
      this.receipts.set(idempotencyKey, receipt);
    }
    logger.info("Inquiry handled", { id: record.id, delivery });
    return receipt;
  }
}
