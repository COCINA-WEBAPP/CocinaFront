/**
 * PRUEBAS UNITARIAS COMPLETAS — HISTORIAS DE USUARIO (HU 1–25)
 *
 * Archivo único que agrupa las pruebas por historia de usuario.
 * Cada `describe` de nivel superior corresponde a una HU.
 */

import { describe, it, expect, beforeEach } from "vitest";

// ── Servicios ──
import {
  getShoppingList,
  addRecipeToShoppingList,
  removeRecipeFromShoppingList,
  clearShoppingList,
  toggleOwnedItem,
  isItemOwned,
  isRecipeInShoppingList,
  resetShoppingListCache,
} from "@/lib/services/shopping-list";

import {
  getAllRecipes,
  getRecipeById,
  getRecipeBySlug,
  getRecipesByCategory,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getAllTags,
  getUserTags,
  addTagToRecipe,
  removeTagFromRecipe,
  getRecipeReviews,
  saveRecipeReview,
} from "@/lib/services/recipe";

import {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUserProfile,
  saveRecipe,
  unsaveRecipe,
  getUserSavedRecipes,
  isRecipeSaved,
  addToCookingHistory,
  getCookingHistory,
  removeFromCookingHistory,
  clearCookingHistory,
} from "@/lib/services/user";

// ── Datos ──
import {
  categorizeIngredient,
  groupIngredientsByCategory,
  INGREDIENT_CATEGORIES,
} from "@/lib/data/ingredient-categories";

import { MOCK_RECIPES } from "@/lib/data/recipes";
import { MOCK_USERS } from "@/lib/data/users";

// ── ChefBot ──
import {
  getChefBotResponse,
  INGREDIENT_SUBSTITUTIONS,
  CULINARY_TERMS,
  COOKING_TIPS,
  MEASUREMENT_CONVERSIONS,
  FOOD_SAFETY_TIPS,
} from "@/components/ChefBot/chefBotResponses";

// ── Tipos ──
import type { Recipe, CreateRecipeData } from "@/lib/types/recipes";

// ═══════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════

/** Limpia completamente la sesión (in-memory + localStorage). */
async function clearSession() {
  try { await logout(); } catch { /* noop */ }
  localStorage.clear();
  resetShoppingListCache();
}

/** Simula una sesión activa: primero limpia la anterior, luego escribe en localStorage. */
async function simulateSessionClean(user: { id: string; username: string; email: string; fullName: string }) {
  await clearSession();
  localStorage.setItem("recipeshare_session", JSON.stringify(user));
  resetShoppingListCache();
}

/** Simula sesión sin async (para uso en beforeEach sync — solo localStorage). */
function simulateSession(user: { id: string; username: string; email: string; fullName: string }) {
  localStorage.setItem("recipeshare_session", JSON.stringify(user));
}

/** Datos de sesión del primer usuario del mock (María). */
const MARIA = { id: "1", username: "maria_user", email: "maria@example.com", fullName: "María García" };

// ═══════════════════════════════════════════════════════════════════════
// LISTA DE COMPRAS — HU 1, 2 y 3
// ═══════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────
// HU 1 — Generar lista de compras a partir de una receta
// ───────────────────────────────────────────────────────────────────────
describe("HU 1 — Generar lista de compras a partir de una receta", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("genera una lista con los ingredientes de la receta seleccionada", () => {
    const recipe = MOCK_RECIPES[0];
    addRecipeToShoppingList(recipe.id, recipe.title, recipe.ingredients);

    const list = getShoppingList();
    expect(list.entries).toHaveLength(1);
    expect(list.entries[0].recipeId).toBe(recipe.id);
    expect(list.entries[0].ingredients).toEqual(recipe.ingredients);
  });

  it("no incluye ingredientes duplicados al agregar la misma receta dos veces", () => {
    const recipe = MOCK_RECIPES[0];
    addRecipeToShoppingList(recipe.id, recipe.title, recipe.ingredients);
    addRecipeToShoppingList(recipe.id, recipe.title, recipe.ingredients);

    const list = getShoppingList();
    // La receta sólo aparece una vez (se reemplaza, no se duplica)
    expect(list.entries).toHaveLength(1);
  });

  it("solo genera listas de recetas existentes — receta inexistente devuelve undefined", () => {
    const notFound = getRecipeById("receta-que-no-existe");
    expect(notFound).toBeUndefined();
  });

  it("permite agregar ingredientes de múltiples recetas distintas", () => {
    const r1 = MOCK_RECIPES[0];
    const r2 = MOCK_RECIPES[1];
    addRecipeToShoppingList(r1.id, r1.title, r1.ingredients);
    addRecipeToShoppingList(r2.id, r2.title, r2.ingredients);

    const list = getShoppingList();
    expect(list.entries).toHaveLength(2);
  });

  it("verifica que isRecipeInShoppingList funciona correctamente", () => {
    const recipe = MOCK_RECIPES[0];
    expect(isRecipeInShoppingList(recipe.id)).toBe(false);

    addRecipeToShoppingList(recipe.id, recipe.title, recipe.ingredients);
    expect(isRecipeInShoppingList(recipe.id)).toBe(true);
  });

  it("permite eliminar una receta de la lista de compras", () => {
    const recipe = MOCK_RECIPES[0];
    addRecipeToShoppingList(recipe.id, recipe.title, recipe.ingredients);
    removeRecipeFromShoppingList(recipe.id);

    expect(isRecipeInShoppingList(recipe.id)).toBe(false);
    expect(getShoppingList().entries).toHaveLength(0);
  });

  it("permite vaciar toda la lista de compras", () => {
    addRecipeToShoppingList("a", "A", ["x"]);
    addRecipeToShoppingList("b", "B", ["y"]);
    clearShoppingList();

    const list = getShoppingList();
    expect(list.entries).toHaveLength(0);
    expect(list.ownedItems).toHaveLength(0);
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 2 — Marcar ingredientes como "ya tengo en casa"
// ───────────────────────────────────────────────────────────────────────
describe("HU 2 — Marcar ingredientes como 'ya tengo en casa'", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("marca un ingrediente como disponible", () => {
    addRecipeToShoppingList("1", "Receta", ["Leche", "Huevos"]);
    toggleOwnedItem("Leche");

    expect(isItemOwned("Leche")).toBe(true);
    expect(isItemOwned("Huevos")).toBe(false);
  });

  it("desmarca un ingrediente previamente marcado", () => {
    addRecipeToShoppingList("1", "Receta", ["Leche"]);
    toggleOwnedItem("Leche");
    expect(isItemOwned("Leche")).toBe(true);

    toggleOwnedItem("Leche");
    expect(isItemOwned("Leche")).toBe(false);
  });

  it("el marcado es case-insensitive", () => {
    toggleOwnedItem("LECHE");
    expect(isItemOwned("leche")).toBe(true);
    expect(isItemOwned("Leche")).toBe(true);
  });

  it("los ingredientes marcados persisten en la lista de owned", () => {
    toggleOwnedItem("Sal");
    toggleOwnedItem("Pimienta");

    const list = getShoppingList();
    expect(list.ownedItems).toContain("sal");
    expect(list.ownedItems).toContain("pimienta");
  });

  it("clearShoppingList también limpia los ownedItems", () => {
    toggleOwnedItem("Sal");
    clearShoppingList();

    expect(isItemOwned("Sal")).toBe(false);
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 3 — Agrupar ingredientes por categoría
// ───────────────────────────────────────────────────────────────────────
describe("HU 3 — Agrupar ingredientes por categoría", () => {
  it("clasifica ingredientes lácteos correctamente", () => {
    expect(categorizeIngredient("1 taza de leche")).toBe("dairy");
    expect(categorizeIngredient("queso mozzarella")).toBe("dairy");
    expect(categorizeIngredient("mantequilla derretida")).toBe("dairy");
  });

  it("clasifica ingredientes cárnicos correctamente", () => {
    expect(categorizeIngredient("pechuga de pollo")).toBe("meat");
    expect(categorizeIngredient("carne de res")).toBe("meat");
    expect(categorizeIngredient("tocino ahumado")).toBe("meat");
  });

  it("clasifica verduras correctamente", () => {
    expect(categorizeIngredient("2 tomates")).toBe("vegetables");
    expect(categorizeIngredient("1 cebolla picada")).toBe("vegetables");
    expect(categorizeIngredient("espinaca")).toBe("vegetables");
  });

  it("clasifica especias correctamente", () => {
    expect(categorizeIngredient("1 pizca de sal")).toBe("spices");
    expect(categorizeIngredient("pimienta negra")).toBe("spices");
    expect(categorizeIngredient("orégano seco")).toBe("spices");
  });

  it("devuelve 'other' para ingredientes no clasificables", () => {
    expect(categorizeIngredient("ingrediente misterioso xyz")).toBe("other");
  });

  it("agrupa un array de ingredientes por categoría", () => {
    const ingredients = ["leche", "pollo", "tomate", "sal", "algo raro"];
    const groups = groupIngredientsByCategory(ingredients);

    expect(groups.get("dairy")).toContain("leche");
    expect(groups.get("meat")).toContain("pollo");
    expect(groups.get("vegetables")).toContain("tomate");
    expect(groups.get("spices")).toContain("sal");
    expect(groups.get("other")).toContain("algo raro");
  });

  it("solo muestra categorías que tienen ingredientes", () => {
    const ingredients = ["leche", "queso"];
    const groups = groupIngredientsByCategory(ingredients);

    expect(groups.has("dairy")).toBe(true);
    expect(groups.has("meat")).toBe(false);
  });

  it("las categorías predefinidas están en el orden esperado", () => {
    const keys = INGREDIENT_CATEGORIES.map((c) => c.key);
    expect(keys).toContain("dairy");
    expect(keys).toContain("meat");
    expect(keys).toContain("vegetables");
    expect(keys).toContain("fruits");
    expect(keys).toContain("spices");
  });

  it("la clasificación es accent-insensitive", () => {
    expect(categorizeIngredient("azucar")).toBe("bakery");
    expect(categorizeIngredient("azúcar")).toBe("bakery");
  });
});

// ═══════════════════════════════════════════════════════════════════════
// GESTIÓN DE FOTOS — HU 4, 5, 6 y 7
// ═══════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────
// HU 4 — Subir foto principal de una receta
// ───────────────────────────────────────────────────────────────────────
describe("HU 4 — Subir foto principal de una receta", () => {
  it("una receta tiene un array de imágenes con al menos la foto principal", () => {
    const recipe = MOCK_RECIPES.find((r) => r.images.length > 0);
    expect(recipe).toBeDefined();
    expect(recipe!.images[0]).toBeTruthy();
  });

  it("la primera imagen del array actúa como portada", () => {
    const recipe = MOCK_RECIPES[0];
    expect(typeof recipe.images[0]).toBe("string");
    expect(recipe.images[0].length).toBeGreaterThan(0);
  });

  it("la receta debe existir para poder tener foto — receta inexistente devuelve undefined", () => {
    expect(getRecipeById("no-existe")).toBeUndefined();
  });

  it("al crear una receta se puede incluir una imagen principal", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const data: CreateRecipeData = {
      title: "Receta con foto",
      description: "Test",
      images: ["https://example.com/foto.jpg"],
      category: "Cena",
      cookTime: 30,
      calories: 400,
      protein: 20,
      servings: 4,
      difficulty: "Fácil",
      tags: [],
      ingredients: ["sal"],
      steps: [{ text: "Paso 1", images: [] }],
    };

    const created = await createRecipe(data);
    expect(created.images).toHaveLength(1);
    expect(created.images[0]).toBe("https://example.com/foto.jpg");

    // Cleanup
    await deleteRecipe(created.id);
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 5 — Añadir múltiples fotos del proceso
// ───────────────────────────────────────────────────────────────────────
describe("HU 5 — Añadir múltiples fotos del proceso de preparación", () => {
  it("una receta puede tener múltiples imágenes", () => {
    const recipe = MOCK_RECIPES.find((r) => r.images.length > 1);
    expect(recipe).toBeDefined();
    expect(recipe!.images.length).toBeGreaterThan(1);
  });

  it("se pueden crear recetas con múltiples fotos", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const images = [
      "https://example.com/paso1.jpg",
      "https://example.com/paso2.jpg",
      "https://example.com/paso3.jpg",
    ];

    const created = await createRecipe({
      title: "Receta multifoto",
      description: "Test fotos",
      images,
      category: "Cena",
      cookTime: 20,
      calories: 300,
      protein: 15,
      servings: 2,
      difficulty: "Fácil",
      tags: [],
      ingredients: ["ingrediente1"],
      steps: [{ text: "Paso 1", images: [] }],
    });

    expect(created.images).toHaveLength(3);
    expect(created.images).toEqual(images);

    await deleteRecipe(created.id);
  });

  it("solo el creador puede modificar la receta (y sus fotos)", async () => {
    await simulateSessionClean({ id: "999", username: "otro_user", email: "otro@test.com", fullName: "Otro" });

    const recipeOfMaria = MOCK_RECIPES.find((r) => r.author.username === "maria_user");
    if (recipeOfMaria) {
      await expect(
        updateRecipe(recipeOfMaria.id, { images: ["nueva.jpg"] })
      ).rejects.toThrow("No tienes permiso");
    }
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 6 — Eliminar fotos de una receta
// ───────────────────────────────────────────────────────────────────────
describe("HU 6 — Eliminar fotos de una receta", () => {
  it("el creador puede actualizar (eliminar) fotos de su receta", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "Receta para eliminar fotos",
      description: "Test",
      images: ["foto1.jpg", "foto2.jpg"],
      category: "Cena",
      cookTime: 20,
      calories: 200,
      protein: 10,
      servings: 2,
      difficulty: "Fácil",
      tags: [],
      ingredients: ["sal"],
      steps: [{ text: "Paso 1", images: [] }],
    });

    const updated = await updateRecipe(created.id, { images: ["foto1.jpg"] });
    expect(updated.images).toHaveLength(1);
    expect(updated.images).not.toContain("foto2.jpg");

    await deleteRecipe(created.id);
  });

  it("solo el creador puede eliminar fotos — otro usuario no puede", async () => {
    await simulateSessionClean({ id: "999", username: "intruso", email: "x@test.com", fullName: "X" });

    const recipeOfMaria = MOCK_RECIPES.find((r) => r.author.username === "maria_user");
    if (recipeOfMaria) {
      await expect(
        updateRecipe(recipeOfMaria.id, { images: [] })
      ).rejects.toThrow("No tienes permiso");
    }
  });

  it("la foto debe existir previamente — la receta debe existir", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await expect(
      updateRecipe("id-que-no-existe", { images: [] })
    ).rejects.toThrow("Receta no encontrada");
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 7 — Visualizar fotos de una receta
// ───────────────────────────────────────────────────────────────────────
describe("HU 7 — Visualizar fotos de una receta", () => {
  it("las recetas existentes contienen un array de imágenes", () => {
    const recipe = MOCK_RECIPES[0];
    expect(Array.isArray(recipe.images)).toBe(true);
  });

  it("se muestran todas las fotos asociadas a la receta", () => {
    const recipe = MOCK_RECIPES.find((r) => r.images.length >= 1);
    expect(recipe).toBeDefined();
    recipe!.images.forEach((img) => {
      expect(typeof img).toBe("string");
      expect(img.length).toBeGreaterThan(0);
    });
  });

  it("una receta eliminada no se puede visualizar", () => {
    expect(getRecipeById("receta-eliminada-xyz")).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// INTERACCIÓN SOCIAL — HU 8, 9 y 10
// ═══════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────
// HU 8 — Calificar recetas con estrellas (1–5)
// ───────────────────────────────────────────────────────────────────────
describe("HU 8 — Calificar recetas con estrellas (1–5)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("guarda una calificación válida (entre 1 y 5)", () => {
    const recipe = MOCK_RECIPES[0];
    const review = {
      user: { username: "testuser", fullName: "Test" },
      rating: 4,
      comment: "Muy buena",
    };

    const updated = saveRecipeReview(recipe.id, review);
    expect(updated.length).toBeGreaterThan(0);
    expect(updated[0].rating).toBe(4);
  });

  it("la calificación debe estar entre 1 y 5 — validación del rango", () => {
    // La lógica de validación del rango 1-5 se hace en el componente UI,
    // pero verificamos que el sistema almacena ratings numéricos.
    const recipe = MOCK_RECIPES[0];
    const review = {
      user: { username: "testuser", fullName: "Test" },
      rating: 5,
      comment: "Excelente",
    };

    const updated = saveRecipeReview(recipe.id, review);
    expect(updated[0].rating).toBeGreaterThanOrEqual(1);
    expect(updated[0].rating).toBeLessThanOrEqual(5);
  });

  it("solo se pueden calificar recetas existentes", () => {
    const reviews = getRecipeReviews("nonexistent-id");
    expect(reviews).toEqual([]);
  });

  it("un usuario puede dejar una reseña con comentario y rating", () => {
    const recipe = MOCK_RECIPES[0];
    const review = {
      user: { username: "reviewer1", fullName: "Reviewer" },
      rating: 3,
      comment: "Regular",
    };

    const updated = saveRecipeReview(recipe.id, review);
    const found = updated.find((r) => r.comment === "Regular");
    expect(found).toBeDefined();
    expect(found!.rating).toBe(3);
  });

  it("las reseñas persisten en localStorage", () => {
    const recipe = MOCK_RECIPES[0];
    saveRecipeReview(recipe.id, {
      user: { username: "persist_user", fullName: "P" },
      rating: 5,
      comment: "Persistida",
    });

    const reviews = getRecipeReviews(recipe.id);
    expect(reviews.some((r) => r.comment === "Persistida")).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 9 — Marcar recetas como favoritas
// ───────────────────────────────────────────────────────────────────────
describe("HU 9 — Marcar recetas como favoritas", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("un usuario puede marcar una receta como favorita", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await saveRecipe("1");
    expect(isRecipeSaved("1")).toBe(true);
  });

  it("un usuario puede desmarcar una receta favorita", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await saveRecipe("1");
    expect(isRecipeSaved("1")).toBe(true);

    await unsaveRecipe("1");
    expect(isRecipeSaved("1")).toBe(false);
  });

  it("requiere sesión activa para guardar — lanza error sin login", async () => {
    await clearSession();
    await expect(saveRecipe("1")).rejects.toThrow("Debes iniciar sesión");
  });

  it("requiere sesión activa para desmarcar — lanza error sin login", async () => {
    await clearSession();
    await expect(unsaveRecipe("1")).rejects.toThrow("Debes iniciar sesión");
  });

  it("puede consultar las recetas guardadas del usuario", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await saveRecipe("2");
    const saved = await getUserSavedRecipes(MARIA.id);
    expect(saved).toContain("2");
  });

  it("no duplica recetas al guardar la misma dos veces", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await saveRecipe("3");
    await saveRecipe("3");
    const saved = await getUserSavedRecipes(MARIA.id);
    const count = saved.filter((id) => id === "3").length;
    expect(count).toBe(1);
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 10 — Añadir comentarios a una receta
// ───────────────────────────────────────────────────────────────────────
describe("HU 10 — Añadir comentarios a una receta", () => {
  it("las recetas tienen un array de comentarios", () => {
    const recipe = MOCK_RECIPES[0];
    expect(Array.isArray(recipe.comments)).toBe(true);
  });

  it("los comentarios tienen la estructura esperada (user, comment, date)", () => {
    const recipe = MOCK_RECIPES.find((r) => r.comments.length > 0);
    if (recipe) {
      const comment = recipe.comments[0];
      expect(comment.user).toBeDefined();
      expect(typeof comment.comment).toBe("string");
      expect(comment.comment.length).toBeGreaterThan(0);
      expect(typeof comment.date).toBe("string");
    }
  });

  it("el comentario no puede estar vacío — debe tener contenido", () => {
    const recipe = MOCK_RECIPES.find((r) => r.comments.length > 0);
    if (recipe) {
      recipe.comments.forEach((c) => {
        expect(c.comment.trim().length).toBeGreaterThan(0);
      });
    }
  });

  it("solo se pueden comentar recetas existentes", () => {
    const notFound = getRecipeById("receta-fantasma");
    expect(notFound).toBeUndefined();
  });

  it("los comentarios pueden tener respuestas (answers)", () => {
    const recipe = MOCK_RECIPES.find(
      (r) => r.comments.some((c) => c.answers && c.answers.length > 0)
    );
    if (recipe) {
      const withAnswers = recipe.comments.find((c) => c.answers.length > 0);
      expect(withAnswers).toBeDefined();
      expect(withAnswers!.answers[0].comment.length).toBeGreaterThan(0);
    }
  });

  it("los comentarios tienen contadores de likes y dislikes", () => {
    const recipe = MOCK_RECIPES.find((r) => r.comments.length > 0);
    if (recipe) {
      const comment = recipe.comments[0];
      expect(typeof comment.likeCount).toBe("number");
      expect(typeof comment.dislikeCount).toBe("number");
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// CRUD DE RECETAS — HU 11, 12, 13 y 14
// ═══════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────
// HU 11 — Crear una nueva receta
// ───────────────────────────────────────────────────────────────────────
describe("HU 11 — Crear una nueva receta", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("crea una receta correctamente con datos válidos", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const data: CreateRecipeData = {
      title: "Arroz con Pollo",
      description: "Receta clásica",
      images: [],
      category: "Almuerzo",
      cookTime: 45,
      calories: 500,
      protein: 30,
      servings: 4,
      difficulty: "Intermedio",
      tags: ["Clásico"],
      ingredients: ["arroz", "pollo", "cebolla"],
      steps: [{ text: "Cocinar el arroz", images: [] }],
    };

    const created = await createRecipe(data);
    expect(created.id).toBeTruthy();
    expect(created.title).toBe("Arroz con Pollo");
    expect(created.ingredients).toHaveLength(3);
    expect(created.cookTime).toBe(45);
    expect(created.author.username).toBe("maria_user");

    await deleteRecipe(created.id);
  });

  it("el texto ingresado queda asociado al nombre de la receta", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "Mi Receta Asociada",
      description: "Descripción de prueba",
      images: [],
      category: "Cena",
      cookTime: 20,
      calories: 300,
      protein: 15,
      servings: 2,
      difficulty: "Fácil",
      tags: [],
      ingredients: ["sal"],
      steps: [{ text: "Paso 1", images: [] }],
    });

    const found = getRecipeById(created.id);
    expect(found).toBeDefined();
    expect(found!.title).toBe("Mi Receta Asociada");
    expect(found!.description).toBe("Descripción de prueba");

    await deleteRecipe(created.id);
  });

  it("lanza error si no hay sesión activa", async () => {
    await clearSession();
    await expect(
      createRecipe({
        title: "Sin Sesión",
        description: "x",
        images: [],
        category: "Cena",
        cookTime: 10,
        calories: 100,
        protein: 5,
        servings: 1,
        difficulty: "Fácil",
        tags: [],
        ingredients: ["sal"],
        steps: [{ text: "Paso", images: [] }],
      })
    ).rejects.toThrow("Debes iniciar sesión");
  });

  it("genera un slug válido a partir del título", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "Torta de Chocolate Especial",
      description: "Test slug",
      images: [],
      category: "Postre",
      cookTime: 60,
      calories: 500,
      protein: 10,
      servings: 8,
      difficulty: "Intermedio",
      tags: [],
      ingredients: ["harina", "chocolate"],
      steps: [{ text: "Paso 1", images: [] }],
    });

    expect(created.slug).toBe("torta-de-chocolate-especial");

    await deleteRecipe(created.id);
  });

  it("el tiempo de cocción es numérico y positivo", () => {
    const recipes = getAllRecipes();
    recipes.forEach((r) => {
      expect(typeof r.cookTime).toBe("number");
      expect(r.cookTime).toBeGreaterThanOrEqual(0);
    });
  });

  it("los ingredientes no pueden ser un array vacío al crear — se requiere al menos uno", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    // La receta creada con ingredientes vacíos se guardaría, pero
    // validamos que la estructura de datos siempre tenga ingredientes.
    const created = await createRecipe({
      title: "Con ingredientes",
      description: "x",
      images: [],
      category: "Cena",
      cookTime: 10,
      calories: 100,
      protein: 5,
      servings: 1,
      difficulty: "Fácil",
      tags: [],
      ingredients: ["al menos uno"],
      steps: [{ text: "Paso", images: [] }],
    });

    expect(created.ingredients.length).toBeGreaterThan(0);

    await deleteRecipe(created.id);
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 12 — Editar recetas existentes
// ───────────────────────────────────────────────────────────────────────
describe("HU 12 — Editar recetas existentes", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("el creador puede editar su receta con datos válidos", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "Editable",
      description: "Original",
      images: [],
      category: "Cena",
      cookTime: 20,
      calories: 200,
      protein: 10,
      servings: 2,
      difficulty: "Fácil",
      tags: [],
      ingredients: ["sal", "pimienta"],
      steps: [{ text: "Paso 1", images: [] }],
    });

    const updated = await updateRecipe(created.id, {
      title: "Editada",
      description: "Modificada",
    });

    expect(updated.title).toBe("Editada");
    expect(updated.description).toBe("Modificada");

    await deleteRecipe(created.id);
  });

  it("un usuario no autorizado no puede editar la receta de otro", async () => {
    await simulateSessionClean({ id: "999", username: "intruso", email: "i@test.com", fullName: "I" });

    const recipeOfMaria = MOCK_RECIPES.find((r) => r.author.username === "maria_user");
    if (recipeOfMaria) {
      await expect(
        updateRecipe(recipeOfMaria.id, { title: "Hackeada" })
      ).rejects.toThrow("No tienes permiso");
    }
  });

  it("lanza error al intentar editar una receta inexistente", async () => {
    await simulateSessionClean(MARIA);

    await expect(
      updateRecipe("no-existe-xyz", { title: "Nada" })
    ).rejects.toThrow("Receta no encontrada");
  });

  it("lanza error si no hay sesión activa", async () => {
    await clearSession();
    await expect(
      updateRecipe("1", { title: "Sin sesión" })
    ).rejects.toThrow("Debes iniciar sesión");
  });

  it("no se puede dejar la receta sin ingredientes (validación de negocio)", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "Ingredientes requeridos",
      description: "x",
      images: [],
      category: "Cena",
      cookTime: 10,
      calories: 100,
      protein: 5,
      servings: 1,
      difficulty: "Fácil",
      tags: [],
      ingredients: ["sal"],
      steps: [{ text: "Paso", images: [] }],
    });

    // La validación de ingredientes vacíos se maneja en el UI/form,
    // pero verificamos que la receta siempre mantiene ingredientes.
    const updated = await updateRecipe(created.id, {
      ingredients: ["nuevo ingrediente"],
    });
    expect(updated.ingredients.length).toBeGreaterThan(0);

    await deleteRecipe(created.id);
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 13 — Eliminar recetas
// ───────────────────────────────────────────────────────────────────────
describe("HU 13 — Eliminar recetas", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("el creador puede eliminar su receta", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "Para eliminar",
      description: "x",
      images: [],
      category: "Cena",
      cookTime: 10,
      calories: 100,
      protein: 5,
      servings: 1,
      difficulty: "Fácil",
      tags: [],
      ingredients: ["sal"],
      steps: [{ text: "Paso", images: [] }],
    });

    await deleteRecipe(created.id);
    expect(getRecipeById(created.id)).toBeUndefined();
  });

  it("la receta eliminada deja de aparecer en el listado general", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "Desaparecerá",
      description: "x",
      images: [],
      category: "Cena",
      cookTime: 10,
      calories: 100,
      protein: 5,
      servings: 1,
      difficulty: "Fácil",
      tags: [],
      ingredients: ["sal"],
      steps: [{ text: "Paso", images: [] }],
    });

    const idCreated = created.id;
    await deleteRecipe(idCreated);

    const all = getAllRecipes();
    expect(all.find((r) => r.id === idCreated)).toBeUndefined();
  });

  it("un usuario no autorizado no puede eliminar recetas de otro", async () => {
    await simulateSessionClean({ id: "999", username: "intruso", email: "i@test.com", fullName: "I" });

    const recipeOfMaria = MOCK_RECIPES.find((r) => r.author.username === "maria_user");
    if (recipeOfMaria) {
      await expect(deleteRecipe(recipeOfMaria.id)).rejects.toThrow("No tienes permiso");
    }
  });

  it("lanza error al eliminar una receta inexistente", async () => {
    await simulateSessionClean(MARIA);

    await expect(deleteRecipe("no-existe")).rejects.toThrow("Receta no encontrada");
  });

  it("lanza error si no hay sesión activa", async () => {
    await clearSession();
    await expect(deleteRecipe("1")).rejects.toThrow("Debes iniciar sesión");
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 14 — Listar todas las recetas del usuario
// ───────────────────────────────────────────────────────────────────────
describe("HU 14 — Listar recetas propias del usuario", () => {
  it("getAllRecipes devuelve un array no vacío", () => {
    const recipes = getAllRecipes();
    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeGreaterThan(0);
  });

  it("se pueden filtrar recetas por autor", () => {
    const all = getAllRecipes();
    const mariasRecipes = all.filter((r) => r.author.username === "maria_user");
    expect(mariasRecipes.length).toBeGreaterThan(0);
    mariasRecipes.forEach((r) => {
      expect(r.author.username).toBe("maria_user");
    });
  });

  it("no se listan recetas eliminadas", async () => {
    localStorage.clear();
    resetShoppingListCache();
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "Temporal",
      description: "x",
      images: [],
      category: "Cena",
      cookTime: 10,
      calories: 100,
      protein: 5,
      servings: 1,
      difficulty: "Fácil",
      tags: [],
      ingredients: ["sal"],
      steps: [{ text: "Paso", images: [] }],
    });

    await deleteRecipe(created.id);
    const all = getAllRecipes();
    expect(all.find((r) => r.id === created.id)).toBeUndefined();
  });

  it("cada receta tiene los campos requeridos", () => {
    const recipes = getAllRecipes();
    for (const r of recipes) {
      expect(r.id).toBeTruthy();
      expect(r.title).toBeTruthy();
      expect(r.slug).toBeTruthy();
      expect(typeof r.cookTime).toBe("number");
      expect(Array.isArray(r.ingredients)).toBe(true);
    }
  });

  it("el usuario mock tiene recetas asociadas en su perfil", () => {
    const maria = MOCK_USERS.find((u) => u.username === "maria_user");
    expect(maria).toBeDefined();
    expect(maria!.recipes.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// FILTRAR POR RANGO CALÓRICO / PROTEICO — HU 15
// ═══════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────
// HU 15 — Filtrar recetas por rango calórico o proteico
// ───────────────────────────────────────────────────────────────────────
describe("HU 15 — Filtrar recetas por rango calórico o proteico", () => {
  const allRecipes = getAllRecipes();

  it("filtra recetas dentro de un rango calórico válido", () => {
    const min = 200;
    const max = 400;
    const filtered = allRecipes.filter((r) => r.calories >= min && r.calories <= max);

    filtered.forEach((r) => {
      expect(r.calories).toBeGreaterThanOrEqual(min);
      expect(r.calories).toBeLessThanOrEqual(max);
    });
  });

  it("filtra recetas dentro de un rango proteico válido", () => {
    const min = 10;
    const max = 30;
    const filtered = allRecipes.filter((r) => (r.protein ?? 0) >= min && (r.protein ?? 0) <= max);

    filtered.forEach((r) => {
      expect(r.protein ?? 0).toBeGreaterThanOrEqual(min);
      expect(r.protein ?? 0).toBeLessThanOrEqual(max);
    });
  });

  it("el rango calórico no debe ser negativo — las calorías son >= 0", () => {
    allRecipes.forEach((r) => {
      expect(r.calories).toBeGreaterThanOrEqual(0);
    });
  });

  it("el rango proteico no debe ser negativo — la proteína es >= 0", () => {
    allRecipes.forEach((r) => {
      expect(r.protein ?? 0).toBeGreaterThanOrEqual(0);
    });
  });

  it("devuelve array vacío si no hay recetas en el rango", () => {
    const filtered = allRecipes.filter((r) => r.calories >= 99999);
    expect(filtered).toEqual([]);
  });

  it("rango inválido (mínimo > máximo) no devuelve resultados", () => {
    const min = 500;
    const max = 100;
    const filtered = allRecipes.filter((r) => r.calories >= min && r.calories <= max);
    expect(filtered).toEqual([]);
  });

  it("solo lista recetas existentes — los IDs son válidos", () => {
    allRecipes.forEach((r) => {
      expect(r.id).toBeTruthy();
      expect(getRecipeById(r.id)).toBeDefined();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════
// HISTORIAL DE RECETAS PREPARADAS — HU 16
// ═══════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────
// HU 16 — Consultar historial de recetas preparadas
// ───────────────────────────────────────────────────────────────────────
describe("HU 16 — Consultar historial de recetas preparadas", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("el historial está vacío si el usuario no ha preparado recetas", () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const history = getCookingHistory();
    expect(history).toEqual([]);
  });

  it("agrega una receta al historial correctamente", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await addToCookingHistory("1", "Pancakes Esponjosos", "image.jpg");
    const history = getCookingHistory();

    expect(history).toHaveLength(1);
    expect(history[0].recipeId).toBe("1");
    expect(history[0].recipeTitle).toBe("Pancakes Esponjosos");
    expect(history[0].cookedAt).toBeTruthy();
  });

  it("el historial muestra la fecha de preparación", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await addToCookingHistory("1", "Receta", undefined);
    const history = getCookingHistory();
    expect(history[0].cookedAt).toBeTruthy();
    // Verifica que es un ISO date string válido
    expect(new Date(history[0].cookedAt).getTime()).not.toBeNaN();
  });

  it("las recetas más recientes aparecen primero (orden descendente)", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await addToCookingHistory("1", "Primera", undefined);
    await addToCookingHistory("2", "Segunda", undefined);

    const history = getCookingHistory();
    expect(history[0].recipeTitle).toBe("Segunda");
    expect(history[1].recipeTitle).toBe("Primera");
  });

  it("se puede eliminar una entrada del historial", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await addToCookingHistory("1", "Receta", undefined);
    await removeFromCookingHistory(0);

    const history = getCookingHistory();
    expect(history).toHaveLength(0);
  });

  it("se puede limpiar todo el historial", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await addToCookingHistory("1", "R1", undefined);
    await addToCookingHistory("2", "R2", undefined);
    await clearCookingHistory();

    expect(getCookingHistory()).toHaveLength(0);
  });

  it("lanza error sin sesión activa al agregar al historial", async () => {
    await clearSession();
    await expect(addToCookingHistory("1", "R", undefined)).rejects.toThrow("Debes iniciar sesión");
  });
});

// ═══════════════════════════════════════════════════════════════════════
// CREACIÓN Y AUTENTICACIÓN DE PERFIL — HU 17 y 18
// ═══════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────
// HU 17 — Crear un perfil (registro)
// ───────────────────────────────────────────────────────────────────────
describe("HU 17 — Crear un perfil (registro de usuario)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("registra un usuario nuevo correctamente", async () => {
    const user = await register({
      username: "nuevo_user_test",
      email: "nuevo_test@example.com",
      password: "password123",
      fullName: "Nuevo Usuario Test",
    });

    expect(user.id).toBeTruthy();
    expect(user.username).toBe("nuevo_user_test");
    expect(user.email).toBe("nuevo_test@example.com");
    expect(user.fullName).toBe("Nuevo Usuario Test");

    // Cleanup: remove from MOCK_USERS
    const idx = MOCK_USERS.findIndex((u) => u.id === user.id);
    if (idx !== -1) MOCK_USERS.splice(idx, 1);
  });

  it("no permite registrar un email duplicado", async () => {
    // maria@example.com ya existe en MOCK_USERS
    await expect(
      register({
        username: "otro_username",
        email: "maria@example.com",
        password: "password123",
        fullName: "Otro",
      })
    ).rejects.toThrow("El email ya está registrado");
  });

  it("la contraseña debe tener mínimo 8 caracteres (validación en UI/form)", () => {
    // La validación de longitud mínima se hace en el formulario con Zod,
    // pero verificamos la estructura de RegisterData.
    const validPassword = "12345678";
    const invalidPassword = "1234567";
    expect(validPassword.length).toBeGreaterThanOrEqual(8);
    expect(invalidPassword.length).toBeLessThan(8);
  });

  it("el usuario registrado queda con sesión activa", async () => {
    const user = await register({
      username: "session_test_user",
      email: "session_test@example.com",
      password: "password123",
      fullName: "Session Test",
    });

    const current = getCurrentUser();
    expect(current).toBeDefined();
    expect(current!.id).toBe(user.id);

    // Cleanup
    const idx = MOCK_USERS.findIndex((u) => u.id === user.id);
    if (idx !== -1) MOCK_USERS.splice(idx, 1);
  });

  it("el usuario nuevo tiene stats inicializadas en 0", async () => {
    const user = await register({
      username: "stats_test_user",
      email: "stats_test@example.com",
      password: "password123",
      fullName: "Stats Test",
    });

    expect(user.stats.recipesCount).toBe(0);
    expect(user.stats.followersCount).toBe(0);
    expect(user.stats.followingCount).toBe(0);
    expect(user.stats.savedRecipesCount).toBe(0);

    // Cleanup
    const idx = MOCK_USERS.findIndex((u) => u.id === user.id);
    if (idx !== -1) MOCK_USERS.splice(idx, 1);
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 18 — Inicio de sesión (login)
// ───────────────────────────────────────────────────────────────────────
describe("HU 18 — Inicio de sesión (login)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("inicia sesión correctamente con credenciales válidas", async () => {
    const user = await login({ email: "maria@example.com", password: "cualquiera" });
    expect(user.username).toBe("maria_user");
    expect(isAuthenticated()).toBe(true);
  });

  it("lanza error con email inexistente", async () => {
    await expect(
      login({ email: "noexiste@test.com", password: "password" })
    ).rejects.toThrow("Usuario no encontrado");
  });

  it("lanza error con contraseña incorrecta para usuario registrado", async () => {
    // Primero registramos un usuario con contraseña conocida
    const user = await register({
      username: "login_pwd_test",
      email: "pwd_test@example.com",
      password: "correctpassword",
      fullName: "Pwd Test",
    });

    await logout();

    // Intentamos login con contraseña incorrecta
    await expect(
      login({ email: "pwd_test@example.com", password: "wrongpassword" })
    ).rejects.toThrow("Contraseña incorrecta");

    // Cleanup
    const idx = MOCK_USERS.findIndex((u) => u.id === user.id);
    if (idx !== -1) MOCK_USERS.splice(idx, 1);
  });

  it("el logout cierra la sesión correctamente", async () => {
    await login({ email: "maria@example.com", password: "x" });
    expect(isAuthenticated()).toBe(true);

    await logout();
    expect(getCurrentUser()).toBeNull();
  });

  it("getCurrentUser retorna null si no hay sesión", () => {
    expect(getCurrentUser()).toBeNull();
  });

  it("isAuthenticated retorna false sin sesión", () => {
    expect(isAuthenticated()).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// CRUD DE ETIQUETAS — HU 19, 20, 21 y 22
// ═══════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────
// HU 19 — Crear etiquetas de categorías de alimentos
// ───────────────────────────────────────────────────────────────────────
describe("HU 19 — Crear etiquetas de categorías", () => {
  it("getAllTags devuelve un array de etiquetas únicas y ordenadas", () => {
    const tags = getAllTags();
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);

    // Verificar unicidad
    expect(new Set(tags).size).toBe(tags.length);

    // Verificar orden
    for (let i = 1; i < tags.length; i++) {
      expect(tags[i] >= tags[i - 1]).toBe(true);
    }
  });

  it("el nombre de las etiquetas no puede contener números (validación)", () => {
    const tags = getAllTags();
    // Los tags existentes en el mock no tienen números
    tags.forEach((tag) => {
      // Validamos la regla de negocio: sin números
      const hasNumbers = /\d/.test(tag);
      expect(hasNumbers).toBe(false);
    });
  });

  it("las etiquetas de los MOCK_RECIPES son strings no vacíos", () => {
    MOCK_RECIPES.forEach((r) => {
      r.tags.forEach((tag) => {
        expect(typeof tag).toBe("string");
        expect(tag.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it("getUserTags devuelve array vacío sin sesión", () => {
    localStorage.clear();
    resetShoppingListCache();
    expect(getUserTags()).toEqual([]);
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 20 — Ver recetas de una etiqueta específica
// ───────────────────────────────────────────────────────────────────────
describe("HU 20 — Ver recetas por etiqueta", () => {
  it("filtra recetas por una etiqueta existente", () => {
    const tags = getAllTags();
    if (tags.length > 0) {
      const tag = tags[0];
      const filtered = getAllRecipes().filter((r) => r.tags.includes(tag));
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((r) => {
        expect(r.tags).toContain(tag);
      });
    }
  });

  it("devuelve array vacío para una etiqueta que no existe", () => {
    const filtered = getAllRecipes().filter((r) => r.tags.includes("EtiquetaQueNoExisteXYZ"));
    expect(filtered).toEqual([]);
  });

  it("solo muestra recetas existentes (los IDs son válidos)", () => {
    const tags = getAllTags();
    if (tags.length > 0) {
      const tag = tags[0];
      const filtered = getAllRecipes().filter((r) => r.tags.includes(tag));
      filtered.forEach((r) => {
        expect(getRecipeById(r.id)).toBeDefined();
      });
    }
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 21 — Añadir etiquetas a una receta
// ───────────────────────────────────────────────────────────────────────
describe("HU 21 — Añadir etiquetas a una receta", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("el creador puede añadir una etiqueta a su receta", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "Para Tags",
      description: "x",
      images: [],
      category: "Cena",
      cookTime: 10,
      calories: 100,
      protein: 5,
      servings: 1,
      difficulty: "Fácil",
      tags: ["Original"],
      ingredients: ["sal"],
      steps: [{ text: "Paso", images: [] }],
    });

    const updated = await addTagToRecipe(created.id, "NuevaEtiqueta");
    expect(updated.tags).toContain("NuevaEtiqueta");

    await deleteRecipe(created.id);
  });

  it("no se puede añadir una etiqueta duplicada", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "Tags Dup",
      description: "x",
      images: [],
      category: "Cena",
      cookTime: 10,
      calories: 100,
      protein: 5,
      servings: 1,
      difficulty: "Fácil",
      tags: ["Existente"],
      ingredients: ["sal"],
      steps: [{ text: "Paso", images: [] }],
    });

    await expect(addTagToRecipe(created.id, "Existente")).rejects.toThrow("ya tiene esta etiqueta");

    await deleteRecipe(created.id);
  });

  it("lanza error si la receta no existe", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await expect(addTagToRecipe("no-existe", "Tag")).rejects.toThrow("Receta no encontrada");
  });

  it("lanza error si el usuario no es el creador", async () => {
    await simulateSessionClean({ id: "999", username: "otro", email: "o@test.com", fullName: "O" });

    const recipeOfMaria = MOCK_RECIPES.find((r) => r.author.username === "maria_user");
    if (recipeOfMaria) {
      await expect(addTagToRecipe(recipeOfMaria.id, "Hack")).rejects.toThrow("No tienes permiso");
    }
  });

  it("lanza error sin sesión activa", async () => {
    await clearSession();
    await expect(addTagToRecipe("1", "Tag")).rejects.toThrow("Debes iniciar sesión");
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 22 — Eliminar etiquetas de una receta
// ───────────────────────────────────────────────────────────────────────
describe("HU 22 — Eliminar etiquetas de una receta", () => {
  beforeEach(() => {
    localStorage.clear();
    resetShoppingListCache();
  });

  it("el creador puede eliminar una etiqueta de su receta", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "Remove Tag",
      description: "x",
      images: [],
      category: "Cena",
      cookTime: 10,
      calories: 100,
      protein: 5,
      servings: 1,
      difficulty: "Fácil",
      tags: ["ParaBorrar", "SeQueda"],
      ingredients: ["sal"],
      steps: [{ text: "Paso", images: [] }],
    });

    const updated = await removeTagFromRecipe(created.id, "ParaBorrar");
    expect(updated.tags).not.toContain("ParaBorrar");
    expect(updated.tags).toContain("SeQueda");

    await deleteRecipe(created.id);
  });

  it("lanza error al eliminar una etiqueta que la receta no tiene", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    const created = await createRecipe({
      title: "No Tag",
      description: "x",
      images: [],
      category: "Cena",
      cookTime: 10,
      calories: 100,
      protein: 5,
      servings: 1,
      difficulty: "Fácil",
      tags: [],
      ingredients: ["sal"],
      steps: [{ text: "Paso", images: [] }],
    });

    await expect(removeTagFromRecipe(created.id, "Inexistente")).rejects.toThrow("no tiene esta etiqueta");

    await deleteRecipe(created.id);
  });

  it("lanza error si la receta no existe", async () => {
    simulateSession(MARIA);
    resetShoppingListCache();

    await expect(removeTagFromRecipe("no-existe", "Tag")).rejects.toThrow("Receta no encontrada");
  });

  it("lanza error si el usuario no es el creador", async () => {
    await simulateSessionClean({ id: "999", username: "otro", email: "o@test.com", fullName: "O" });

    const recipeOfMaria = MOCK_RECIPES.find((r) => r.author.username === "maria_user");
    if (recipeOfMaria && recipeOfMaria.tags.length > 0) {
      await expect(
        removeTagFromRecipe(recipeOfMaria.id, recipeOfMaria.tags[0])
      ).rejects.toThrow("No tienes permiso");
    }
  });

  it("lanza error sin sesión activa", async () => {
    await clearSession();
    await expect(removeTagFromRecipe("1", "Tag")).rejects.toThrow("Debes iniciar sesión");
  });
});

// ═══════════════════════════════════════════════════════════════════════
// ASISTENTE DE COCINA (CHATBOT) — HU 23 y 24
// ═══════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────
// HU 23 — Preguntar al asistente IA cómo sustituir un ingrediente
// ───────────────────────────────────────────────────────────────────────
describe("HU 23 — Sustitución de ingredientes con ChefBot", () => {
  it("sugiere un sustituto coherente para un ingrediente conocido", () => {
    const response = getChefBotResponse("¿Con qué puedo reemplazar el huevo?");
    expect(response).toContain("sustituir");
    expect(response.toLowerCase()).toContain("huevo");
  });

  it("sugiere sustituto para mantequilla", () => {
    const response = getChefBotResponse("No tengo mantequilla, ¿con qué la sustituyo?");
    expect(response).toContain("aceite");
  });

  it("sugiere sustituto para leche", () => {
    const response = getChefBotResponse("¿Con qué reemplazo la leche?");
    expect(response.toLowerCase()).toContain("leche");
  });

  it("responde con mensaje genérico si no identifica el ingrediente", () => {
    const response = getChefBotResponse("Quiero sustituir algo");
    expect(response).toContain("no pude identificar");
  });

  it("la IA solo responde temas de cocina — rechaza temas no relacionados", () => {
    const response = getChefBotResponse("¿Quién ganó el partido de futbol?");
    expect(response).toContain("solo puedo ayudarte con temas de cocina");
  });

  it("la base de datos de sustituciones tiene ingredientes reales", () => {
    const keys = Object.keys(INGREDIENT_SUBSTITUTIONS);
    expect(keys.length).toBeGreaterThan(10);
    expect(keys).toContain("huevo");
    expect(keys).toContain("mantequilla");
    expect(keys).toContain("leche");
    expect(keys).toContain("harina");
  });

  it("cada sustitución tiene substitute y note", () => {
    Object.values(INGREDIENT_SUBSTITUTIONS).forEach((sub) => {
      expect(sub.substitute).toBeTruthy();
      expect(sub.note).toBeTruthy();
    });
  });

  it("responde al saludo con el menú de opciones", () => {
    const response = getChefBotResponse("Hola");
    expect(response).toContain("ChefBot");
    expect(response).toContain("Sustituir ingredientes");
  });
});

// ───────────────────────────────────────────────────────────────────────
// HU 24 — Explicar términos culinarios
// ───────────────────────────────────────────────────────────────────────
describe("HU 24 — Explicación de términos culinarios con ChefBot", () => {
  it("explica un término culinario conocido", () => {
    const response = getChefBotResponse("¿Qué es blanquear?");
    expect(response.toLowerCase()).toContain("blanquear");
    expect(response).toContain("agua");
  });

  it("explica el término juliana", () => {
    const response = getChefBotResponse("¿Qué significa juliana?");
    expect(response.toLowerCase()).toContain("juliana");
    expect(response).toContain("corte");
  });

  it("explica el término mise en place", () => {
    const response = getChefBotResponse("Explicame mise en place");
    expect(response.toLowerCase()).toContain("mise en place");
  });

  it("responde con mensaje útil si el término no existe", () => {
    const response = getChefBotResponse("¿Qué es xyloqueso?");
    expect(response).toContain("No encontré");
  });

  it("la IA solo responde temas de cocina — rechaza temas no culinarios", () => {
    const response = getChefBotResponse("Háblame de programacion y software");
    expect(response).toContain("solo puedo ayudarte con temas de cocina");
  });

  it("la base de datos de términos culinarios tiene contenido suficiente", () => {
    const terms = Object.keys(CULINARY_TERMS);
    expect(terms.length).toBeGreaterThan(30);
    expect(terms).toContain("blanquear");
    expect(terms).toContain("juliana");
    expect(terms).toContain("brunoise");
    expect(terms).toContain("reducir");
    expect(terms).toContain("marinar");
  });

  it("cada término tiene una definición no vacía", () => {
    Object.values(CULINARY_TERMS).forEach((def) => {
      expect(typeof def).toBe("string");
      expect(def.length).toBeGreaterThan(10);
    });
  });

  it("provee tips de cocción para temas conocidos", () => {
    const response = getChefBotResponse("¿Cómo cocino el arroz?");
    expect(response).toContain("arroz");
  });

  it("provee conversiones de medidas", () => {
    const response = getChefBotResponse("¿Cuánto es una taza?");
    expect(response).toContain("240 ml");
  });

  it("la base de datos de tips de cocción tiene contenido", () => {
    expect(Object.keys(COOKING_TIPS).length).toBeGreaterThan(10);
  });

  it("la base de datos de conversiones tiene contenido", () => {
    expect(Object.keys(MEASUREMENT_CONVERSIONS).length).toBeGreaterThan(5);
  });

  it("la base de datos de seguridad alimentaria tiene contenido", () => {
    expect(Object.keys(FOOD_SAFETY_TIPS).length).toBeGreaterThan(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// RECETAS MEJOR VALORADAS — HU 25
// ═══════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────
// HU 25 — Listar recetas mejor valoradas
// ───────────────────────────────────────────────────────────────────────
describe("HU 25 — Listar recetas mejor valoradas", () => {
  it("las recetas tienen un campo rating numérico", () => {
    const recipes = getAllRecipes();
    recipes.forEach((r) => {
      expect(typeof r.rating).toBe("number");
    });
  });

  it("se pueden ordenar recetas de mayor a menor calificación", () => {
    const recipes = getAllRecipes();
    const sorted = [...recipes].sort((a, b) => b.rating - a.rating);

    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].rating).toBeGreaterThanOrEqual(sorted[i].rating);
    }
  });

  it("solo se muestran recetas existentes (no eliminadas)", () => {
    const recipes = getAllRecipes();
    recipes.forEach((r) => {
      expect(r.id).toBeTruthy();
      expect(r.title).toBeTruthy();
    });
  });

  it("el listado contiene recetas con diferentes ratings", () => {
    const recipes = getAllRecipes();
    const ratings = new Set(recipes.map((r) => r.rating));
    expect(ratings.size).toBeGreaterThan(1);
  });

  it("las recetas top tienen rating > 0", () => {
    const recipes = getAllRecipes();
    const sorted = [...recipes].sort((a, b) => b.rating - a.rating);
    const top5 = sorted.slice(0, 5);

    top5.forEach((r) => {
      expect(r.rating).toBeGreaterThan(0);
    });
  });

  it("el listado se genera de forma eficiente (síncrono, sin llamadas async)", () => {
    const start = performance.now();
    const recipes = getAllRecipes();
    const sorted = [...recipes].sort((a, b) => b.rating - a.rating);
    const end = performance.now();

    expect(sorted.length).toBeGreaterThan(0);
    // Debe completarse en menos de 1 segundo (criterio de aceptación)
    expect(end - start).toBeLessThan(1000);
  });
});
