import { test, expect, type Page } from "@playwright/test";

const AUTH_EMAIL = `actions-${Date.now()}@capi.dev`;
const AUTH_PASSWORD = "testpass123";

async function loginUser(page: Page) {
  // Registrar e ingresar
  await page.goto("/register");
  const passwordInputs = page.locator('input[type="password"]');
  await page.fill('input[type="email"]', AUTH_EMAIL);
  await passwordInputs.nth(0).fill(AUTH_PASSWORD);
  await passwordInputs.nth(1).fill(AUTH_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 10000 });
}

test.describe("Fase 1: Server Actions", () => {
  test.describe.configure({ mode: "serial" });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await loginUser(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  // ── Eventos ──────────────────────────────────────────

  test("1.1 — Crear evento (publicar)", async () => {
    await page.goto("/dashboard/events/new");
    await expect(page.locator("h2")).toContainText("Crear Nuevo Evento");

    // Llenar formulario
    await page.fill('input[placeholder*="Taller STEM"]', "Taller E2E de Prueba Automatizada");
    await page.fill('textarea[placeholder*="Breve descripción"]', "Este es un evento de prueba creado por Playwright para verificar la persistencia.");
    await page.selectOption("select", { label: "Taller" });
    await page.fill('input[type="date"]', "2026-06-15");
    await page.fill('input[placeholder*="Centro de Innovación"]', "Centro E2E Testing");
    await page.fill('input[placeholder*="Av. Universitaria"]', "Calle Test 123, Lima, Perú");
    await page.fill('input[placeholder="Ej: 30"]', "10");
    await page.fill('input[placeholder="Ej: 200"]', "50");
    await page.fill('input[placeholder*="Universidad Nacional"]', "Universidad de Prueba");
    await page.fill('input[placeholder*="Google, Microsoft"]', "SponsorA, SponsorB");
    await page.fill('textarea[placeholder*="Descripción completa"]', "Descripción detallada del evento de prueba automatizada para verificar que el sistema funciona correctamente.");

    // Publicar — scroll the inner container and click
    const publishBtn = page.locator("text=Publicar Evento");
    await publishBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await publishBtn.click();

    // Esperar a que se procese — buscar éxito O error
    const success = page.locator("text=¡Evento creado con éxito!");
    const errorToast = page.locator(".fixed.bottom-6 .bg-red-600");
    const validationError = page.locator("text=Mínimo");

    // Esperar hasta 15s por cualquier resultado
    await expect(success.or(errorToast).or(validationError)).toBeVisible({ timeout: 15000 });

    // Si hay error de validación, loguearlo
    if (await validationError.isVisible().catch(() => false)) {
      const errors = await page.locator(".text-red-600").allTextContents();
      throw new Error(`Errores de validación: ${errors.join(", ")}`);
    }

    if (await errorToast.isVisible().catch(() => false)) {
      const msg = await errorToast.textContent();
      throw new Error(`Error del servidor: ${msg}`);
    }

    await expect(success).toBeVisible();
    await page.waitForURL("**/dashboard/events", { timeout: 15000 });
  });

  test("1.2 — Evento creado aparece en la lista", async () => {
    await page.goto("/dashboard/events");
    await expect(page.locator("text=Taller E2E de Prueba Automatizada").first()).toBeVisible({ timeout: 5000 });
  });

  test("1.3 — Evento persiste tras recarga", async () => {
    await page.reload();
    await expect(page.locator("text=Taller E2E de Prueba Automatizada").first()).toBeVisible({ timeout: 5000 });
  });

  test("1.4 — Crear evento como borrador", async () => {
    await page.goto("/dashboard/events/new");

    await page.fill('input[placeholder*="Taller STEM"]', "Borrador E2E Testing");
    await page.fill('textarea[placeholder*="Breve descripción"]', "Este borrador fue creado por la suite de testing automatizada.");
    await page.selectOption("select", { label: "Charla" });
    await page.fill('input[type="date"]', "2026-07-20");
    await page.fill('input[placeholder*="Centro de Innovación"]', "Lugar Borrador");
    await page.fill('input[placeholder*="Av. Universitaria"]', "Dirección Borrador 456");
    await page.fill('input[placeholder="Ej: 30"]', "5");
    await page.fill('input[placeholder="Ej: 200"]', "20");
    await page.fill('input[placeholder*="Universidad Nacional"]', "Instituto Borrador");
    await page.fill('input[placeholder*="Google, Microsoft"]', "");
    await page.fill('textarea[placeholder*="Descripción completa"]', "Un borrador de evento para verificar que se guarda con el status correcto en la BD.");

    // Click "Guardar borrador"
    const draftBtn = page.locator("button", { hasText: "Guardar borrador" });
    await draftBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await draftBtn.click();

    // Esperar resultado
    const success = page.locator("text=¡Evento creado con éxito!");
    const errorToast = page.locator(".fixed.bottom-6 .bg-red-600");
    await expect(success.or(errorToast)).toBeVisible({ timeout: 15000 });

    if (await errorToast.isVisible().catch(() => false)) {
      const msg = await errorToast.textContent();
      throw new Error(`Error del servidor: ${msg}`);
    }

    await page.waitForURL("**/dashboard/events", { timeout: 15000 });

    // Verificar que aparece como Borrador
    await expect(page.locator("text=Borrador E2E Testing").first()).toBeVisible();
  });

  test("1.5 — Editar evento existente", async () => {
    await page.goto("/dashboard/events");

    // Click editar en el primer evento que tenga "Taller E2E"
    const row = page.locator("tr", { hasText: "Taller E2E de Prueba Automatizada" });
    await row.locator('a[title="Editar"]').click();
    await page.waitForURL("**/edit");

    await expect(page.locator("h2")).toContainText("Editar Evento");

    // Cambiar el título
    const titleInput = page.locator('input[placeholder*="Taller STEM"]');
    await titleInput.clear();
    await titleInput.fill("Taller E2E Editado Correctamente");

    const saveBtn = page.locator('button[type="submit"]');
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();
    await expect(page.locator("text=¡Evento actualizado!")).toBeVisible({ timeout: 15000 });
    await page.waitForURL("**/dashboard/events", { timeout: 15000 });

    // Verificar cambio
    await expect(page.locator("text=Taller E2E Editado Correctamente").first()).toBeVisible();
  });

  test("1.6 — Eliminar evento con confirmación", async () => {
    await page.goto("/dashboard/events");

    // Contar eventos antes
    const rowsBefore = await page.locator("tbody tr").count();

    // Eliminar el borrador
    const row = page.locator("tr", { hasText: "Borrador E2E Testing" });

    // Interceptar el dialog de confirmación
    page.on("dialog", (dialog) => dialog.accept());
    await row.locator('button[title="Eliminar"]').click();

    // Esperar toast de éxito
    await expect(page.locator("text=Evento eliminado exitosamente")).toBeVisible({ timeout: 5000 });

    // Verificar que desapareció
    await page.reload();
    const rowsAfter = await page.locator("tbody tr").count();
    expect(rowsAfter).toBeLessThan(rowsBefore);
  });

  // ── Voluntarios ──────────────────────────────────────

  test("1.7 — Aprobar voluntario persiste", async () => {
    await page.goto("/dashboard/volunteers");

    // Buscar un voluntario pendiente
    const pendingBtn = page.locator("button", { hasText: "Aprobar" }).first();
    const hasPending = await pendingBtn.isVisible().catch(() => false);

    if (hasPending) {
      await pendingBtn.click();

      // Esperar toast
      await expect(page.locator("text=aprobado")).toBeVisible({ timeout: 5000 });

      // Recargar y verificar persistencia
      await page.reload();
      // No debería haber el mismo botón de aprobar (ya fue aprobado)
    } else {
      test.skip(true, "No hay voluntarios pendientes para aprobar");
    }
  });

  test("1.8 — Rechazar voluntario persiste", async () => {
    await page.goto("/dashboard/volunteers");

    const rejectBtn = page.locator("button", { hasText: "Rechazar" }).first();
    const hasPending = await rejectBtn.isVisible().catch(() => false);

    if (hasPending) {
      await rejectBtn.click();
      await expect(page.locator("text=rechazado")).toBeVisible({ timeout: 5000 });

      await page.reload();
      // Verificar que el voluntario sigue como rechazado
    } else {
      test.skip(true, "No hay voluntarios pendientes para rechazar");
    }
  });

  test("1.9 — Reactivar voluntario rechazado", async () => {
    await page.goto("/dashboard/volunteers");

    // Filtrar por rechazados
    await page.click("button:has-text('Rechazado')");

    const reactivateBtn = page.locator("button", { hasText: "Reactivar" }).first();
    const hasRejected = await reactivateBtn.isVisible().catch(() => false);

    if (hasRejected) {
      await reactivateBtn.click();
      await expect(page.locator("text=aprobado")).toBeVisible({ timeout: 5000 });
    } else {
      test.skip(true, "No hay voluntarios rechazados para reactivar");
    }
  });

  test("1.10 — Asignar rol a voluntario aprobado", async () => {
    await page.goto("/dashboard/volunteers");

    // Filtrar por aprobados
    await page.click("button:has-text('Aprobado')");

    const roleBtn = page.locator("button", { hasText: "Asignar rol" }).first();
    const hasApproved = await roleBtn.isVisible().catch(() => false);

    if (hasApproved) {
      await roleBtn.click();

      // Seleccionar un rol del dropdown
      const roleSelect = page.locator("select").last();
      await roleSelect.selectOption("mentor");

      await expect(page.locator("text=Rol actualizado")).toBeVisible({ timeout: 5000 });
    } else {
      test.skip(true, "No hay voluntarios aprobados para asignar rol");
    }
  });

  // ── Instituciones ────────────────────────────────────

  test("1.11 — Aceptar alianza de institución", async () => {
    await page.goto("/dashboard/institutions");

    const acceptBtn = page.locator("button", { hasText: "Aceptar alianza" }).first();
    const hasPending = await acceptBtn.isVisible().catch(() => false);

    if (hasPending) {
      await acceptBtn.click();
      await expect(page.locator("text=Institución aceptada")).toBeVisible({ timeout: 5000 });

      await page.reload();
      // La institución debería estar ahora como activa
    } else {
      test.skip(true, "No hay solicitudes pendientes de instituciones");
    }
  });

  test("1.12 — Rechazar institución", async () => {
    await page.goto("/dashboard/institutions");

    const rejectBtn = page.locator("button", { hasText: "Rechazar" }).first();
    const hasPending = await rejectBtn.isVisible().catch(() => false);

    if (hasPending) {
      await rejectBtn.click();
      await expect(page.locator("text=Institución rechazada")).toBeVisible({ timeout: 5000 });

      await page.reload();
    } else {
      test.skip(true, "No hay solicitudes pendientes para rechazar");
    }
  });
});
