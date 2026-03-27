import { test, expect } from "@playwright/test";

const TEST_EMAIL = `test-${Date.now()}@capi.dev`;
const TEST_PASSWORD = "testpass123";

test.describe("Fase 0: Autenticación", () => {
  test("0.1 — Páginas públicas cargan sin auth", async ({ page }) => {
    // Landing
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("impacto");

    // Lista de eventos
    await page.goto("/events");
    await expect(page).toHaveURL("/events");

    // Login y register accesibles
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Iniciar sesión");

    await page.goto("/register");
    await expect(page.locator("h1")).toContainText("Crear cuenta");
  });

  test("0.2 — Dashboard redirige a /login sin auth", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });

  test("0.3 — Dashboard/events redirige a /login sin auth", async ({ page }) => {
    await page.goto("/dashboard/events");
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });

  test("0.4 — Dashboard/volunteers redirige a /login sin auth", async ({ page }) => {
    await page.goto("/dashboard/volunteers");
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });

  test("0.5 — Registro exitoso redirige a dashboard", async ({ page }) => {
    await page.goto("/register");

    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD, { strict: false });
    // Llenar "Confirmar contraseña" (segundo input password)
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill(TEST_PASSWORD);
    await passwordInputs.nth(1).fill(TEST_PASSWORD);

    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("0.6 — Login con credenciales válidas redirige a dashboard", async ({ page }) => {
    // Primero registrar un usuario
    const email = `login-${Date.now()}@capi.dev`;
    await page.goto("/register");
    const passwordInputs = page.locator('input[type="password"]');
    await page.fill('input[type="email"]', email);
    await passwordInputs.nth(0).fill(TEST_PASSWORD);
    await passwordInputs.nth(1).fill(TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard", { timeout: 10000 });

    // Cerrar sesión navegando a login directamente
    await page.goto("/login");

    // Ahora hacer login
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("0.7 — Login con credenciales inválidas muestra error", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[type="email"]', "noexiste@capi.dev");
    await page.fill('input[type="password"]', "wrongpass");
    await page.click('button[type="submit"]');

    // Debe mostrar mensaje de error, no redirigir
    await expect(page.locator(".bg-red-50")).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain("/login");
  });

  test("0.8 — Registro con contraseñas diferentes muestra error", async ({ page }) => {
    await page.goto("/register");

    await page.fill('input[type="email"]', "mismatch@capi.dev");
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill("password1");
    await passwordInputs.nth(1).fill("password2");
    await page.click('button[type="submit"]');

    await expect(page.locator(".bg-red-50")).toContainText("no coinciden");
  });
});
