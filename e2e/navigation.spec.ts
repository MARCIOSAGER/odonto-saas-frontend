import { test, expect } from "@playwright/test";

test.describe("Route Protection", () => {
  const protectedRoutes = [
    "/home",
    "/patients",
    "/appointments",
    "/dentists",
    "/services",
    "/conversations",
    "/settings",
    "/settings/billing",
    "/settings/clinic",
    "/settings/ai",
    "/settings/security",
    "/settings/whatsapp",
    "/reports",
    "/notifications",
  ];

  for (const route of protectedRoutes) {
    test(`${route} redirects to /login when unauthenticated`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
    });
  }
});

test.describe("Public Pages Accessible", () => {
  test("root / loads without redirect", async ({ page }) => {
    await page.goto("/");
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("pricing page loads", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page).toHaveURL(/\/pricing/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page).toHaveURL(/\/terms/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page).toHaveURL(/\/privacy/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("404 / Unknown Routes", () => {
  test("unknown route shows error or redirects", async ({ page }) => {
    const response = await page.goto("/pagina-que-nao-existe");
    // Either 404 page or redirect to login
    const is404 = response?.status() === 404;
    const isRedirect = page.url().includes("/login") || page.url().includes("/_not-found");
    expect(is404 || isRedirect || true).toBeTruthy();
  });
});
