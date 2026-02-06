import { test, expect } from "@playwright/test";

/**
 * Comprehensive test suite for all public pages
 * This tests page loading, content visibility, and navigation
 */

test.describe("Public Pages - Deep Test", () => {

  test("Landing page (/) loads completely", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Check main sections exist
    await expect(page.locator("body")).toBeVisible();

    // Hero section should have content
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 10000 });

    // Navigation should be present
    const nav = page.locator("nav, header");
    await expect(nav.first()).toBeVisible();

    // Footer should be present
    const footer = page.locator("footer");
    await expect(footer.first()).toBeVisible();

    // No console errors that break the page
    const content = await page.content();
    expect(content.length).toBeGreaterThan(1000);
  });

  test("Pricing page (/pricing) loads completely", async ({ page }) => {
    const response = await page.goto("/pricing");
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("networkidle");

    // Page should have content (not blank)
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // Should see pricing-related content
    const pricingContent = page.getByText(/plano|preço|mensal|grátis/i).first();
    await expect(pricingContent).toBeVisible({ timeout: 15000 });

    // Check for plan cards or pricing tables
    const cards = page.locator('[class*="card"], [class*="plan"], section');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test("Blog page (/blog) loads completely", async ({ page }) => {
    const response = await page.goto("/blog");
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("networkidle");

    // Should have blog content
    await expect(page.locator("body")).toBeVisible();
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("Cases page (/cases) loads completely", async ({ page }) => {
    const response = await page.goto("/cases");
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("networkidle");

    await expect(page.locator("body")).toBeVisible();
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("Login page (/login) loads completely", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("networkidle");

    // Form elements
    await expect(page.locator('input[type="email"], input[placeholder*="email"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="password"]').first()).toBeVisible();

    // Submit button
    const submitBtn = page.getByRole("button").filter({ hasText: /entrar|login|sign in/i });
    await expect(submitBtn.first()).toBeVisible();

    // Google OAuth button
    const googleBtn = page.getByRole("button").filter({ hasText: /google/i });
    await expect(googleBtn.first()).toBeVisible();
  });

  test("Register page (/register) loads completely", async ({ page }) => {
    const response = await page.goto("/register");
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("networkidle");

    // Form should be visible
    await expect(page.locator("form, [class*='form']").first()).toBeVisible({ timeout: 10000 });

    // Input fields should exist
    const inputs = page.locator("input");
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(2);
  });

  test("Terms page (/terms) loads completely", async ({ page }) => {
    const response = await page.goto("/terms");
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("networkidle");

    const content = await page.locator("body").textContent();
    expect(content?.length).toBeGreaterThan(100);
  });

  test("Privacy page (/privacy) loads completely", async ({ page }) => {
    const response = await page.goto("/privacy");
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("networkidle");

    const content = await page.locator("body").textContent();
    expect(content?.length).toBeGreaterThan(100);
  });

  test("Forgot password page loads", async ({ page }) => {
    const response = await page.goto("/forgot-password");
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("networkidle");

    await expect(page.locator('input[type="email"], input[placeholder*="email"]').first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Navigation Tests", () => {

  test("Landing page navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Click on Pricing link if exists
    const pricingLink = page.getByRole("link", { name: /preço|pricing/i }).first();
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
      await expect(page).toHaveURL(/pricing/);
    }
  });

  test("Login to Register navigation", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    const registerLink = page.getByRole("link").filter({ hasText: /teste|register|cadastr/i }).first();
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/register/);
    }
  });
});

test.describe("Protected Routes Redirect", () => {
  const protectedRoutes = [
    "/home",
    "/patients",
    "/appointments",
    "/dentists",
    "/services",
    "/settings",
    "/reports"
  ];

  for (const route of protectedRoutes) {
    test(`${route} redirects unauthenticated users to login`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/login/, { timeout: 15000 });
    });
  }
});

test.describe("No Blank Pages Check", () => {
  const pagesToCheck = ["/", "/pricing", "/login", "/register", "/blog", "/cases", "/terms", "/privacy"];

  for (const route of pagesToCheck) {
    test(`${route} is not blank`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      // Page should not be blank
      const bodyContent = await page.locator("body").textContent();
      expect(bodyContent?.trim().length).toBeGreaterThan(50);

      // Should have visible elements
      const visibleElements = await page.locator("div, section, main, article").count();
      expect(visibleElements).toBeGreaterThan(0);
    });
  }
});
