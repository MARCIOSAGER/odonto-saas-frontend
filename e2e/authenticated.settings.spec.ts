import { test, expect } from "@playwright/test";

test.describe("Settings - Theme", () => {
  test("shows theme selector buttons", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: /configura[cç][oõ]es/i })).toBeVisible();
    await expect(page.getByText(/apar[eê]ncia/i)).toBeVisible();

    // Theme buttons
    await expect(page.getByRole("button", { name: /modo claro/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /modo escuro/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /sistema/i })).toBeVisible();
  });

  test("can switch theme", async ({ page }) => {
    await page.goto("/settings");
    // Click dark mode
    await page.getByRole("button", { name: /modo escuro/i }).click();
    // Verify page renders without error
    await expect(page.locator("body")).toBeVisible();

    // Click light mode
    await page.getByRole("button", { name: /modo claro/i }).click();
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Settings - Clinic", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings/clinic");
  });

  test("renders clinic settings page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /minha cl[ií]nica/i })).toBeVisible();
  });

  test("shows visual identity section", async ({ page }) => {
    await expect(page.getByText(/identidade visual/i)).toBeVisible();
    await expect(page.getByText(/cor prim[aá]ria/i)).toBeVisible();
    await expect(page.getByText(/cor secund[aá]ria/i)).toBeVisible();
  });

  test("shows general information section", async ({ page }) => {
    await expect(page.getByText(/informa[cç][oõ]es gerais/i)).toBeVisible();
    await expect(page.getByText(/nome da cl[ií]nica/i)).toBeVisible();
    await expect(page.getByText("CNPJ")).toBeVisible();
  });

  test("shows logo upload section", async ({ page }) => {
    await expect(page.getByText(/logo da cl[ií]nica/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /alterar logo/i })).toBeVisible();
  });

  test("save button is present", async ({ page }) => {
    await expect(page.getByRole("button", { name: /salvar configura[cç][oõ]es/i })).toBeVisible();
  });
});

test.describe("Settings - Billing", () => {
  test("renders billing page", async ({ page }) => {
    await page.goto("/settings/billing");
    await expect(page.getByRole("heading", { name: /assinatura|faturamento/i })).toBeVisible();
  });

  test("shows plan info", async ({ page }) => {
    await page.goto("/settings/billing");
    // Should show plan card with status
    const planInfo = page.getByText(/plano/i).first();
    await expect(planInfo).toBeVisible();
  });

  test("shows usage section", async ({ page }) => {
    await page.goto("/settings/billing");
    const usage = page.getByText(/uso do plano/i)
      .or(page.getByText(/pacientes/i));
    await expect(usage.first()).toBeVisible();
  });
});

test.describe("Settings - Security", () => {
  test("renders security page", async ({ page }) => {
    await page.goto("/settings/security");
    await expect(page.getByRole("heading", { name: /seguran[cç]a/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /autentica[cç][aã]o de dois fatores/i })).toBeVisible();
  });

  test("shows 2FA setup options", async ({ page }) => {
    await page.goto("/settings/security");
    await expect(page.getByText("WhatsApp")).toBeVisible();
    await expect(page.getByRole("heading", { name: /app autenticador/i })).toBeVisible();
  });
});
