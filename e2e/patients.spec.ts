import { test, expect } from "@playwright/test";

test.describe("Patients Page", () => {
  test("patients page redirects to login if not authenticated", async ({
    page,
  }) => {
    // Attempt to visit patients without authentication
    await page.goto("/patients");

    // The middleware should redirect to /login
    await expect(page).toHaveURL(/\/login/);
  });

  test.skip("patients list loads after authentication", async ({ page }) => {
    // TODO: Implement authenticated test flow
    // This test requires setting up authentication state (e.g., storageState)
    // Steps to implement:
    //   1. Create a global auth setup that logs in and saves session
    //   2. Use storageState to reuse the authenticated session
    //   3. Navigate to /patients and verify the patient list renders
    //   4. Check for heading "Pacientes" and the search input
    //   5. Verify "Novo Paciente" button is visible

    await page.goto("/patients");

    // Verify the patients page heading
    await expect(
      page.getByRole("heading", { name: /pacientes/i })
    ).toBeVisible();

    // Verify the search input
    await expect(
      page.getByPlaceholder(/buscar paciente/i)
    ).toBeVisible();

    // Verify the "New Patient" button
    await expect(
      page.getByRole("button", { name: /novo paciente/i })
    ).toBeVisible();
  });
});
