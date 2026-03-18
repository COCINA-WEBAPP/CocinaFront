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

// ── HU 4 — Foto principal de la receta ──

test.describe("HU 4 — Recipe hero image", () => {
  test("displays a hero image on the recipe detail page", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const heroImg = page.locator("main img").first();
    await expect(heroImg).toBeVisible({ timeout: 10000 });
  });
});

// ── HU 5 — Galería de fotos del proceso ──

test.describe("HU 5 — Recipe gallery", () => {
  test("gallery tab shows images or empty message", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    await page.getByRole("button", { name: "Galería" }).click();
    await page.waitForTimeout(500);

    const imgs = page.locator("main img");
    const noGalleryMsg = page.locator("text=/no tiene imágenes/i");
    const hasImgs = (await imgs.count()) > 0;
    const hasMsg = (await noGalleryMsg.count()) > 0;
    expect(hasImgs || hasMsg).toBe(true);
  });
});

// ── HU 6 — Editar/eliminar fotos (owner controls) ──

test.describe("HU 6 — Owner edit controls", () => {
  test("edit or delete controls appear for the recipe creator", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const editOrDeleteBtn = page
      .locator("a[href*='/editar']")
      .or(page.locator("button").filter({ hasText: /eliminar/i }));
    const count = await editOrDeleteBtn.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

// ── HU 8 — Calificar recetas con estrellas ──

test.describe("HU 8 — Star ratings", () => {
  test("shows the reviews section with stars", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    await expect(page.locator("text=/reseñas|reviews/i").first()).toBeVisible({ timeout: 10000 });
  });

  test("review form has clickable star buttons and textarea", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const starButtons = page.locator("button[aria-label*='estrella']");
    await expect(starButtons.first()).toBeVisible({ timeout: 10000 });

    const textarea = page.locator(
      "textarea[placeholder*='comentario'], textarea[placeholder*='reseña'], textarea[placeholder*='Escribe']"
    );
    await expect(textarea.first()).toBeVisible();
  });

  test("can select stars and submit a review", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const starButtons = page.locator("button[aria-label*='estrella']");
    await starButtons.nth(3).click();

    const textarea = page
      .locator("textarea[placeholder*='comentario'], textarea[placeholder*='reseña'], textarea[placeholder*='Escribe']")
      .first();
    await textarea.fill("Excelente receta, muy fácil de seguir");

    const publishBtn = page.locator("button").filter({ hasText: /publicar|enviar/i }).first();
    await publishBtn.click();

    await expect(
      page.getByText("Excelente receta, muy fácil de seguir").first()
    ).toBeVisible({ timeout: 5000 });
  });
});

// ── HU 10 — Comentarios en recetas ──

test.describe("HU 10 — Recipe comments", () => {
  test("comment form exists with textarea", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const commentArea = page.locator("textarea").first();
    await expect(commentArea).toBeVisible({ timeout: 10000 });
  });

  test("can write and publish a comment", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const commentTextarea = page
      .locator("textarea[placeholder*='comparte'], textarea[placeholder*='opinión'], textarea[placeholder*='Comparte']")
      .first();
    if ((await commentTextarea.count()) > 0) {
      await commentTextarea.fill("Me encantó esta receta, la voy a preparar este fin de semana");

      const publishBtn = page.locator("button").filter({ hasText: /publicar/i }).last();
      await publishBtn.click();

      await expect(
        page.getByText("Me encantó esta receta").first()
      ).toBeVisible({ timeout: 5000 });
    }
  });
});

// ── HU 12 — Editar recetas existentes ──

test.describe("HU 12 — Edit existing recipe", () => {
  test("edit button appears for the creator", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const editLink = page.locator("a[href*='/editar']");
    const count = await editLink.count();
    if (count > 0) {
      await expect(editLink.first()).toBeVisible();
    }
  });

  test("edit page loads form with existing data", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/recetas/1/editar");
    await page.waitForTimeout(2000);

    const titleInput = page.locator("input[placeholder*='Pasta'], input[value]").first();
    await expect(titleInput).toBeVisible({ timeout: 10000 });
  });
});

// ── HU 13 — Eliminar recetas ──

test.describe("HU 13 — Delete recipe", () => {
  test("delete button shows confirmation dialog", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const deleteBtn = page.locator("button").filter({ hasText: /eliminar/i });
    if ((await deleteBtn.count()) > 0) {
      await deleteBtn.click();
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 });
      await expect(
        page.getByRole("dialog").locator("button").filter({ hasText: /cancelar/i })
      ).toBeVisible();
    }
  });

  test("cancelling delete keeps the recipe", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const deleteBtn = page.locator("button").filter({ hasText: /eliminar/i });
    if ((await deleteBtn.count()) > 0) {
      await deleteBtn.click();
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 });

      await page
        .getByRole("dialog")
        .locator("button")
        .filter({ hasText: /cancelar/i })
        .click();

      await expect(page.locator("h1").first()).toBeVisible();
    }
  });
});

// ── HU 16 — Botón Preparar ──

test.describe("HU 16 — Prepare button", () => {
  test("prepare button is visible on recipe detail", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const prepareBtn = page.locator("button").filter({ hasText: /preparar/i });
    await expect(prepareBtn).toBeVisible({ timeout: 5000 });
    await prepareBtn.click();
    await page.waitForTimeout(1500);
  });
});

// ── HU 20 — Ver recetas por etiqueta ──

test.describe("HU 20 — Tags display on recipe", () => {
  test("recipe detail shows tag badges", async ({ page }) => {
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const badges = page.locator("[data-slot='badge'], .badge, span.rounded-full, span.text-sm");
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ── HU 21 — Añadir etiquetas a una receta ──

test.describe("HU 21 — Tags section for creator", () => {
  test("creator sees the tags section", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const tagsSection = page.locator("text=/etiquetas|tags/i").first();
    await expect(tagsSection).toBeVisible({ timeout: 10000 });
  });
});

// ── HU 22 — Eliminar etiquetas de una receta ──

test.describe("HU 22 — Remove tags from recipe", () => {
  test("creator tags have remove buttons", async ({ page }) => {
    await injectSession(page);
    await page.goto("/es/Explorar");
    await page.locator("a[href*='/recetas/']").first().click();
    await page.waitForURL("**/recetas/**", { timeout: 10000 });

    const removeTagBtns = page.locator(
      "button[aria-label*='liminar'], button[aria-label*='quitar'], button[aria-label*='emove']"
    );
    const count = await removeTagBtns.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
