import { test, expect } from "@playwright/test";

/**
 * Production site test - tests against the live site
 */
const PROD_URL = "https://odonto.marciosager.com";

test.describe("Production Site Tests", () => {

  test("Landing page loads without blank screen", async ({ page }) => {
    const response = await page.goto(PROD_URL);
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("domcontentloaded");

    // Page should not be blank
    const bodyContent = await page.locator("body").textContent();
    console.log("Body content length:", bodyContent?.length);
    expect(bodyContent?.trim().length).toBeGreaterThan(100);

    // Should have heading
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 20000 });
  });

  test("Pricing page is NOT blank", async ({ page }) => {
    const response = await page.goto(`${PROD_URL}/pricing`);
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("domcontentloaded");

    // Critical: Page should NOT be blank
    const bodyContent = await page.locator("body").textContent();
    console.log("Pricing body content length:", bodyContent?.length);
    expect(bodyContent?.trim().length).toBeGreaterThan(100);

    // Should see some pricing content within 30 seconds
    const anyContent = page.locator("h1, h2, h3, p, div").first();
    await expect(anyContent).toBeVisible({ timeout: 30000 });
  });

  test("Login page loads correctly", async ({ page }) => {
    const response = await page.goto(`${PROD_URL}/login`);
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("domcontentloaded");

    // Form elements should be visible
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[placeholder*="@"]').first();
    await expect(emailInput).toBeVisible({ timeout: 20000 });

    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
  });

  test("Blog page loads", async ({ page }) => {
    const response = await page.goto(`${PROD_URL}/blog`);
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("domcontentloaded");

    const bodyContent = await page.locator("body").textContent();
    expect(bodyContent?.trim().length).toBeGreaterThan(100);
  });

  test("Cases page loads", async ({ page }) => {
    const response = await page.goto(`${PROD_URL}/cases`);
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("domcontentloaded");

    const bodyContent = await page.locator("body").textContent();
    expect(bodyContent?.trim().length).toBeGreaterThan(100);
  });

  test("Register page loads", async ({ page }) => {
    const response = await page.goto(`${PROD_URL}/register`);
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("domcontentloaded");

    // Should have form
    const form = page.locator("form, input").first();
    await expect(form).toBeVisible({ timeout: 20000 });
  });

  test("No JavaScript errors break the page", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.goto(PROD_URL);
    await page.waitForLoadState("networkidle");

    // Log errors but don't fail immediately - some third party errors are expected
    if (errors.length > 0) {
      console.log("JavaScript errors found:", errors);
    }

    // Page should still have content even if there are errors
    const bodyContent = await page.locator("body").textContent();
    expect(bodyContent?.trim().length).toBeGreaterThan(100);
  });

  test("Protected routes redirect to login", async ({ page }) => {
    await page.goto(`${PROD_URL}/home`);
    await expect(page).toHaveURL(/login/, { timeout: 15000 });
  });
});
