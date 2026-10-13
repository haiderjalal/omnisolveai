// Dev utility: screenshots the running site at chosen scroll positions using headless Edge.
// Handy for design review and for the pitch kit (before/after stills).
//
//   node scripts/capture.mjs --url http://localhost:3000 --w 1440 --h 900 \
//        --scroll 0,1vh,3vh --wait 3500 --out .captures/home
//
// Scroll values are pixels, or a multiple of the viewport height ("2.5vh").
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { chromium } from "@playwright/test";

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 2) options[argv[i].replace(/^--/, "")] = argv[i + 1];
  return options;
}

const options = parseArgs(process.argv.slice(2));
const url = options.url ?? "http://localhost:3000";
const width = Number(options.w ?? 1440);
const height = Number(options.h ?? 900);
const dpr = Number(options.dpr ?? 1);
const settle = Number(options.wait ?? 3500);
const outPrefix = resolve(options.out ?? ".captures/shot");
const scrolls = (options.scroll ?? "0").split(",").map((value) => value.trim());
const mobile = options.mobile === "1";
const reduced = options.reduced === "1";

mkdirSync(dirname(outPrefix), { recursive: true });

const browser = await chromium.launch({
  channel: "msedge",
  headless: true,
  args: [
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
    "--enable-webgl",
  ],
});
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: dpr,
  isMobile: mobile,
  hasTouch: mobile,
  reducedMotion: reduced ? "reduce" : "no-preference",
});
const page = await context.newPage();

const problems = [];
page.on("console", (message) => {
  const text = message.text();
  if (message.type() === "error" || /shader|webgl|THREE\.WebGLProgram/i.test(text))
    problems.push(`[${message.type()}] ${text.slice(0, 400)}`);
});
page.on("pageerror", (error) => problems.push(`[pageerror] ${error.message.slice(0, 400)}`));

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(settle);

let index = 0;
for (const raw of scrolls) {
  const y = raw.endsWith("vh") ? Math.round(parseFloat(raw) * height) : Number(raw);
  await page.evaluate((target) => window.scrollTo(0, target), y);
  await page.waitForTimeout(options.step ? Number(options.step) : 1800);
  const file = `${outPrefix}-${String(index).padStart(2, "0")}.png`;
  await page.screenshot({ path: file });
  console.log(`saved ${file} (scrollY=${y})`);
  index++;
}

const info = await page.evaluate(() => ({
  scrollHeight: document.documentElement.scrollHeight,
  canvas: !!document.querySelector("canvas"),
  rootClass: document.documentElement.className.replace(/\S*variable\S*/g, "").trim(),
}));
console.log("page:", JSON.stringify(info));
if (problems.length) console.log("PROBLEMS:\n" + problems.join("\n"));
else console.log("no console errors");

await browser.close();
