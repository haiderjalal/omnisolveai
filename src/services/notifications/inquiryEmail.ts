import { getEmailConfig, sendEmail, type EmailMessage } from "@/lib/email/resend";
import { INQUIRY_INTEREST_LABELS } from "@/lib/validations/inquiry.options";

import type { InquiryDelivery, InquiryNotifier, InquiryRecord } from "../inquiry.service";

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Builds the notification email. All visitor-supplied text is escaped before it reaches HTML. */
export function buildInquiryEmail(record: InquiryRecord, to: string): EmailMessage {
  const interest = INQUIRY_INTEREST_LABELS[record.interest];
  const rows: [string, string][] = [
    ["Name", record.name],
    ["Email", record.email],
    ["Company", record.company || "—"],
    ["Phone", record.phone || "—"],
    ["Interested in", interest],
  ];

  const text = [
    `New inquiry (${record.id})`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    record.message,
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;line-height:1.55;color:#0f172a">
<h2 style="margin:0 0 12px">New inquiry</h2>
<table style="border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#64748b">${escapeHtml(label)}</td><td style="padding:4px 0"><strong>${escapeHtml(value)}</strong></td></tr>`,
    )
    .join("")}</table>
<h3 style="margin:20px 0 6px">Message</h3>
<p style="white-space:pre-wrap;margin:0">${escapeHtml(record.message)}</p>
<p style="margin-top:24px;color:#94a3b8;font-size:12px">Reference ${escapeHtml(record.id)}</p>
</div>`;

  return {
    to,
    // subject text has already had control characters stripped, so it cannot inject headers
    subject: `New inquiry from ${record.name} — ${interest}`,
    text,
    html,
    replyTo: record.email,
  };
}

/**
 * Emails each inquiry to the OmniSolve team via Resend. When the environment is not
 * configured the notifier runs in DEMO mode: nothing is sent, which is what we want while
 * the site is being shown and reviewed.
 */
export class EmailInquiryNotifier implements InquiryNotifier {
  async notify(record: InquiryRecord): Promise<InquiryDelivery> {
    const config = getEmailConfig();
    if (!config) return "demo";
    await sendEmail(config, buildInquiryEmail(record, config.to));
    return "sent";
  }
}
