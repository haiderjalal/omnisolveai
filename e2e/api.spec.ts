import { expect, test } from "@playwright/test";

const valid = {
  name: "Jane Cooper",
  email: "jane@company.com",
  company: "Acme",
  phone: "",
  interest: "software",
  message: "We need a customer portal built on our existing APIs.",
  consent: true,
};

test.describe("API", () => {
  test("GET /api/health reports ok without leaking secrets", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ success: true, data: { status: "ok" } });
    expect(JSON.stringify(body)).not.toMatch(/re_[A-Za-z0-9]|api[_-]?key/i);
  });

  test("POST /api/inquiries accepts a valid inquiry", async ({ request }) => {
    const response = await request.post("/api/inquiries", { data: valid });
    expect(response.status()).toBe(201);
    expect(await response.json()).toMatchObject({ success: true, data: { delivery: "demo" } });
  });

  test("POST /api/inquiries validates on the server too", async ({ request }) => {
    const response = await request.post("/api/inquiries", { data: { ...valid, email: "bad", message: "x" } });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.errors.email[0]).toBe("Please enter a valid email address.");
    expect(body.errors.message[0]).toMatch(/at least 10 characters/);
  });

  test("rejects malformed JSON and oversized bodies safely", async ({ request }) => {
    const malformed = await request.post("/api/inquiries", {
      data: "{not json",
      headers: { "content-type": "application/json" },
    });
    expect(malformed.status()).toBe(400);
    const oversized = await request.post("/api/inquiries", {
      data: { ...valid, message: "x".repeat(20_000) },
    });
    expect(oversized.status()).toBe(413);
  });

  test("a filled honeypot never reaches the team", async ({ request }) => {
    const response = await request.post("/api/inquiries", {
      data: { ...valid, website: "http://spam.example" },
    });
    // the shared schema refuses a non-empty honeypot, so bots just see an ordinary validation failure
    expect(response.status()).toBe(400);
  });

  test("never exposes stack traces or internals in errors", async ({ request }) => {
    const response = await request.post("/api/inquiries", {
      data: "null",
      headers: { "content-type": "application/json" },
    });
    expect(await response.text()).not.toMatch(/at .*\.(ts|js):\d+|node_modules|stack/i);
  });

  test("robots.txt keeps non-production deployments out of search", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(await response.text()).toMatch(/Disallow: \//);
  });
});
