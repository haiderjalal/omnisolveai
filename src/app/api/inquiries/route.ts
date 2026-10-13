import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { inquirySchema } from "@/lib/validations/inquiry.schema";
import { inquiryService } from "@/services/container";
import { NotificationFailedError, type InquiryReceipt } from "@/services/inquiry.service";
import type { ApiResponse } from "@/types/api";

const RATE_LIMIT = Number(process.env.INQUIRY_RATE_LIMIT ?? 5);
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 16 * 1024;

function respond<T>(
  body: ApiResponse<T>,
  status: number,
  headers?: HeadersInit,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(body, { status, headers });
}

/**
 * POST /api/inquiries — submit a project inquiry.
 *
 * Request:  JSON matching `inquirySchema` (name, email, company, phone, interest, message, consent).
 *           Optional `Idempotency-Key` header makes retries safe.
 * Success:  201 { success: true, message, data: { id, delivery } }
 * Failures: 400 invalid input · 413 body too large · 429 rate limited · 502 team could not be
 *           notified · 500 unexpected. Messages are safe to show to visitors.
 */
export async function POST(request: Request): Promise<NextResponse<ApiResponse<InquiryReceipt>>> {
  try {
    const limit = checkRateLimit(`inquiry:${getClientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS);
    if (!limit.allowed) {
      return respond(
        {
          success: false,
          message: "You've sent several messages recently. Please wait a few minutes and try again.",
        },
        429,
        { "Retry-After": String(limit.retryAfter) },
      );
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return respond(
        { success: false, message: "Your message is too large. Please shorten it and try again." },
        413,
      );
    }

    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return respond({ success: false, message: "We couldn't read that request. Please try again." }, 400);
    }

    const parsed = inquirySchema.safeParse(payload);
    if (!parsed.success) {
      return respond(
        {
          success: false,
          message: "Please check the highlighted fields and try again.",
          errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        },
        400,
      );
    }

    const receipt = await inquiryService.submit(
      parsed.data,
      request.headers.get("idempotency-key") ?? undefined,
    );
    return respond(
      { success: true, message: "Thanks — your inquiry has been received.", data: receipt },
      201,
    );
  } catch (error) {
    if (error instanceof NotificationFailedError) {
      return respond(
        { success: false, message: "We couldn't send your message just now. Please try again in a moment." },
        502,
      );
    }
    logger.error("Unexpected error handling inquiry", { error });
    return respond({ success: false, message: "Something went wrong on our side. Please try again." }, 500);
  }
}
