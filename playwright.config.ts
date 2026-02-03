import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  outputDir: "test-results",
  timeout: 60_000,

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    navigationTimeout: 45_000,
  },

  projects: [
    // Setup: authenticate and save session
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    // Unauthenticated tests (no setup dependency)
    {
      name: "unauthenticated",
      testMatch: /\.(spec)\.ts/,
      testIgnore: /authenticated\./,
      use: { ...devices["Desktop Chrome"] },
    },
    // Authenticated tests (depend on setup)
    {
      name: "authenticated",
      testMatch: /authenticated\./,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
