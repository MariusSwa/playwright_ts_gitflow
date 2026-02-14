import { defineConfig, devices } from "@playwright/test";
import { env } from "./src/utils/env";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 10_000 },

  // Nice defaults for fork-and-go:
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }]
  ],

  use: {
    baseURL: env.BASE_URL,
    actionTimeout: 25_000,
    navigationTimeout: 25_000,

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // Helps reduce flakiness for new users:
    viewport: { width: 1366, height: 768 },
    ignoreHTTPSErrors: true
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
