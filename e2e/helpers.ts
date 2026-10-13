import type { Page } from "@playwright/test";

/** Scrolls so `selector` sits `offset` px from the viewport top, then lets scroll-driven UI settle. */
export async function jumpTo(page: Page, selector: string, offset = -80): Promise<void> {
  await page.evaluate(
    ([sel, extra]) => {
      const element = document.querySelector(sel as string);
      if (!element) throw new Error(`No element for ${sel}`);
      window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY + (extra as number));
    },
    [selector, offset] as const,
  );
  await page.waitForTimeout(900);
}
