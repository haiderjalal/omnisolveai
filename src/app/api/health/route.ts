import { connection, NextResponse } from "next/server";

import type { ApiResponse } from "@/types/api";

interface HealthStatus {
  status: "ok";
  /** Whether outbound email is configured. Booleans only — never the values themselves. */
  emailConfigured: boolean;
}

/**
 * GET /api/health — liveness probe for monitoring. Confirms the app is serving and reports
 * which optional integrations are configured, without exposing any secret.
 */
export async function GET(): Promise<NextResponse<ApiResponse<HealthStatus>>> {
  // opt out of prerendering: this must reflect the environment of the running server
  await connection();
  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.INQUIRY_FROM_EMAIL && process.env.INQUIRY_TO_EMAIL,
  );
  return NextResponse.json(
    { success: true, message: "OmniSolve web is running.", data: { status: "ok", emailConfigured } },
    { headers: { "Cache-Control": "no-store" } },
  );
}
