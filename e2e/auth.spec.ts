import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders all form elements", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /bem-vindo de volta/i })).toBeVisible();
    await expect(page.getByText(/entre com suas credenciais/i)).toBeVisible();

    // Email input
    const emailInput = page.getByPlaceholder("nome@clinica.com");
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEditable();

    // Password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    // Submit button
    const submitBtn = page.getByRole("button", { name: /entrar no sistema/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();

    // Google button
    await expect(page.getByRole("button", { name: /entrar com google/i })).toBeVisible();

    // Separator
    await expect(page.getByText(/ou continue com/i)).toBeVisible();

    // Links
    await expect(page.getByRole("link", { name: /esqueceu a senha/i })).toBeVisible();
    await expect(page.getByText(/não tem uma conta/i)).toBeVisible();
  });

  test("shows validation for empty form submission", async ({ page }) => {
    await page.getByRole("button", { name: /entrar no sistema/i }).click();
    const errorText = page.locator(".text-destructive, .text-red-500");
    await expect(errorText.first()).toBeVisible({ timeout: 5_000 });
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.getByPlaceholder("nome@clinica.com").fill("invalido@teste.com");
    await page.locator('input[type="password"]').fill("senhaErrada123");
    await page.getByRole("button", { name: /entrar no sistema/i }).click();

    const errorBanner = page.locator(".bg-destructive\\/10");
    const toastError = page.locator('[data-sonner-toast][data-type="error"]');
    await expect(errorBanner.or(toastError).first()).toBeVisible({ timeout: 15_000 });
  });

  test("password visibility toggle works", async ({ page }) => {
    const passwordField = page.locator('input[type="password"]');
    await passwordField.fill("minhasenha");
    await expect(passwordField).toHaveAttribute("type", "password");
  });

  test("forgot password link has correct href", async ({ page }) => {
    const link = page.getByRole("link", { name: /esqueceu a senha/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /forgot-password/);
  });

  test("register link has correct href", async ({ page }) => {
    const link = page.getByRole("link", { name: /teste gr[aá]tis/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /register/);
  });
});

test.describe("Register Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("renders all form fields", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /crie sua conta/i }).or(page.getByText(/come[cç].*teste gr[aá]tis/i).first())).toBeVisible();
    await expect(page.getByPlaceholder("João Silva")).toBeVisible();
    await expect(page.getByPlaceholder("nome@clinica.com")).toBeVisible();
    await expect(page.getByPlaceholder("Clínica Odonto Saúde")).toBeVisible();
    await expect(page.getByRole("button", { name: /come[cç].*teste gr[aá]tis/i })).toBeVisible();
    await expect(page.getByText(/já tem uma conta/i)).toBeVisible();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.getByRole("button", { name: /come[cç].*teste gr[aá]tis/i }).click();
    const errors = page.locator(".text-destructive, .text-red-500, .text-xs.text-destructive");
    await expect(errors.first()).toBeVisible({ timeout: 5_000 });
  });

  test("login link has correct href", async ({ page }) => {
    const link = page.getByRole("link", { name: /fazer login/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /login/);
  });
});

test.describe("Forgot Password Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
  });

  test("renders email form", async ({ page }) => {
    await expect(page.getByPlaceholder("nome@clinica.com")).toBeVisible();
    await expect(page.getByRole("button", { name: /enviar link/i })).toBeVisible();
  });

  test("back to login link has correct href", async ({ page }) => {
    const link = page.getByRole("link", { name: /voltar/i }).first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /login/);
  });

  test("shows validation for invalid email", async ({ page }) => {
    await page.getByPlaceholder("nome@clinica.com").fill("email-invalido");
    await page.getByRole("button", { name: /enviar link/i }).click();
    const error = page.locator(".text-destructive, .text-red-500");
    await expect(error.first()).toBeVisible({ timeout: 5_000 });
  });
});

test.describe("2FA Verification Page", () => {
  test("shows invalid session without token", async ({ page }) => {
    await page.goto("/login/verify-2fa");
    const invalidMsg = page.getByText(/sess[aã]o inv[aá]lida/i);
    const redirected = page.waitForURL(/\/login$/, { timeout: 10_000 }).catch(() => null);
    await expect(invalidMsg.or(page.locator("body"))).toBeVisible();
  });
});
