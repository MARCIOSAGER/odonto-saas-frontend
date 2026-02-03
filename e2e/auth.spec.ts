import { test, expect } from "@playwright/test";

test.describe("Authentication - Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("login page loads and shows the login form", async ({ page }) => {
    // Verify the page title / heading
    await expect(page.getByRole("heading", { name: /bem-vindo de volta/i })).toBeVisible();

    // Verify the subtitle text
    await expect(
      page.getByText(/entre com suas credenciais para acessar o painel/i)
    ).toBeVisible();

    // Verify email input exists with correct placeholder
    const emailInput = page.getByPlaceholder("nome@clinica.com");
    await expect(emailInput).toBeVisible();

    // Verify password input exists
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    // Verify submit button with correct text
    const submitButton = page.getByRole("button", { name: /entrar no sistema/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();

    // Verify Google sign-in button
    const googleButton = page.getByRole("button", { name: /entrar com google/i });
    await expect(googleButton).toBeVisible();

    // Verify the "or continue with" separator
    await expect(page.getByText(/ou continue com/i)).toBeVisible();
  });

  test("login with invalid credentials shows error message", async ({ page }) => {
    // Fill in the email field
    await page.getByPlaceholder("nome@clinica.com").fill("usuario-invalido@teste.com");

    // Fill in the password field
    await page.locator('input[type="password"]').fill("senhaErrada123");

    // Click the submit button
    await page.getByRole("button", { name: /entrar no sistema/i }).click();

    // Wait for the error message to appear (either inline error or toast)
    const errorMessage = page.locator(".bg-destructive\\/10");
    const toastError = page.locator('[data-sonner-toast][data-type="error"]');

    // At least one error indicator should appear
    await expect(errorMessage.or(toastError).first()).toBeVisible({ timeout: 10_000 });
  });

  test("forgot password link navigates to /forgot-password", async ({ page }) => {
    // Click the "Esqueceu a senha?" link
    const forgotLink = page.getByRole("link", { name: /esqueceu a senha/i });
    await expect(forgotLink).toBeVisible();
    await forgotLink.click();

    // Verify navigation to /forgot-password
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("register link navigates to /register", async ({ page }) => {
    // Click the "Comecar teste gratis" link
    const registerLink = page.getByRole("link", { name: /come[cç]ar teste gr[aá]tis/i });
    await expect(registerLink).toBeVisible();
    await registerLink.click();

    // Verify navigation to /register
    await expect(page).toHaveURL(/\/register/);
  });
});
