import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getAllRecipes,
  getRecipeById,
  getRecipeBySlug,
  getRecipesByCategory,
  getAllTags,
  getUserTags,
  getRecipeReviews,
  saveRecipeReview,
  createRecipe,
  deleteRecipe,
  addTagToRecipe,
  removeTagFromRecipe,
} from "@/lib/services/recipe";
import { MOCK_RECIPES } from "@/lib/data/recipes";

beforeEach(() => {
  localStorage.clear();
});

describe("getAllRecipes", () => {
  it("returns an array of recipes", () => {
    const recipes = getAllRecipes();
    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeGreaterThan(0);
  });

  it("each recipe has required fields", () => {
    const recipes = getAllRecipes();
    for (const r of recipes) {
      expect(r.id).toBeTruthy();
      expect(r.title).toBeTruthy();
      expect(r.slug).toBeTruthy();
      expect(r.category).toBeTruthy();
      expect(typeof r.cookTime).toBe("number");
      expect(typeof r.calories).toBe("number");
      expect(typeof r.servings).toBe("number");
      expect(Array.isArray(r.tags)).toBe(true);
      expect(Array.isArray(r.ingredients)).toBe(true);
    }
  });
});

describe("getRecipeById", () => {
  it("finds a recipe by valid id", () => {
    const recipes = getAllRecipes();
    const first = recipes[0];
    const found = getRecipeById(first.id);
    expect(found).toBeDefined();
    expect(found?.title).toBe(first.title);
  });

  it("returns undefined for non-existent id", () => {
    expect(getRecipeById("nonexistent-id-xyz")).toBeUndefined();
  });
});

describe("getRecipeBySlug", () => {
  it("finds a recipe by slug", () => {
    const recipes = getAllRecipes();
    const first = recipes[0];
    const found = getRecipeBySlug(first.slug);
    expect(found).toBeDefined();
    expect(found?.id).toBe(first.id);
  });

  it("returns undefined for non-existent slug", () => {
    expect(getRecipeBySlug("this-slug-does-not-exist")).toBeUndefined();
  });
});

describe("getRecipesByCategory", () => {
  it("returns recipes matching the given category", () => {
    const all = getAllRecipes();
    const category = all[0].category;
    const filtered = getRecipesByCategory(category);
    expect(filtered.length).toBeGreaterThan(0);
    for (const r of filtered) {
      expect(r.category.toLowerCase()).toBe(category.toLowerCase());
    }
  });

  it("is case-insensitive", () => {
    const all = getAllRecipes();
    const category = all[0].category;
    const lower = getRecipesByCategory(category.toLowerCase());
    const upper = getRecipesByCategory(category.toUpperCase());
    expect(lower.length).toBe(upper.length);
  });

  it("returns empty array for non-existent category", () => {
    expect(getRecipesByCategory("CategoríaQueNoExiste")).toEqual([]);
  });
});

describe("getAllTags", () => {
  it("returns a sorted array of unique tags", () => {
    const tags = getAllTags();
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
    // Verify sorted
    for (let i = 1; i < tags.length; i++) {
      expect(tags[i] >= tags[i - 1]).toBe(true);
    }
    // Verify unique
    expect(new Set(tags).size).toBe(tags.length);
  });
});

describe("getUserTags", () => {
  it("returns empty array when no user is logged in", () => {
    // No session in localStorage
    expect(getUserTags()).toEqual([]);
  });
});

describe("getRecipeReviews", () => {
  it("returns reviews for a recipe", () => {
    const recipes = getAllRecipes();
    const withReviews = recipes.find((r) => r.reviews && r.reviews.length > 0);
    if (withReviews) {
      const reviews = getRecipeReviews(withReviews.id);
      expect(reviews.length).toBeGreaterThan(0);
    }
  });

  it("returns empty array for unknown recipe", () => {
    const reviews = getRecipeReviews("nonexistent-id");
    expect(reviews).toEqual([]);
  });
});

describe("saveRecipeReview", () => {
  it("saves and retrieves a review", () => {
    const recipes = getAllRecipes();
    const recipe = recipes[0];
    const review = {
      user: { username: "testuser", fullName: "Test User" },
      rating: 4,
      comment: "Muy buena receta",
      date: new Date().toISOString(),
    };

    const updated = saveRecipeReview(recipe.id, review);
    expect(updated.length).toBeGreaterThan(0);
    expect(updated[0].comment).toBe("Muy buena receta");

    // Verify persisted
    const retrieved = getRecipeReviews(recipe.id);
    expect(retrieved.some((r) => r.comment === "Muy buena receta")).toBe(true);
  });
});

describe("createRecipe", () => {
  it("throws when no user is logged in", async () => {
    localStorage.clear();
    await expect(
      createRecipe({
        title: "Test",
        description: "desc",
        images: [],
        category: "Cena",
        cookTime: 30,
        calories: 400,
        protein: 20,
        servings: 4,
        difficulty: "Fácil",
        tags: [],
        ingredients: ["sal"],
        steps: [{ text: "Paso 1", images: [] }],
      })
    ).rejects.toThrow("Debes iniciar sesión");
  });
});

describe("deleteRecipe", () => {
  it("throws when no user is logged in", async () => {
    localStorage.clear();
    await expect(deleteRecipe("some-id")).rejects.toThrow("Debes iniciar sesión");
  });

  it("throws for non-existent recipe", async () => {
    // Simulate a logged-in user
    const user = { id: "1", username: "chef_maria", email: "m@test.com", fullName: "María" };
    localStorage.setItem("recipeshare_session", JSON.stringify(user));
    await expect(deleteRecipe("nonexistent-xyz")).rejects.toThrow("Receta no encontrada");
  });
});

describe("addTagToRecipe / removeTagFromRecipe", () => {
  it("addTagToRecipe throws for non-existent recipe", async () => {
    await expect(addTagToRecipe("nonexistent-xyz", "nueva")).rejects.toThrow();
  });

  it("removeTagFromRecipe throws for non-existent recipe", async () => {
    await expect(removeTagFromRecipe("nonexistent-xyz", "tag")).rejects.toThrow();
  });
});
