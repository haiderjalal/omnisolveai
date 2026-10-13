import { describe, expect, it } from "vitest";

import { checkRateLimit } from "./rateLimit";

describe("checkRateLimit", () => {
  it("allows requests up to the limit, then blocks with a retry hint", () => {
    const key = "test:limit";
    const start = 1_000_000;
    for (let i = 0; i < 3; i++) expect(checkRateLimit(key, 3, 60_000, start + i).allowed).toBe(true);

    const blocked = checkRateLimit(key, 3, 60_000, start + 10);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
  });

  it("opens a fresh window once the old one has expired", () => {
    const key = "test:window";
    const start = 5_000_000;
    checkRateLimit(key, 1, 1000, start);
    expect(checkRateLimit(key, 1, 1000, start + 500).allowed).toBe(false);
    expect(checkRateLimit(key, 1, 1000, start + 1001).allowed).toBe(true);
  });

  it("tracks callers independently", () => {
    const start = 9_000_000;
    checkRateLimit("test:a", 1, 60_000, start);
    expect(checkRateLimit("test:a", 1, 60_000, start + 1).allowed).toBe(false);
    expect(checkRateLimit("test:b", 1, 60_000, start + 1).allowed).toBe(true);
  });
});
