import { expect, test, type Page } from "@playwright/test";

import { jumpTo } from "./helpers";

async function fillValidForm(page: Page, interest: string, message: string): Promise<void> {
  await page.getByLabel(/Full name/).fill("Jane Cooper");
  await page.getByLabel(/Work email/).fill("jane@company.com");
  await page.getByLabel(/What do you need/).selectOption(interest);
  await page.getByLabel(/Tell us about your project/).fill(message);
  await page.getByRole("checkbox").check();
}

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await jumpTo(page, "form[aria-label='Project inquiry']", -150);
  });

  test("shows specific, human error messages when submitted empty", async ({ page }) => {
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter your email address.")).toBeVisible();
    await expect(page.getByText("Please choose what you need help with.")).toBeVisible();
    await expect(page.getByText("Please agree so we can reply to you.")).toBeVisible();
    // errors are announced and linked to their fields
    await expect(page.getByLabel(/Full name/)).toHaveAttribute("aria-invalid", "true");
  });

  test("rejects an invalid email address inline", async ({ page }) => {
    await page.getByLabel(/Work email/).fill("not-an-email");
    await page.getByLabel(/Full name/).click();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  });

  test("submits a valid inquiry and confirms (demo mode)", async ({ page }) => {
    await fillValidForm(page, "genai", "We want an internal assistant grounded in our docs.");
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByRole("heading", { name: "Message received" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Demo mode/)).toBeVisible();
    await page.getByRole("button", { name: "Send another message" }).click();
    await expect(page.getByLabel(/Full name/)).toHaveValue("");
  });

  test("tells the visitor plainly when the server cannot be reached", async ({ page }) => {
    await page.route("**/api/inquiries", (route) => route.abort("failed"));
    await fillValidForm(page, "cloud", "Please help us move to Kubernetes.");
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "couldn't reach the server" })).toBeVisible();
    // the form keeps what they typed
    await expect(page.getByLabel(/Full name/)).toHaveValue("Jane Cooper");
  });

  test("surfaces a server-side failure without technical detail", async ({ page }) => {
    await page.route("**/api/inquiries", (route) =>
      route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "We couldn't send your message just now. Please try again in a moment.",
        }),
      }),
    );
    await fillValidForm(page, "data", "We need a data platform for our analysts.");
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByText("We couldn't send your message just now.")).toBeVisible();
  });
});
