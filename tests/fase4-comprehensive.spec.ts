import { test, expect, type Page } from "@playwright/test";

const AUTH_EMAIL = `comprehensive-${Date.now()}@capi.dev`;
const AUTH_PASSWORD = "testpass123";
const AUTH_FULLNAME = "Test Comprehensivo";

async function loginUser(page: Page) {
  await page.goto("/register");
  // Fill full name (new field)
  await page.fill('input[placeholder="Tu nombre completo"]', AUTH_FULLNAME);
  await page.fill('input[type="email"]', AUTH_EMAIL);
  const passwordInputs = page.locator('input[type="password"]');
  await passwordInputs.nth(0).fill(AUTH_PASSWORD);
  await passwordInputs.nth(1).fill(AUTH_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 10000 });
}

test.describe("Fase 4: Comprehensive Tests", () => {
  test.describe.configure({ mode: "serial" });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await loginUser(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  // ── Edit event + agenda ──────────────────────────────

  test("4.1 — Create event with agenda", async () => {
    await page.goto("/dashboard/events/new");
    await expect(page.locator("h2")).toContainText("Crear Nuevo Evento");

    // Fill basic info
    await page.fill('input[placeholder*="Taller STEM"]', "Evento con Agenda E2E Test");
    await page.fill('textarea[placeholder*="Breve descripción"]', "Evento de prueba con agenda para tests E2E comprehensivos.");
    await page.selectOption("select", { label: "Taller" });
    await page.fill('input[type="date"]', "2026-08-15");
    await page.fill('input[placeholder*="Centro de Innovación"]', "Centro Test Agenda");
    await page.fill('input[placeholder*="Av. Universitaria"]', "Dirección Test Agenda 789, Lima");
    await page.fill('input[placeholder="Ej: 30"]', "15");
    await page.fill('input[placeholder="Ej: 200"]', "100");
    await page.fill('input[placeholder*="Universidad Nacional"]', "Universidad Test Agenda");
    await page.fill('input[placeholder*="Google, Microsoft"]', "TestSponsor");
    await page.fill('textarea[placeholder*="Descripción completa"]', "Descripción detallada del evento con agenda para las pruebas comprehensivas automatizadas.");

    // Add agenda item
    const addAgendaBtn = page.locator("button", { hasText: "Agregar actividad" });
    await addAgendaBtn.scrollIntoViewIfNeeded();
    await addAgendaBtn.click();

    // Fill agenda item
    await page.fill('input[placeholder="Ej: 09:00 AM"]', "10:00 AM");
    await page.fill('input[placeholder="Ej: Registro de participantes"]', "Bienvenida E2E");
    await page.fill('input[placeholder="Opcional"]', "Apertura del evento de test");

    // Publish
    const publishBtn = page.locator("text=Publicar Evento");
    await publishBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await publishBtn.click();

    await expect(page.locator("text=¡Evento creado con éxito!")).toBeVisible({ timeout: 15000 });
    await page.waitForURL("**/dashboard/events", { timeout: 15000 });
  });

  test("4.2 — Edit event preserves agenda", async () => {
    await page.goto("/dashboard/events");

    const row = page.locator("tr", { hasText: "Evento con Agenda E2E Test" });
    await row.locator('a[title="Editar"]').click();
    await page.waitForURL("**/edit");

    // Verify agenda is pre-loaded
    await expect(page.locator('input[placeholder="Ej: 09:00 AM"]')).toHaveValue("10:00 AM");
    await expect(page.locator('input[placeholder="Ej: Registro de participantes"]')).toHaveValue("Bienvenida E2E");

    // Save without changes
    const saveBtn = page.locator('button[type="submit"]');
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();
    await expect(page.locator("text=¡Evento actualizado!")).toBeVisible({ timeout: 15000 });
  });

  // ── Analytics page ──────────────────────────────────

  test("4.3 — Analytics page renders with real stats", async () => {
    await page.goto("/dashboard/analytics");
    await expect(page.locator("h2")).toContainText("Impacto Social");

    // Stats cards should render
    const cards = page.locator(".bg-white.p-6.rounded-xl");
    await expect(cards.first()).toBeVisible();

    // Verify KPIs section renders
    await expect(page.locator("text=KPIs del Producto")).toBeVisible();

    // Verify impact metrics section renders
    await expect(page.locator("text=Métricas de Impacto Global")).toBeVisible();
  });

  // ── Error boundaries ─────────────────────────────────

  test("4.4 — Invalid event route shows not found", async () => {
    await page.goto("/events/does-not-exist-xyz-99999");
    // Should show 404 or error
    const notFound = page.locator("text=404").or(page.locator("text=Not Found")).or(page.locator("text=no se encontró"));
    await expect(notFound).toBeVisible({ timeout: 5000 });
  });

  // ── Duplicate signup ────────────────────────────────

  test("4.5 — Duplicate signup shows error", async () => {
    // First go to a public event page
    await page.goto("/events");

    const eventLink = page.locator("a[href^='/events/']").first();
    const isVisible = await eventLink.isVisible().catch(() => false);

    if (!isVisible) {
      test.skip(true, "No events available for signup test");
      return;
    }

    await eventLink.click();
    await page.waitForURL("**/events/**");

    // Fill signup form
    const signupForm = page.locator("text=Postularme como Voluntario").first();
    const hasForm = await signupForm.isVisible().catch(() => false);

    if (!hasForm) {
      test.skip(true, "No signup form visible");
      return;
    }

    const testEmail = `dup-${Date.now()}@test.com`;

    // First signup
    await page.fill('input[placeholder="Tu nombre completo"]', "Dup Test User");
    await page.fill('input[placeholder="tu@email.com"]', testEmail);
    await page.click("button:has-text('Enviar Postulación')");
    await expect(page.locator("text=¡Postulación enviada!")).toBeVisible({ timeout: 10000 });

    // Reload page for second attempt
    await page.reload();

    // Second signup with same email
    await page.fill('input[placeholder="Tu nombre completo"]', "Dup Test User");
    await page.fill('input[placeholder="tu@email.com"]', testEmail);
    await page.click("button:has-text('Enviar Postulación')");

    // Should show error about already being signed up
    await expect(page.locator("text=Ya estás inscrito")).toBeVisible({ timeout: 10000 });
  });

  // ── Logout flow ──────────────────────────────────────

  test("4.6 — Logout redirects and protects routes", async () => {
    await page.goto("/dashboard");
    await expect(page.locator("h2")).toContainText("Dashboard");

    // Click logout button
    const logoutBtn = page.locator('button[title="Cerrar sesión"]');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Should redirect to home
    await page.waitForURL("/", { timeout: 10000 });

    // Dashboard should now redirect to login
    await page.goto("/dashboard");
    await page.waitForURL("**/login", { timeout: 10000 });
    expect(page.url()).toContain("/login");
  });
});
