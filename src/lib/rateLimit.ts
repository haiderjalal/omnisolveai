/**
 * Fixed-window, in-memory rate limiter.
 *
 * Honest limitation: on serverless platforms each instance keeps its own memory, so this is a
 * best-effort brake against casual abuse and double-submits — not a hard guarantee. Before a
 * high-traffic launch, back it with a shared store (e.g. Upstash Redis / Vercel KV).
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may try again (0 when allowed). */
  retryAfter: number;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): RateLimitResult {
  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [storedKey, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(storedKey);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (bucket.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

/** Best-effort client address from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
