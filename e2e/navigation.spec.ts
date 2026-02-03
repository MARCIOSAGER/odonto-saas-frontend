import { test, expect } from "@playwright/test";

test.describe("Navigation - Route Protection", () => {
  test("unauthenticated user is redirected to /login when visiting /home", async ({
    page,
  }) => {
    // Attempt to visit the dashboard without authentication
    await page.goto("/home");

    // The middleware should redirect to /login
    await expect(page).toHaveURL(/\/login/);
  });

  test("public page / (root) is accessible without authentication", async ({
    page,
  }) => {
    await page.goto("/");

    // The page should load successfully without redirect to /login
    // Root page should NOT redirect to login
    await expect(page).not.toHaveURL(/\/login/);

    // Verify the page loaded (check for any visible content)
    await expect(page.locator("body")).toBeVisible();
  });

  test("public page /pricing is accessible without authentication", async ({
    page,
  }) => {
    await page.goto("/pricing");

    // Should stay on /pricing without redirect
    await expect(page).toHaveURL(/\/pricing/);

    // Verify the page loaded with visible content
    await expect(page.locator("body")).toBeVisible();
  });
});
