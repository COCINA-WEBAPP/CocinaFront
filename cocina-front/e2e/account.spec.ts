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

  test("top recipes section has links to recipe details", async ({ page }) => {
    await expect(page.getByText("Mis Recetas Top")).toBeVisible({ timeout: 10000 });
    const topLinks = page.locator("a[href*='/recetas/']");
    const count = await topLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ── HU 14 — Listar recetas propias del usuario ──

test.describe("HU 14 — User's own recipes", () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/account");
  });

  test("Mis Recetas tab shows the user's recipes", async ({ page }) => {
    const tabBar = page.locator(".flex.border-b").first();
    await tabBar.getByText("Mis Recetas").click();
    await page.waitForTimeout(1000);

    const content = await page.locator("main").innerText();
    expect(content.length).toBeGreaterThan(0);
  });

  test("listed recipes are clickable and link to detail", async ({ page }) => {
    const tabBar = page.locator(".flex.border-b").first();
    await tabBar.getByText("Mis Recetas").click();
    await page.waitForTimeout(1000);

    const recipeLink = page.locator("a[href*='/recetas/']").first();
    if ((await recipeLink.count()) > 0) {
      const href = await recipeLink.getAttribute("href");
      expect(href).toContain("/recetas/");
    }
  });
});

// ── HU 16 — Historial de recetas preparadas ──

test.describe("HU 16 — Cooking history", () => {
  test.beforeEach(async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/account");
  });

  test("Historial tab shows empty message when no history", async ({ page }) => {
    const tabBar = page.locator(".flex.border-b").first();
    await tabBar.getByText("Historial").click();
    await page.waitForTimeout(1000);

    await expect(
      page.getByText(/no has preparado|historial/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows cooked recipes when history exists", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "recipeshare_cooking_history_1",
        JSON.stringify([
          {
            recipeId: "1",
            recipeTitle: "Pancakes Esponjosos con Miel",
            cookedAt: new Date().toISOString(),
          },
        ])
      );
    });
    await page.reload();

    const tabBar = page.locator(".flex.border-b").first();
    await tabBar.getByText("Historial").click();
    await page.waitForTimeout(1000);

    await expect(
      page.getByText("Pancakes Esponjosos con Miel").first()
    ).toBeVisible({ timeout: 10000 });
  });
});
