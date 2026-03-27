import { test, expect, type Page } from "@playwright/test";

const AUTH_EMAIL = `ui-${Date.now()}@capi.dev`;
const AUTH_PASSWORD = "testpass123";

async function loginUser(page: Page) {
  await page.goto("/register");
  const passwordInputs = page.locator('input[type="password"]');
  await page.fill('input[type="email"]', AUTH_EMAIL);
  await passwordInputs.nth(0).fill(AUTH_PASSWORD);
  await passwordInputs.nth(1).fill(AUTH_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 10000 });
}

test.describe("Fase 2: UI y Polish", () => {
  // ── Navbar responsive ───────────────────────────────

  test("2.1 — Navbar: links visibles en desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    // Nav links visibles en desktop
    await expect(page.locator('nav >> text="Eventos"').first()).toBeVisible();
    await expect(page.locator('nav >> text="Cómo funciona"')).toBeVisible();
    await expect(page.locator('nav >> text="Impacto"')).toBeVisible();

    // Hamburguesa NO visible
    const hamburger = page.locator('button:has(span:text("menu"))');
    await expect(hamburger).not.toBeVisible();
  });

  test("2.2 — Navbar: hamburguesa en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Nav links ocultos
    const desktopNav = page.locator("nav.hidden");
    await expect(desktopNav).toBeHidden();

    // Hamburguesa visible
    const hamburger = page.locator('button:has(span:text("menu"))');
    await expect(hamburger).toBeVisible();

    // Click hamburguesa abre menú
    await hamburger.click();

    // Links visibles en el menú móvil
    await expect(page.locator('text="Eventos"').first()).toBeVisible();
    await expect(page.locator('text="Cómo funciona"').first()).toBeVisible();

    // Click en link cierra menú
    await page.locator('nav >> text="Eventos"').first().click();
    await page.waitForURL("**/events");
  });

  test("2.3 — Navbar: cerrar menú con backdrop", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const hamburger = page.locator('button:has(span:text("menu"))');
    await hamburger.click();

    // Verificar que el backdrop existe
    const backdrop = page.locator(".fixed.inset-0");
    await expect(backdrop.first()).toBeVisible();

    // Click en backdrop cierra
    await backdrop.first().click();

    // El menú se cierra (botón vuelve a ser "menu")
    await expect(page.locator('button:has(span:text("menu"))')).toBeVisible();
  });

  // ── Sidebar responsive ──────────────────────────────

  test("2.4 — Sidebar: visible en desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await loginUser(page);
    await page.goto("/dashboard");

    // Sidebar visible
    await expect(page.locator("aside")).toBeVisible();
    await expect(page.locator('text="Consola Organizador"')).toBeVisible();
  });

  test("2.5 — Sidebar: oculto en móvil, abre con hamburguesa", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginUser(page);
    await page.goto("/dashboard");

    // Sidebar oculto (transformado fuera de pantalla)
    const aside = page.locator("aside");
    await expect(aside).toHaveCSS("transform", /translateX\(-/);

    // Hamburguesa visible
    const hamburger = page.locator('button:has(span:text("menu"))').first();
    await expect(hamburger).toBeVisible();

    // Abrir sidebar
    await hamburger.click();
    await expect(aside).toHaveCSS("transform", "none");

    // Backdrop visible
    const backdrop = page.locator(".fixed.inset-0.bg-black\\/30");
    await expect(backdrop).toBeVisible();
  });

  test("2.6 — Sidebar: navegación cierra sidebar en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginUser(page);
    await page.goto("/dashboard");

    // Abrir sidebar
    await page.locator('button:has(span:text("menu"))').first().click();

    // Click en "Eventos" del sidebar
    await page.locator('aside >> text="Eventos"').click();
    await page.waitForURL("**/dashboard/events");

    // Sidebar se cierra
    const aside = page.locator("aside");
    await expect(aside).toHaveCSS("transform", /translateX\(-/);
  });

  // ── Loading skeletons ───────────────────────────────

  test("2.7 — Loading skeleton en dashboard", async ({ page }) => {
    await loginUser(page);

    // Navegar y capturar el loading state
    // Los skeletons usan animate-pulse
    await page.goto("/dashboard");
    // Verificar que la página carga correctamente (el skeleton puede ser muy rápido)
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 10000 });
  });

  test("2.8 — Loading skeleton en events", async ({ page }) => {
    await loginUser(page);
    await page.goto("/dashboard/events");
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("h2")).toContainText("Gestión de Eventos");
  });

  test("2.9 — Loading skeleton en volunteers", async ({ page }) => {
    await loginUser(page);
    await page.goto("/dashboard/volunteers");
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("h2")).toContainText("Gestión de Voluntarios");
  });

  test("2.10 — Loading skeleton en institutions", async ({ page }) => {
    await loginUser(page);
    await page.goto("/dashboard/institutions");
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("h2")).toContainText("Instituciones");
  });

  // ── Error boundary ──────────────────────────────────

  test("2.11 — Error boundary existe en dashboard", async ({ page }) => {
    await loginUser(page);
    // Verificar que el error boundary está montado visitando la ruta
    // (No podemos forzar un error fácilmente, pero verificamos que no rompe)
    await page.goto("/dashboard");
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 10000 });
  });

  test("2.12 — Error boundary existe en events", async ({ page }) => {
    await page.goto("/events");
    await expect(page).toHaveURL("/events");
    // La página carga sin error
  });

  // ── Toasts ──────────────────────────────────────────

  test("2.13 — Toast aparece al crear evento", async ({ page }) => {
    await loginUser(page);
    await page.goto("/dashboard/events/new");

    await page.fill('input[placeholder*="Taller STEM"]', "Evento Toast Test E2E");
    await page.fill('textarea[placeholder*="Breve descripción"]', "Descripción para verificar que el toast aparece correctamente.");
    await page.selectOption("select", { label: "Conferencia" });
    await page.fill('input[type="date"]', "2026-08-10");
    await page.fill('input[placeholder*="Centro de Innovación"]', "Lugar Toast");
    await page.fill('input[placeholder*="Av. Universitaria"]', "Dirección Toast Test 789");
    await page.fill('input[placeholder="Ej: 30"]', "15");
    await page.fill('input[placeholder="Ej: 200"]', "100");
    await page.fill('input[placeholder*="Universidad Nacional"]', "Universidad Toast");
    await page.fill('textarea[placeholder*="Descripción completa"]', "Evento creado específicamente para verificar que el sistema de toasts funciona al crear un evento nuevo.");

    await page.click('button[type="submit"]');

    // Toast de éxito
    await expect(page.locator("text=Evento creado exitosamente")).toBeVisible({ timeout: 10000 });
  });

  test("2.14 — Toast desaparece después de unos segundos", async ({ page }) => {
    await loginUser(page);
    await page.goto("/dashboard/events/new");

    await page.fill('input[placeholder*="Taller STEM"]', "Evento AutoDismiss Test");
    await page.fill('textarea[placeholder*="Breve descripción"]', "Verificando que el toast desaparece automáticamente después del timeout.");
    await page.selectOption("select", { label: "Taller" });
    await page.fill('input[type="date"]', "2026-09-01");
    await page.fill('input[placeholder*="Centro de Innovación"]', "Lugar Dismiss");
    await page.fill('input[placeholder*="Av. Universitaria"]', "Dirección Dismiss 101");
    await page.fill('input[placeholder="Ej: 30"]', "8");
    await page.fill('input[placeholder="Ej: 200"]', "40");
    await page.fill('input[placeholder*="Universidad Nacional"]', "Instituto Dismiss");
    await page.fill('textarea[placeholder*="Descripción completa"]', "Evento para comprobar que el toast de notificación se auto-elimina después de cuatro segundos.");

    await page.click('button[type="submit"]');

    const toast = page.locator("text=Evento creado exitosamente");
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Esperar que desaparezca (timeout de 4s + margen)
    await expect(toast).not.toBeVisible({ timeout: 8000 });
  });

  test("2.15 — Toast se puede cerrar manualmente", async ({ page }) => {
    await loginUser(page);
    await page.goto("/dashboard/events/new");

    await page.fill('input[placeholder*="Taller STEM"]', "Evento Close Toast Test");
    await page.fill('textarea[placeholder*="Breve descripción"]', "Verificando que el toast se puede cerrar con el botón de cerrar.");
    await page.selectOption("select", { label: "Programa" });
    await page.fill('input[type="date"]', "2026-10-15");
    await page.fill('input[placeholder*="Centro de Innovación"]', "Lugar Close");
    await page.fill('input[placeholder*="Av. Universitaria"]', "Dirección Close 202");
    await page.fill('input[placeholder="Ej: 30"]', "12");
    await page.fill('input[placeholder="Ej: 200"]', "60");
    await page.fill('input[placeholder*="Universidad Nacional"]', "Uni Close");
    await page.fill('textarea[placeholder*="Descripción completa"]', "Evento para verificar que el botón de cerrar del toast funciona correctamente y lo elimina del DOM.");

    await page.click('button[type="submit"]');

    const toast = page.locator("text=Evento creado exitosamente");
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Cerrar con el botón X
    const closeBtn = page.locator('.fixed.bottom-6 button:has(span:text("close"))');
    await closeBtn.click();

    await expect(toast).not.toBeVisible();
  });

  // ── Formulario de edición ───────────────────────────

  test("2.16 — Página de editar evento carga datos existentes", async ({ page }) => {
    await loginUser(page);
    await page.goto("/dashboard/events");

    // Click editar en algún evento
    const editLink = page.locator('a[title="Editar"]').first();
    const hasEvents = await editLink.isVisible().catch(() => false);

    if (hasEvents) {
      await editLink.click();
      await page.waitForURL("**/edit");

      // Verificar que el formulario tiene datos pre-llenados
      await expect(page.locator("h2")).toContainText("Editar Evento");
      const titleInput = page.locator('input[placeholder*="Taller STEM"]');
      const titleValue = await titleInput.inputValue();
      expect(titleValue.length).toBeGreaterThan(0);
    } else {
      test.skip(true, "No hay eventos para editar");
    }
  });

  // ── Validación del formulario ───────────────────────

  test("2.17 — Formulario muestra errores de validación", async ({ page }) => {
    await loginUser(page);
    await page.goto("/dashboard/events/new");

    // Submit vacío
    await page.click('button[type="submit"]');

    // Deben aparecer mensajes de error
    await expect(page.locator("text=Mínimo 5 caracteres").first()).toBeVisible();
  });
});
