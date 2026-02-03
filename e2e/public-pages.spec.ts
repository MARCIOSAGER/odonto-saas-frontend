import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero section renders", async ({ page }) => {
    // Should have some heading or hero text
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("has CTA buttons", async ({ page }) => {
    // Should have a "Começar grátis" or "Começar teste grátis" CTA link
    const ctaLink = page.getByRole("link", { name: /come[cç].*gr[aá]tis/i }).first();
    await expect(ctaLink).toBeVisible();
  });

  test("navigation links exist", async ({ page }) => {
    // Should have navigation or footer links
    const body = page.locator("body");
    await expect(body).toBeVisible();
    // Check basic page structure
    const links = await page.getByRole("link").count();
    expect(links).toBeGreaterThan(0);
  });
});

test.describe("Pricing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("displays pricing cards", async ({ page }) => {
    // Should show plan cards or pricing content
    await expect(page.locator("body")).toBeVisible();

    // Look for pricing-related text
    const pricingText = page.getByText(/plano|mensal|anual|grátis|R\$/i).first();
    await expect(pricingText).toBeVisible();
  });

  test("has signup/action buttons", async ({ page }) => {
    // Each plan should have a CTA button
    const buttons = page.getByRole("button").or(page.getByRole("link"));
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Terms & Privacy Pages", () => {
  test("terms page has content", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("body")).toBeVisible();
    const textContent = await page.locator("body").textContent();
    expect(textContent?.length).toBeGreaterThan(50);
  });

  test("privacy page has content", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("body")).toBeVisible();
    const textContent = await page.locator("body").textContent();
    expect(textContent?.length).toBeGreaterThan(50);
  });
});
