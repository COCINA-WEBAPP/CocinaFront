import { test, expect } from "@playwright/test";
import { injectSession } from "./helpers";

test.describe("Account page - unauthenticated", () => {
  test("shows login prompt when not authenticated", async ({ page }) => {
    await page.goto("/es/account");
    // The button text is "Ir al Login"
    await expect(
      page.locator("button").filter({ hasText: /ir al login/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("login button navigates to login page", async ({ page }) => {
    await page.goto("/es/account");
    await page.locator("button").filter({ hasText: /ir al login/i }).click();
    await page.waitForURL("**/login**", { timeout: 5000 });
  });
});

test.describe("Account page - authenticated", () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/account");
  });

  test("shows user profile information", async ({ page }) => {
    await expect(page.locator("h1").filter({ hasText: "María García" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("maria@example.com")).toBeVisible();
  });

  test("shows edit profile and logout buttons", async ({ page }) => {
    await expect(page.locator("button").filter({ hasText: "Editar perfil" })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("button").filter({ hasText: "Salir" })).toBeVisible();
  });

  test("has tab navigation (Favoritos, Historial, Mis Recetas, Información)", async ({ page }) => {
    // Target the tab bar buttons specifically
    const tabBar = page.locator(".flex.border-b");
    await expect(tabBar.getByText("Favoritos")).toBeVisible({ timeout: 10000 });
    await expect(tabBar.getByText("Historial")).toBeVisible();
    await expect(tabBar.getByText("Mis Recetas")).toBeVisible();
    await expect(tabBar.getByText("Información")).toBeVisible();
  });

  test("can switch between tabs", async ({ page }) => {
    const tabBar = page.locator(".flex.border-b").first();

    await tabBar.getByText("Historial").click();
    await page.waitForTimeout(500);

    await tabBar.getByText("Mis Recetas").click();
    await page.waitForTimeout(500);

    await tabBar.getByText("Información").click();
    await page.waitForTimeout(500);

    await tabBar.getByText("Favoritos").click();
    await page.waitForTimeout(500);
  });

  test("opens edit profile dialog", async ({ page }) => {
    await page.locator("button").filter({ hasText: "Editar perfil" }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 });
  });

  test("logout redirects to login page", async ({ page }) => {
    await page.locator("button").filter({ hasText: "Salir" }).click();
    await page.waitForURL("**/login**", { timeout: 5000 });
  });

  test("shows Top Recipes section", async ({ page }) => {
    await expect(page.getByText("Mis Recetas Top")).toBeVisible({ timeout: 10000 });
  });
});
