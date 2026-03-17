import { test, expect } from "@playwright/test";
import { injectSession } from "./helpers";

test.describe("Navigation", () => {
  test("header links navigate correctly", async ({ page }) => {
    await page.goto("/es");

    // Click "Explorar" in the header
    await page.locator("header").getByRole("link", { name: "Explorar" }).click();
    await page.waitForURL("**/Explorar", { timeout: 5000 });

    // Click "Inicio" in the header
    await page.locator("header").getByRole("link", { name: "Inicio" }).click();
    await page.waitForURL("**/es", { timeout: 5000 });
  });

  test("header search navigates to Explorar with query", async ({ page }) => {
    await page.goto("/es");
    const searchInput = page.locator("header").getByPlaceholder("Buscar recetas...");
    await searchInput.fill("pollo");
    await searchInput.press("Enter");
    await page.waitForURL("**/Explorar?search=pollo", { timeout: 5000 });
  });

  test("user menu shows login/register when not authenticated", async ({ page }) => {
    await page.goto("/es");
    // Open user dropdown in header
    await page.locator("header").getByRole("button", { name: /menú de usuario/i }).click();
    await expect(page.getByText("Login")).toBeVisible({ timeout: 3000 });
    await expect(page.getByText("Register")).toBeVisible();
  });

  test("user menu shows profile/logout when authenticated", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es");
    await page.locator("header").getByRole("button", { name: /menú de usuario/i }).click();
    await expect(page.getByText("Mi perfil")).toBeVisible({ timeout: 3000 });
    await expect(page.getByText("Cerrar sesión")).toBeVisible();
  });

  test("saved recipes button redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/es");
    await page.locator("header").getByRole("button", { name: /recetas guardadas/i }).click();
    await page.waitForURL("**/login**", { timeout: 5000 });
  });

  test("saved recipes button navigates to guardados when authenticated", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es");
    await page.locator("header").getByRole("button", { name: /recetas guardadas/i }).click();
    await page.waitForURL("**/guardados", { timeout: 5000 });
  });

  test("shopping list link navigates correctly", async ({ page }) => {
    await page.goto("/es");
    await page.locator("header").getByRole("link", { name: /lista de compras/i }).click();
    await page.waitForURL("**/lista-compras", { timeout: 5000 });
  });

  test("create recipe button appears only when authenticated", async ({ page }) => {
    // Not authenticated - should not show create button in header
    await page.goto("/es");
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: /crear receta/i })).not.toBeVisible();

    // Authenticated - should show create button
    await injectSession(page);
    await page.goto("/es");
    await expect(page.locator("header").getByRole("link", { name: /crear receta/i })).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Internationalization (i18n)", () => {
  test("default locale is Spanish", async ({ page }) => {
    await page.goto("/");
    // Should redirect to /es or show Spanish content
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("/es");
  });

  test("can access English locale", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("header").getByText("RecipeShare")).toBeVisible({ timeout: 10000 });
  });

  test("can access French locale", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator("header").getByText("RecipeShare")).toBeVisible({ timeout: 10000 });
  });

  test("html lang attribute matches locale", async ({ page }) => {
    await page.goto("/es");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("es");
  });

  test("html lang updates for English", async ({ page }) => {
    await page.goto("/en");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("en");
  });

  test("invalid locale returns 404", async ({ page }) => {
    const response = await page.goto("/xx");
    // Should return 404 or redirect
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });
});
