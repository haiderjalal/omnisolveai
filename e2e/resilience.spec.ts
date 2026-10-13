import { expect, test } from "@playwright/test";

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("pinned tours become plain readable lists", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\brm\b/);
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    for (const name of [
      "Financial services",
      "Healthcare & life sciences",
      "Retail & commerce",
      "Logistics & supply chain",
      "Technology & SaaS",
    ]) {
      await expect(page.getByRole("heading", { name })).toBeAttached();
    }
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(pageHeight).toBeLessThan(20_000);
  });

  test("services render as a grid, all six reachable", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#services .carousel-card");
    await expect(cards).toHaveCount(6);
    for (let i = 0; i < 6; i++) await expect(cards.nth(i)).toHaveCSS("position", "static");
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("all primary content is present and visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Strategy decks are easy to buy.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Choose a plan that fits your stage." })).toBeAttached();
    await expect(page.locator("form[aria-label='Project inquiry']")).toBeAttached();
  });

  test("the sitemap and robots endpoints exist", async ({ request }) => {
    expect((await request.get("/sitemap.xml")).status()).toBe(200);
    expect((await request.get("/robots.txt")).status()).toBe(200);
  });
});

test.describe("not found", () => {
  test("unknown routes show a friendly 404 with a way home", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /out of orbit/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
  });
});
