// Captures a still of every story chapter (desktop + phone) from a running site, for decks,
// reviews and before/after comparisons.
//
//   npm run build && npm run start -- -p 3100        (in one terminal)
//   node scripts/capture-pitch.mjs http://localhost:3100
//
// Output: docs/pitch/stills/*.png
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { chromium } from "@playwright/test";

const baseUrl = process.argv[2] ?? "http://localhost:3100";
const outDir = resolve("docs/pitch/stills");
mkdirSync(outDir, { recursive: true });

/** Where to scroll for each still: an element selector plus how far into it (px or fraction of its pinned range). */
const DESKTOP_SHOTS = [
  { name: "01-hero", selector: "#top", at: { px: 0 } },
  { name: "02-the-gap", selector: "#gap", at: { pinned: 0.62 } },
  { name: "03-industries-north-america", selector: "#industries", at: { pinned: 0.13 } },
  { name: "04-industries-europe", selector: "#industries", at: { pinned: 0.5 } },
  { name: "05-services-carousel", selector: "#services", at: { pinned: 0.55 } },
  { name: "06-proof-stats", selector: "#proof", at: { px: 120 } },
  { name: "07-proof-case-studies", selector: "#proof", at: { px: 1100 } },
  { name: "08-team-builder", selector: "#team", at: { px: 150 } },
  { name: "09-security", selector: "#security", at: { px: 60 } },
  { name: "10-plans", selector: "#pricing", at: { px: 200 } },
  { name: "11-people", selector: "#people", at: { px: 150 } },
  { name: "12-solved", selector: "#solved", at: { px: 0 } },
  { name: "13-contact", selector: "#contact", at: { px: 1500 } },
];

const MOBILE_SHOTS = [
  { name: "m01-hero", selector: "#top", at: { px: 0 } },
  { name: "m02-the-gap", selector: "#gap", at: { pinned: 0.6 } },
  { name: "m03-industries", selector: "#industries", at: { pinned: 0.3 } },
  { name: "m04-services", selector: "#services", at: { pinned: 0.5 } },
  { name: "m05-plans", selector: "#pricing", at: { px: 250 } },
  { name: "m06-contact", selector: "#contact", at: { px: 1500 } },
];

async function run(label, shots, contextOptions) {
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  });
  const page = await (await browser.newContext(contextOptions)).newPage();
  await page.goto(baseUrl, { waitUntil: "load" });
  await page.waitForTimeout(6000);

  for (const shot of shots) {
    const y = await page.evaluate(({ selector, at }) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      const top = element.getBoundingClientRect().top + window.scrollY;
      if ("pinned" in at)
        return top + at.pinned * (element.getBoundingClientRect().height - window.innerHeight);
      return top + at.px;
    }, shot);
    // approach from above in two steps so scroll-driven scenes (and reveal transitions) play naturally
    await page.evaluate((target) => window.scrollTo(0, Math.max(0, target - 500)), y);
    await page.waitForTimeout(500);
    await page.evaluate((target) => window.scrollTo(0, target), y);
    await page.waitForTimeout(3200);
    const file = resolve(outDir, `${shot.name}.png`);
    await page.screenshot({ path: file });
    console.log(`${label}: ${shot.name}`);
  }
  await browser.close();
}

await run("desktop", DESKTOP_SHOTS, { viewport: { width: 1440, height: 900 } });
await run("mobile", MOBILE_SHOTS, {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
console.log(`Saved to ${outDir}`);
