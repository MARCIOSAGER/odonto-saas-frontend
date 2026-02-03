import { test, expect } from "@playwright/test";

test.describe("Appointments Page", () => {
  test("appointments page redirects to login if not authenticated", async ({
    page,
  }) => {
    // Attempt to visit appointments without authentication
    await page.goto("/appointments");

    // The middleware should redirect to /login
    await expect(page).toHaveURL(/\/login/);
  });

  test.skip("appointments list loads after authentication", async ({ page }) => {
    // TODO: Implement authenticated test flow
    // This test requires setting up authentication state (e.g., storageState)
    // Steps to implement:
    //   1. Create a global auth setup that logs in and saves session
    //   2. Use storageState to reuse the authenticated session
    //   3. Navigate to /appointments and verify the appointments page renders
    //   4. Check for heading "Agendamentos"
    //   5. Verify "Novo Agendamento" button is visible
    //   6. Verify calendar or list view is rendered

    await page.goto("/appointments");

    // Verify the appointments page heading
    await expect(
      page.getByRole("heading", { name: /agendamentos/i })
    ).toBeVisible();

    // Verify the "New Appointment" button
    await expect(
      page.getByRole("button", { name: /novo agendamento/i })
    ).toBeVisible();
  });
});
