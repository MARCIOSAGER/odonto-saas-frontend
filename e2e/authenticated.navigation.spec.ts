import { test, expect } from "@playwright/test";

test.describe("Sidebar Navigation", () => {
  test("sidebar renders with main navigation links", async ({ page }) => {
    await page.goto("/home");
    // Sidebar should show navigation items
    const sidebar = page.locator("nav, aside").first();
    await expect(sidebar).toBeVisible();

    // Key nav items should be present
    await expect(page.getByRole("link", { name: /in[ií]cio|home|dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /pacientes/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /agendamentos/i }).first()).toBeVisible();
  });

  test("navigate from home to patients", async ({ page }) => {
    await page.goto("/home");
    await page.getByRole("link", { name: /pacientes/i }).first().click();
    await expect(page).toHaveURL(/\/patients/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /pacientes/i })).toBeVisible();
  });

  test("navigate from home to appointments", async ({ page }) => {
    await page.goto("/home");
    await page.getByRole("link", { name: /agendamentos/i }).first().click();
    await expect(page).toHaveURL(/\/appointments/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /agendamentos/i })).toBeVisible();
  });

  test("navigate from home to dentists", async ({ page }) => {
    await page.goto("/home");
    await page.getByRole("link", { name: /dentistas/i }).first().click();
    await expect(page).toHaveURL(/\/dentists/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /dentistas/i })).toBeVisible();
  });

  test("navigate from home to services", async ({ page }) => {
    await page.goto("/home");
    await page.getByRole("link", { name: /servi[cç]os/i }).first().click();
    await expect(page).toHaveURL(/\/services/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /servi[cç]os/i })).toBeVisible();
  });

  test("navigate from home to reports", async ({ page }) => {
    await page.goto("/home");
    await page.getByRole("link", { name: /relat[oó]rios/i }).first().click();
    await expect(page).toHaveURL(/\/reports/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /relat[oó]rios/i })).toBeVisible();
  });

  test("navigate to settings", async ({ page }) => {
    await page.goto("/home");
    await page.getByRole("link", { name: /configura[cç][oõ]es/i }).first().click();
    await expect(page).toHaveURL(/\/settings/, { timeout: 15_000 });
  });
});

test.describe("Login Flow with Credentials", () => {
  test("full login and redirect to dashboard", async ({ browser }) => {
    // Use a fresh context (no saved auth)
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("/login");
    await page.getByPlaceholder("nome@clinica.com").fill("dr.teste@clinica.com");
    await page.locator('input[type="password"]').fill("Senha123!");
    await page.getByRole("button", { name: /entrar no sistema/i }).click();

    // Should redirect to home
    await expect(page).toHaveURL(/\/home/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { name: /olá/i })).toBeVisible();

    await context.close();
  });
});
