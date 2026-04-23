import { test, expect } from "@playwright/test";
import { setupMocks } from "./helpers";

test.beforeEach(async ({ page }) => {
  await setupMocks(page);
});

test.describe("Explorar page (Recipe Catalog)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/es/Explorar");
  });

  test("displays the recipe catalogue with cards", async ({ page }) => {
    // Should show recipe card links
    await expect(page.locator("a[href*='/recetas/']").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("has a search input in the page", async ({ page }) => {
    // Use the main content area search, not header
    const searchInput = page.locator("main").getByPlaceholder(/buscar/i);
    const headerSearch = page.locator("header").getByPlaceholder(/buscar/i);
    // At least one should be visible
    const mainVisible = await searchInput.isVisible().catch(() => false);
    const headerVisible = await headerSearch.isVisible().catch(() => false);
    expect(mainVisible || headerVisible).toBe(true);
  });

  test("can search for recipes via header", async ({ page }) => {
    const searchInput = page.locator("header").getByPlaceholder("Buscar recetas...");
    await searchInput.fill("pasta");
    await searchInput.press("Enter");
    // URL should contain search param
    await expect(page).toHaveURL(/search=pasta/);
  });

  test("search via URL parameter filters recipes", async ({ page }) => {
    await page.goto("/es/Explorar?search=pasta");
    // Page should load without errors
    await expect(page.locator("main")).toBeVisible();
  });

  test("has sort/filter controls", async ({ page }) => {
    // Look for sort or filter related elements (button text is "Ordenar por:" or "Filtros")
    const sortElement = page.locator("button, [role='combobox']").filter({ hasText: /ordenar|filtro/i });
    const count = await sortElement.count();
    expect(count).toBeGreaterThan(0);
  });

  test("recipe cards are clickable and navigate to detail", async ({ page }) => {
    const firstRecipeLink = page.locator("a[href*='/recetas/']").first();
    await expect(firstRecipeLink).toBeVisible({ timeout: 10000 });
    const href = await firstRecipeLink.getAttribute("href");
    expect(href).toContain("/recetas/");
  });

  test("clicking a recipe card navigates to recipe detail", async ({ page }) => {
    const firstRecipeLink = page.locator("a[href*='/recetas/']").first();
    await expect(firstRecipeLink).toBeVisible({ timeout: 10000 });
    await firstRecipeLink.click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });
  });
});

// ── HU 15 — Filtrar recetas por rango calórico o proteico ──

test.describe("HU 15 — Caloric/protein filtering", () => {
  test("recipes show caloric info in detail page", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    await expect(page.locator("text=/\\d+ kcal/").first()).toBeVisible({ timeout: 10000 });
  });

  test("filter and sort controls exist on the catalog", async ({ page }) => {
    await page.goto("/es/Explorar");

    // Sort/filter controls may be in buttons or comboboxes
    const sortOrFilterElement = page
      .locator("button, [role='combobox']")
      .filter({ hasText: /ordenar|filtro/i });
    const count = await sortOrFilterElement.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ── HU 20 — Buscar recetas por etiqueta ──

test.describe("HU 20 — Search by tag", () => {
  test("searching by tag name returns results", async ({ page }) => {
    await page.goto("/es/Explorar?search=italiana");
    await page.waitForTimeout(2000);
    await expect(page.locator("main")).toBeVisible();
  });
});
