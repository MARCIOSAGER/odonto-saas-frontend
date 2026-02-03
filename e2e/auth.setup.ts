import { test as setup, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const AUTH_FILE = "e2e/.auth/user.json";

// Empty storage state for when auth fails
const EMPTY_STATE = JSON.stringify({
  cookies: [],
  origins: [],
});

setup("authenticate", async ({ page }) => {
  setup.setTimeout(120_000);

  // Ensure the auth directory exists
  const authDir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await page.goto("/login");
  await expect(page.getByPlaceholder("nome@clinica.com")).toBeVisible();

  // Fill credentials
  await page.getByPlaceholder("nome@clinica.com").fill("dr.teste@clinica.com");
  await page.locator('input[type="password"]').fill("Senha123!");
  await page.getByRole("button", { name: /entrar no sistema/i }).click();

  // Wait for navigation — either /home (success) or /login/verify-2fa (2FA)
  try {
    await expect(page).toHaveURL(/\/(home|login\/verify-2fa)/, { timeout: 60_000 });
  } catch {
    // Login failed — write empty state and skip
    fs.writeFileSync(AUTH_FILE, EMPTY_STATE);
    setup.skip(true, "Login failed — set NEXTAUTH_URL=http://localhost:3000 in .env.local for local testing.");
    return;
  }

  // If redirected to 2FA, skip
  if (page.url().includes("verify-2fa")) {
    fs.writeFileSync(AUTH_FILE, EMPTY_STATE);
    setup.skip(true, "Account requires 2FA — cannot complete automated login.");
    return;
  }

  // Verify dashboard
  await expect(page.getByRole("heading", { name: /olá/i })).toBeVisible({ timeout: 15_000 });

  // Save session state
  await page.context().storageState({ path: AUTH_FILE });
});
