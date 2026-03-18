import { test, expect } from "@playwright/test";
import { injectSession } from "./helpers";

test.describe("Create recipe page", () => {
  test("redirects unauthenticated users to login prompt", async ({ page }) => {
    await page.goto("/es/create");
    // Should show a "not logged in" message or login button
    await expect(
      page.locator("button").filter({ hasText: /iniciar sesión/i }).or(
        page.locator("text=/no has iniciado/i")
      )
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows the create recipe form when authenticated", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/create");

    await expect(page.locator("h1").filter({ hasText: "Crear Receta" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder("Ej: Pasta Carbonara")).toBeVisible();
    await expect(page.getByPlaceholder("Describe tu receta...")).toBeVisible();
  });

  test("can fill in recipe name and description", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/create");

    await page.getByPlaceholder("Ej: Pasta Carbonara").fill("Mi Receta E2E");
    await page.getByPlaceholder("Describe tu receta...").fill("Una receta de prueba para e2e");

    await expect(page.getByPlaceholder("Ej: Pasta Carbonara")).toHaveValue("Mi Receta E2E");
  });

  test("can add ingredients", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/create");

    // Fill first ingredient
    await page.getByPlaceholder("Nombre del ingrediente").first().fill("Tomate");
    await page.getByPlaceholder("Cantidad").first().fill("2");

    // Click "Agregar ingrediente" to add another
    await page.getByText("Agregar ingrediente").click();

    // Should now have 2 ingredient rows
    const ingredientInputs = page.getByPlaceholder("Nombre del ingrediente");
    await expect(ingredientInputs).toHaveCount(2);
  });

  test("can add preparation steps", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/create");

    // Fill first step
    await page.getByPlaceholder(/describe el paso 1/i).fill("Cortar los tomates");

    // Add another step
    await page.getByText("Agregar paso").click();

    // Should now have 2 step textareas
    const steps = page.locator("textarea[placeholder*='Describe el paso']");
    await expect(steps).toHaveCount(2);
  });

  test("can select tags", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/create");

    // Select a preset tag from dropdown
    const tagSelect = page.locator("select").filter({ hasText: /añadir existente/i });
    await tagSelect.selectOption("Italiana");

    // Tag should appear as a badge
    await expect(page.locator("span").filter({ hasText: "Italiana" }).first()).toBeVisible();
  });

  test("can create a custom tag", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/create");

    await page.getByPlaceholder("Nueva etiqueta").fill("MiTagE2E");
    // The "Crear" button in the tags section (not the main form "Guardar")
    await page.locator("button").filter({ hasText: /^Crear$/ }).click();

    await expect(page.locator("span").filter({ hasText: "MiTagE2E" }).first()).toBeVisible();
  });

  test("shows error when submitting without title", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/create");

    // Try to save without filling the title - the button should be disabled
    const saveButton = page.locator("button").filter({ hasText: /^Guardar$/ });
    // The button is disabled when title is empty
    await expect(saveButton).toBeDisabled();
  });

  test("can submit a complete recipe and redirects to detail", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/create");

    // Fill required fields
    await page.getByPlaceholder("Ej: Pasta Carbonara").fill("Receta E2E Test");
    await page.getByPlaceholder("Describe tu receta...").fill("Descripción de prueba");
    await page.getByPlaceholder("Nombre del ingrediente").first().fill("Ingrediente 1");
    await page.getByPlaceholder("Cantidad").first().fill("100");
    await page.getByPlaceholder(/describe el paso 1/i).fill("Paso uno de la receta");

    // Submit
    await page.locator("button").filter({ hasText: /^Guardar$/ }).click();

    // Should redirect to the recipe detail page
    await page.waitForURL("**/recetas/**", { timeout: 10000 });
    await expect(page.locator("h1").filter({ hasText: "Receta E2E Test" })).toBeVisible({ timeout: 5000 });
  });

  test("cancel button navigates back", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/Explorar");
    await page.goto("/es/create");

    await page.locator("button").filter({ hasText: /^Cancelar$/ }).click();
    // Should navigate back (to Explorar or home)
    await page.waitForTimeout(1000);
    expect(page.url()).not.toContain("/create");
  });
});

// ── HU 4 — Image upload section in create form ──

test.describe("HU 4 — Image upload on create recipe", () => {
  test("create recipe form has an image upload section", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/create");

    const imgSection = page.locator("text=/imagen|foto|portada|URL/i").first();
    await expect(imgSection).toBeVisible({ timeout: 10000 });
  });
});
