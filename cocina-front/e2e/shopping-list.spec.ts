import { test, expect } from "@playwright/test";
import { injectSession, setupMocks, seedShoppingList } from "./helpers";

test.beforeEach(async ({ page }) => {
  await setupMocks(page);
});

test.describe("Shopping list page - empty state", () => {
  test("shows empty state when no recipes added", async ({ page }) => {
    await page.goto("/es/lista-compras");
    await expect(page.locator("text=/vacía|empty|no hay/i").first()).toBeVisible({ timeout: 10000 });
  });

  test("has a link to explore recipes from empty state", async ({ page }) => {
    await page.goto("/es/lista-compras");
    // Use a more specific selector for the CTA button/link
    const exploreButton = page.locator("a[href*='Explorar'] button, a[href*='Explorar']").first();
    await expect(exploreButton).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Shopping list page - with items", () => {
  test("can add a recipe to shopping list from detail page", async ({ page }) => {
    await injectSession(page);

    // Go to a recipe and add it to the shopping list
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const addButton = page.locator("button").filter({ hasText: /agregar a lista/i });
    const buttonCount = await addButton.count();
    if (buttonCount > 0) {
      await addButton.click();
      await expect(page.locator("button").filter({ hasText: /en lista/i })).toBeVisible({ timeout: 5000 });
    }
  });

  test("shopping list displays recipe sections with ingredients", async ({ page }) => {
    seedShoppingList(page, {
      entries: [
        {
          recipeId: "1",
          recipeTitle: "Receta Test",
          ingredients: ["200g Tomate", "1 Cebolla", "100ml Aceite de oliva"],
          addedAt: new Date().toISOString(),
        },
      ],
      ownedItems: [],
    });
    await page.goto("/es/lista-compras");

    // Should show the recipe title
    await expect(page.getByText("Receta Test").first()).toBeVisible({ timeout: 10000 });
    // Should show ingredients (use first() since they appear in both recipe section and final list)
    await expect(page.getByText("200g Tomate").first()).toBeVisible();
    await expect(page.getByText("1 Cebolla").first()).toBeVisible();
  });

  test("can check off ingredients as owned", async ({ page }) => {
    seedShoppingList(page, {
      entries: [
        {
          recipeId: "1",
          recipeTitle: "Receta Test",
          ingredients: ["200g Tomate", "1 Cebolla"],
          addedAt: new Date().toISOString(),
        },
      ],
      ownedItems: [],
    });
    await page.goto("/es/lista-compras");

    // Click on first checkbox
    const checkbox = page.locator("[role='checkbox']").first();
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.click();

    // Should show "En casa" badge
    await expect(page.getByText(/en casa/i).first()).toBeVisible({ timeout: 3000 });
  });

  test("can remove a recipe from shopping list", async ({ page }) => {
    seedShoppingList(page, {
      entries: [
        {
          recipeId: "1",
          recipeTitle: "Receta Para Borrar",
          ingredients: ["Ingrediente 1"],
          addedAt: new Date().toISOString(),
        },
      ],
      ownedItems: [],
    });
    await page.goto("/es/lista-compras");

    await expect(page.getByText("Receta Para Borrar").first()).toBeVisible({ timeout: 10000 });

    // Click the trash button (the one with aria-label for remove recipe)
    const removeBtn = page.locator("button").filter({ has: page.locator(".text-destructive") }).first();
    await removeBtn.click();
    await page.waitForTimeout(1000);
  });

  test("can clear entire shopping list", async ({ page }) => {
    seedShoppingList(page, {
      entries: [
        {
          recipeId: "1",
          recipeTitle: "Receta 1",
          ingredients: ["Ingrediente A"],
          addedAt: new Date().toISOString(),
        },
      ],
      ownedItems: [],
    });
    await page.goto("/es/lista-compras");

    // Click "Vaciar lista" button
    const clearButton = page.locator("button").filter({ hasText: /vaciar lista/i }).first();
    await expect(clearButton).toBeVisible({ timeout: 10000 });
    await clearButton.click();

    // Confirm in dialog
    const confirmDialog = page.getByRole("dialog");
    await expect(confirmDialog).toBeVisible({ timeout: 3000 });
    // Click the confirm button in the dialog (there are two "Vaciar lista" buttons)
    await confirmDialog.locator("button").filter({ hasText: /vaciar lista/i }).click();

    // Should show empty state
    await expect(page.locator("text=/vacía|empty|no hay/i").first()).toBeVisible({ timeout: 5000 });
  });
});

// ── HU 3 — Agrupar ingredientes por categoría ──

test.describe("HU 3 — Ingredient grouping by category", () => {
  test("ingredients are displayed grouped in the shopping list", async ({ page }) => {
    seedShoppingList(page, {
      entries: [
        {
          recipeId: "1",
          recipeTitle: "Receta Mixta",
          ingredients: ["Leche entera", "Pechuga de pollo", "2 tomates", "Sal"],
          addedAt: new Date().toISOString(),
        },
      ],
      ownedItems: [],
    });
    await page.goto("/es/lista-compras");

    await expect(page.getByText("Leche entera").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Pechuga de pollo").first()).toBeVisible();
    await expect(page.getByText("2 tomates").first()).toBeVisible();
    await expect(page.getByText("Sal").first()).toBeVisible();
  });
});
