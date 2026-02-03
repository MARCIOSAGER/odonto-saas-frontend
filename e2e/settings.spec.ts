import { test, expect } from "@playwright/test";

test.describe("Settings Pages - Unauthenticated", () => {
  const settingsRoutes = [
    "/settings",
    "/settings/clinic",
    "/settings/billing",
    "/settings/ai",
    "/settings/security",
    "/settings/whatsapp",
    "/settings/email",
    "/settings/nps",
  ];

  for (const route of settingsRoutes) {
    test(`${route} redirects to login`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
    });
  }
});
