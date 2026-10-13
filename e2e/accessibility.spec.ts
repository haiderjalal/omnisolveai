import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { jumpTo } from "./helpers";

/** Fails on serious/critical WCAG 2.1 A/AA violations; lesser ones are logged for review. */
async function scan(page: Page, label: string): Promise<void> {
  // let entrance transitions finish: axe measures the opacity the browser reports mid-animation
  await page.waitForTimeout(3000);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const blocking = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  if (results.violations.length) {
    console.log(
      `[axe:${label}]`,
      results.violations.map((v) => `${v.impact} ${v.id} (${v.nodes.length})`).join(" | "),
    );
  }
  expect(
    blocking.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      targets: violation.nodes.slice(0, 3).map((node) => node.target),
    })),
  ).toEqual([]);
}

test.describe("accessibility (WCAG 2.1 AA)", () => {
  test("hero", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2500);
    await scan(page, "hero");
  });

  test("proof section", async ({ page }) => {
    await page.goto("/");
    await jumpTo(page, "#proof", 0);
    await scan(page, "proof");
  });

  test("contact form and footer", async ({ page }) => {
    await page.goto("/");
    await jumpTo(page, "#contact", 0);
    await page.waitForTimeout(1500);
    await scan(page, "contact");
  });

  test("with reduced motion the whole page is still accessible", async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(1500);
    await scan(page, "reduced-motion");
    await context.close();
  });

  test("keyboard: the skip link is first and reaches the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("keyboard: the mobile menu is a modal dialog that closes with Escape", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
    await context.close();
  });
});
