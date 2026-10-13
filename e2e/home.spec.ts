import { expect, test } from "@playwright/test";

import { jumpTo } from "./helpers";

test.describe("homepage story", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero delivers the headline, tagline and both calls to action", async ({ page }) => {
    await expect(page).toHaveTitle(/OmniSolve AI/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Enterprise AI and software, built to scale.",
    );
    await expect(page.getByRole("link", { name: "Start a project" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "See our work" }).first()).toBeVisible();
  });

  test("has every chapter, in story order", async ({ page }) => {
    const order = await page.$$eval("[data-chapter]", (elements) =>
      elements.map((element) => element.getAttribute("data-chapter")),
    );
    expect(order).toEqual([
      "hero",
      "gap",
      "industries",
      "services",
      "proof",
      "team",
      "trust",
      "plans",
      "people",
      "cta",
      "contact",
    ]);
    const tops = await page.$$eval("[data-chapter]", (elements) =>
      elements.map((element) => element.getBoundingClientRect().top + window.scrollY),
    );
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
  });

  test("renders a WebGL canvas behind the page", async ({ page }) => {
    await expect(page.locator("canvas")).toBeAttached({ timeout: 20_000 });
    // react-three-fiber sizes the canvas to its container once the renderer has mounted
    await expect
      .poll(async () => (await page.locator("canvas").first().boundingBox())?.width ?? 0, { timeout: 15_000 })
      .toBeGreaterThan(1000);
  });

  test("navigation links scroll to their chapter and the rail follows", async ({ page }) => {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Pricing" }).click();
    await expect(page.locator("#pricing")).toBeInViewport({ timeout: 10_000 });
    await expect(
      page.getByRole("navigation", { name: "Story chapters" }).locator('[aria-current="true"]'),
    ).toHaveAccessibleName("Go to Plans");
  });

  test("the industries tour changes the visible card as you scroll", async ({ page }) => {
    const section = page.locator("#industries");
    const top = await section.evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((y) => window.scrollTo(0, y + 600), top);
    await page.waitForTimeout(1200);
    await expect(section.getByRole("heading", { name: "Financial services" })).toBeVisible();
    // stop four ("Logistics") holds at roughly 66% of the pinned scroll range
    await page.evaluate((y) => window.scrollTo(0, y + 2750), top);
    await page.waitForTimeout(1500);
    await expect(section.getByRole("heading", { name: "Logistics & supply chain" })).toBeVisible();
  });

  test("the services carousel can be driven with its buttons", async ({ page }) => {
    await jumpTo(page, "#services", 0);
    const counter = page.locator("#services [aria-live='polite']");
    await expect(counter).toContainText("01");
    await page.getByRole("button", { name: "Next service" }).click();
    await expect(counter).toContainText("02", { timeout: 8000 });
  });

  test("stack filter shows only matching technologies", async ({ page }) => {
    await jumpTo(page, "#team", 1200);
    await page.getByRole("button", { name: "Mobile", exact: true }).click();
    await expect(page.getByText("Flutter", { exact: true })).toBeVisible();
    await expect(page.getByText("Python", { exact: true })).toBeHidden();
    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(page.getByText("Python", { exact: true })).toBeVisible();
  });

  test("picking roles drafts a message into the contact form", async ({ page }) => {
    await jumpTo(page, "#team", 250);
    await page.getByRole("button", { name: /AI \/ ML engineer/ }).click();
    await page.getByRole("button", { name: /Data engineer/ }).click();
    await page.getByRole("button", { name: "Request this team" }).click();
    const message = page.getByLabel(/Tell us about your project/);
    await expect(message).toHaveValue(/AI \/ ML engineer, Data engineer/, { timeout: 8000 });
  });

  test("choosing a plan drafts the plan into the contact form", async ({ page }) => {
    await jumpTo(page, "#pricing", 400);
    await page.getByRole("button", { name: "Build my team" }).click();
    await expect(page.getByLabel(/Tell us about your project/)).toHaveValue(/Growth plan/, { timeout: 8000 });
  });

  test("the FAQ is an exclusive accordion", async ({ page }) => {
    await jumpTo(page, "#contact", 100);
    const items = page.locator("details.faq-item");
    await expect(items.first()).toHaveAttribute("open", "");
    await items.nth(1).locator("summary").click();
    await expect(items.nth(1)).toHaveAttribute("open", "");
    await expect(items.first()).not.toHaveAttribute("open", "");
  });
});
