import { test, expect } from "@playwright/test";

test.describe("Dashboard Home", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home");
  });

  test("renders greeting and subtitle", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /olá/i })).toBeVisible();
    await expect(page.getByText(/sua dashboard/i)).toBeVisible();
  });

  test("shows metric cards", async ({ page }) => {
    await expect(page.getByText("Pacientes Totais")).toBeVisible();
    await expect(page.getByText("Confirmadas Hoje")).toBeVisible();
    await expect(page.getByText("Agendamentos Pendentes")).toBeVisible();
    await expect(page.getByText("Receita do Mês")).toBeVisible();
  });

  test("shows patient flow chart", async ({ page }) => {
    await expect(page.getByText("Fluxo de Pacientes")).toBeVisible();
  });

  test("shows upcoming appointments section", async ({ page }) => {
    const section = page.getByText(/próxima consulta/i).or(page.getByText(/ver todas/i));
    await expect(section.first()).toBeVisible();
  });
});

test.describe("Patients Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patients");
  });

  test("renders page heading and controls", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /pacientes/i })).toBeVisible();
    await expect(page.getByPlaceholder(/buscar/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /novo paciente/i })).toBeVisible();
  });

  test("shows patient table with columns", async ({ page }) => {
    await expect(page.getByText("Nome")).toBeVisible();
    await expect(page.getByText("Telefone")).toBeVisible();
    await expect(page.getByText("Status")).toBeVisible();
  });

  test("new patient modal opens", async ({ page }) => {
    await page.getByRole("button", { name: /novo paciente/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/novo paciente|cadastrar/i).first()).toBeVisible();
  });

  test("search input filters patients", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar/i);
    await searchInput.fill("teste");
    // Wait for debounce
    await page.waitForTimeout(600);
    // Table should still be visible (either with results or empty state)
    await expect(page.locator("table").or(page.getByText(/nenhum/i))).toBeVisible();
  });
});

test.describe("Appointments Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/appointments");
  });

  test("renders page heading and controls", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /agendamentos/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /novo agendamento/i })).toBeVisible();
  });

  test("shows list and calendar view toggles", async ({ page }) => {
    const listBtn = page.getByRole("button", { name: /lista/i });
    const calBtn = page.getByRole("button", { name: /calend[aá]rio/i });
    await expect(listBtn).toBeVisible();
    await expect(calBtn).toBeVisible();
  });

  test("switch to calendar view", async ({ page }) => {
    await page.getByRole("button", { name: /calend[aá]rio/i }).click();
    // Calendar should render (react-big-calendar classes)
    const calendar = page.locator(".rbc-calendar, .rbc-month-view, .rbc-time-view");
    await expect(calendar.first()).toBeVisible({ timeout: 10_000 });
  });

  test("new appointment modal opens", async ({ page }) => {
    await page.getByRole("button", { name: /novo agendamento/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/paciente/i).first()).toBeVisible();
  });
});

test.describe("Dentists Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dentists");
  });

  test("renders page heading and controls", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /dentistas/i })).toBeVisible();
    await expect(page.getByText(/corpo cl[ií]nico/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /novo dentista/i })).toBeVisible();
  });

  test("shows dentist table", async ({ page }) => {
    await expect(page.getByText(/nome profissional/i).or(page.getByText("CRO"))).toBeVisible();
  });

  test("new dentist modal opens", async ({ page }) => {
    await page.getByRole("button", { name: /novo dentista/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/novo dentista/i).first()).toBeVisible();
  });
});

test.describe("Services Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/services");
  });

  test("renders page heading and controls", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /serviços/i })).toBeVisible();
    await expect(page.getByText(/procedimentos e valores/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /novo serviço/i })).toBeVisible();
  });

  test("shows services table", async ({ page }) => {
    await expect(page.getByText("Procedimento")).toBeVisible();
    await expect(page.getByText(/dura[cç][aã]o/i)).toBeVisible();
    await expect(page.getByText(/pre[cç]o/i)).toBeVisible();
  });

  test("new service modal opens", async ({ page }) => {
    await page.getByRole("button", { name: /novo serviço/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/novo serviço/i).first()).toBeVisible();
  });
});

test.describe("Conversations Page", () => {
  test("renders conversation list area", async ({ page }) => {
    await page.goto("/conversations");
    // Should show conversation panel or empty state
    const conversationArea = page.getByText(/suas conversas/i)
      .or(page.getByPlaceholder(/buscar paciente/i))
      .or(page.getByText(/nova conversa/i));
    await expect(conversationArea.first()).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("Reports Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reports");
  });

  test("renders heading and tabs", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /relat[oó]rios/i })).toBeVisible();
  });

  test("shows report tabs", async ({ page }) => {
    await expect(page.getByText("Receita")).toBeVisible();
    await expect(page.getByText("Atendimentos")).toBeVisible();
    await expect(page.getByText("Pacientes")).toBeVisible();
    await expect(page.getByText(/fluxo de caixa/i)).toBeVisible();
  });

  test("revenue tab shows metrics", async ({ page }) => {
    await expect(page.getByText("Receita Total")).toBeVisible();
    await expect(page.getByText("Ticket Médio")).toBeVisible();
  });
});

test.describe("Notifications Page", () => {
  test("renders notifications page", async ({ page }) => {
    await page.goto("/notifications");
    await expect(page.getByRole("heading", { name: /notifica[cç][oõ]es/i })).toBeVisible();
    // Should show notification count or empty state
    const infoText = page.getByText(/notifica[cç][oõ]es não lidas/i)
      .or(page.getByText(/todas.*lidas/i));
    await expect(infoText.first()).toBeVisible();
  });
});
