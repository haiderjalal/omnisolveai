/**
 * Thin client for the Resend REST API (no SDK dependency: one POST).
 * Configure via environment variables — see .env.example.
 */
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const REQUEST_TIMEOUT_MS = 8000;

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export interface EmailConfig {
  apiKey: string;
  from: string;
  to: string;
}

/** Returns the config when every required variable is present; otherwise null (demo mode). */
export function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM_EMAIL;
  const to = process.env.INQUIRY_TO_EMAIL;
  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to };
}

export class EmailDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailDeliveryError";
  }
}

/** Sends one email. Throws EmailDeliveryError on any failure (timeouts included). */
export async function sendEmail(config: EmailConfig, message: EmailMessage): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: config.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new EmailDeliveryError(`Resend responded with status ${response.status}`);
  } catch (error) {
    if (error instanceof EmailDeliveryError) throw error;
    throw new EmailDeliveryError(error instanceof Error ? error.message : "Unknown email error");
  } finally {
    clearTimeout(timeout);
  }
}
