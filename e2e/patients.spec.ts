import { test, expect } from "@playwright/test";

test.describe("Patients Page - Unauthenticated", () => {
  test("redirects to login", async ({ page }) => {
    await page.goto("/patients");
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  });

  test("patient detail redirects to login", async ({ page }) => {
    await page.goto("/patients/some-uuid-here");
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  });
});
