// This file is the Playwright configuration file for the Test Duo Playground project. 
// It defines the settings and options for running Playwright tests, including 
// test directories, timeouts, retries, workers, reporters, and browser configurations. 
// The configuration also specifies how to handle traces, screenshots, and videos on 
// test failures. Additionally, it sets up projects for different browsers and a setup 
// project for authentication. This configuration ensures that the tests are run 
// consistently and efficiently across different environments.

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

  // Projects define different browsers and configurations to run the tests against. 
  // In this configuration, we have a setup project that runs any test files matching 
  // the pattern `*.setup.ts`, which can be used for authentication setup or other global 
  // test setup tasks. The Chromium project is configured to use the Chromium browser 
  // with a specific storage state for authentication, and it depends on the setup project 
  // to ensure that any necessary setup steps are completed before running the tests in 
  // the Chromium project.
  projects: [
    // 1) Setup project only runs the auth setup file
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // 2) Authenticated tests (depends on setup)
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: /.*\.public\.spec\.ts/,
    },

    // 3) Public tests (NO auth dependency)
    {
      name: 'chromium-public',
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
      testMatch: /.*\.public\.spec\.ts/,
    },
  ],
});
