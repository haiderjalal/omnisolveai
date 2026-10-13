import { defineConfig } from "@playwright/test";

const PORT = 3100;

/**
 * End-to-end tests run against the PRODUCTION build (`npm run build` first), because that is
 * what visitors get. They use the installed Edge channel with a software GL backend so the
 * WebGL scene can render on machines without a GPU; set E2E_BROWSER_CHANNEL=chrome (or run
 * `npx playwright install chromium` and set it to "chromium") to change the browser.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.E2E_BROWSER_CHANNEL ?? "msedge",
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
    },
  },
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
    // raise the inquiry rate limit so repeated test runs are not throttled
    env: { INQUIRY_RATE_LIMIT: "1000" },
  },
});
