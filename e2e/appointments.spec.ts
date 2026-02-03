import { test, expect } from "@playwright/test";

test.describe("Appointments Page - Unauthenticated", () => {
  test("redirects to login", async ({ page }) => {
    await page.goto("/appointments");
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  });
});
