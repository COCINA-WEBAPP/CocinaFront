import { test, expect } from "@playwright/test";
import { injectSession } from "./helpers";

test.describe("Recipe detail page", () => {
  test("displays recipe information", async ({ page }) => {
    await page.goto("/es/Explorar");
    const firstRecipeLink = page.locator("a[href*='/recetas/']").first();
    await expect(firstRecipeLink).toBeVisible({ timeout: 10000 });
    await firstRecipeLink.click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    // Should show recipe title in h1
    await expect(page.locator("h1").first()).toBeVisible();
    // Should show time info (e.g. "30 min") and calories
    await expect(page.locator("text=/\\d+ min/").first()).toBeVisible();
    await expect(page.locator("text=/\\d+ kcal/").first()).toBeVisible();
  });

  test("shows ingredients tab content by default", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    // Should show ingredients list items
    await expect(page.locator("ul li").first()).toBeVisible({ timeout: 5000 });
  });

  test("can switch between tabs (ingredients, steps, gallery)", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    // Switch to Pasos tab
    const pasosBtn = page.getByRole("button", { name: "Pasos" });
    await pasosBtn.click();
    await page.waitForTimeout(500);

    // Switch to Galería tab
    const galeriaBtn = page.getByRole("button", { name: "Galería" });
    await galeriaBtn.click();
    await page.waitForTimeout(500);

    // Switch back to Ingredientes
    const ingredientesBtn = page.getByRole("button", { name: /ingredientes/i });
    await ingredientesBtn.click();
    await page.waitForTimeout(500);
  });

  test("shows action buttons (save, share, print)", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    // Action bar buttons
    await expect(page.locator("button").filter({ hasText: /guardar/i }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator("button").filter({ hasText: /compartir/i }).first()).toBeVisible();
    await expect(page.locator("button").filter({ hasText: /imprimir/i }).first()).toBeVisible();
  });

  test("shows author information with link to profile", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    await expect(page.locator("a[href*='/perfil/']").first()).toBeVisible({ timeout: 10000 });
  });

  test("shows comments section", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    await expect(page.locator("text=/[Cc]omentarios/").first()).toBeVisible({ timeout: 10000 });
  });

  test("shows 'not found' for non-existent recipe", async ({ page }) => {
    await page.goto("/es/recetas/nonexistent-recipe-id");
    await expect(page.locator("text=/no encontrad|not found/i").first()).toBeVisible({ timeout: 10000 });
  });

  test("logged-in user can toggle save on a recipe", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    // Click save button
    const saveButton = page.locator("button").filter({ hasText: /guardar/i }).first();
    await expect(saveButton).toBeVisible({ timeout: 5000 });
    await saveButton.click();
    await page.waitForTimeout(1500);
  });

  test("logged-in user can add recipe to shopping list", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const addToListButton = page.locator("button").filter({ hasText: /agregar a lista/i });
    await expect(addToListButton).toBeVisible({ timeout: 5000 });
    await addToListButton.click();

    // Button text should change to "En lista"
    await expect(page.locator("button").filter({ hasText: /en lista/i })).toBeVisible({ timeout: 5000 });
  });
});
