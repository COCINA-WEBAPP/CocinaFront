// lib/services/recipe.ts
import { MOCK_RECIPES } from "@/lib/data/recipes";
import { Recipe, CreateRecipeData, UpdateRecipeData } from "@/lib/types/recipes";
import { getCurrentUser } from "@/lib/services/user";
import { MOCK_USERS } from "@/lib/data/users";

// ========================================
// SECCIÓN 1: LECTURA (READ)
// ========================================

export function getAllRecipes(): Recipe[] {
  return MOCK_RECIPES;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return MOCK_RECIPES.find((r) => r.slug === slug);
}

export function getRecipeById(id: string): Recipe | undefined {
  return MOCK_RECIPES.find((r) => r.id === id);
}

export function getRecipesByCategory(category: string): Recipe[] {
  return MOCK_RECIPES.filter((r) => r.category.toLowerCase() === category.toLowerCase());
}

// ========================================
// SECCIÓN 2: CREACIÓN (CREATE)
// ========================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function createRecipe(data: CreateRecipeData): Promise<Recipe> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión para crear una receta");

  const newId = String(Date.now());
  const slug = generateSlug(data.title);

  const newRecipe: Recipe = {
    id: newId,
    slug,
    title: data.title,
    description: data.description,
    images: data.images.length > 0 ? data.images : [],
    author: { username: user.username, fullName: user.fullName },
    category: data.category,
    cookTime: data.cookTime,
    calories: data.calories,
    protein: data.protein ?? 0,   // ← nuevo
    servings: data.servings,
    difficulty: data.difficulty,
    rating: 0,
    tags: data.tags,
    ingredients: data.ingredients,
    steps: data.steps ?? [],
    reviews: [],
    comments: [],
    isNew: true,
    isFeatured: false,
  };

  MOCK_RECIPES.unshift(newRecipe);

  const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    MOCK_USERS[userIndex].recipes.push(newId);
    MOCK_USERS[userIndex].stats.recipesCount++;
    for (const tag of data.tags) {
      if (!MOCK_USERS[userIndex].tagInventory.includes(tag)) {
        MOCK_USERS[userIndex].tagInventory.push(tag);
      }
    }
  }

  return newRecipe;
}

// ========================================
// SECCIÓN 3: ACTUALIZACIÓN (UPDATE)
// ========================================

export async function updateRecipe(id: string, data: UpdateRecipeData): Promise<Recipe> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión para editar una receta");

  const recipeIndex = MOCK_RECIPES.findIndex((r) => r.id === id);
  if (recipeIndex === -1) throw new Error("Receta no encontrada");

  const recipe = MOCK_RECIPES[recipeIndex];
  if (recipe.author.username !== user.username)
    throw new Error("No tienes permiso para editar esta receta");

  const updatedRecipe: Recipe = {
    ...recipe,
    ...data,
    slug: data.title ? generateSlug(data.title) : recipe.slug,
    steps: data.steps ?? recipe.steps ?? [],
    protein: data.protein ?? recipe.protein ?? 0,  // ← nuevo
  };

  MOCK_RECIPES[recipeIndex] = updatedRecipe;

  const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex !== -1 && data.tags) {
    for (const tag of data.tags) {
      if (!MOCK_USERS[userIndex].tagInventory.includes(tag)) {
        MOCK_USERS[userIndex].tagInventory.push(tag);
      }
    }
    const oldTags = recipe.tags.filter((t) => !data.tags!.includes(t));
    for (const tag of oldTags) {
      const stillUsed = MOCK_RECIPES.some(
        (r) => r.author.username === user.username && r.tags.includes(tag)
      );
      if (!stillUsed) {
        MOCK_USERS[userIndex].tagInventory = MOCK_USERS[userIndex].tagInventory.filter(
          (t) => t !== tag
        );
      }
    }
  }

  return updatedRecipe;
}

// ========================================
// SECCIÓN 4: ELIMINACIÓN (DELETE)
// ========================================

export async function deleteRecipe(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión para eliminar una receta");

  const recipeIndex = MOCK_RECIPES.findIndex((r) => r.id === id);
  if (recipeIndex === -1) throw new Error("Receta no encontrada");

  const recipe = MOCK_RECIPES[recipeIndex];
  if (recipe.author.username !== user.username)
    throw new Error("No tienes permiso para eliminar esta receta");

  const deletedTags = [...recipe.tags];
  MOCK_RECIPES.splice(recipeIndex, 1);

  const userIndex2 = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex2 !== -1) {
    for (const tag of deletedTags) {
      const stillUsed = MOCK_RECIPES.some(
        (r) => r.author.username === user.username && r.tags.includes(tag)
      );
      if (!stillUsed) {
        MOCK_USERS[userIndex2].tagInventory = MOCK_USERS[userIndex2].tagInventory.filter(
          (t) => t !== tag
        );
      }
    }
  }

  const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    MOCK_USERS[userIndex].recipes = MOCK_USERS[userIndex].recipes.filter((rId) => rId !== id);
    MOCK_USERS[userIndex].stats.recipesCount = Math.max(
      0,
      MOCK_USERS[userIndex].stats.recipesCount - 1
    );
  }

  for (const u of MOCK_USERS) {
    if (u.savedRecipes.includes(id)) {
      u.savedRecipes = u.savedRecipes.filter((rId) => rId !== id);
      u.stats.savedRecipesCount = Math.max(0, u.stats.savedRecipesCount - 1);
    }
  }
}

// ========================================
// SECCIÓN 5: ETIQUETAS (TAGS)
// ========================================

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const recipe of MOCK_RECIPES) {
    for (const tag of recipe.tags) tagSet.add(tag);
  }
  return Array.from(tagSet).sort();
}

export function getUserTags(): string[] {
  const user = getCurrentUser();
  if (!user) return [];
  const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex === -1) return [];
  return [...MOCK_USERS[userIndex].tagInventory].sort();
}

export async function addTagToRecipe(recipeId: string, tag: string): Promise<Recipe> {
  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión para modificar una receta");

  const recipeIndex = MOCK_RECIPES.findIndex((r) => r.id === recipeId);
  if (recipeIndex === -1) throw new Error("Receta no encontrada");

  const recipe = MOCK_RECIPES[recipeIndex];
  if (recipe.author.username !== user.username)
    throw new Error("No tienes permiso para modificar esta receta");
  if (recipe.tags.includes(tag)) throw new Error("La receta ya tiene esta etiqueta");

  recipe.tags.push(tag);

  const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex !== -1 && !MOCK_USERS[userIndex].tagInventory.includes(tag)) {
    MOCK_USERS[userIndex].tagInventory.push(tag);
  }

  return recipe;
}

export async function removeTagFromRecipe(recipeId: string, tag: string): Promise<Recipe> {
  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión para modificar una receta");

  const recipeIndex = MOCK_RECIPES.findIndex((r) => r.id === recipeId);
  if (recipeIndex === -1) throw new Error("Receta no encontrada");

  const recipe = MOCK_RECIPES[recipeIndex];
  if (recipe.author.username !== user.username)
    throw new Error("No tienes permiso para modificar esta receta");

  const tagIndex = recipe.tags.indexOf(tag);
  if (tagIndex === -1) throw new Error("La receta no tiene esta etiqueta");

  recipe.tags.splice(tagIndex, 1);

  const userStillUsesTag = MOCK_RECIPES.some(
    (r) => r.author.username === user.username && r.tags.includes(tag)
  );
  if (!userStillUsesTag) {
    const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex].tagInventory = MOCK_USERS[userIndex].tagInventory.filter(
        (t) => t !== tag
      );
    }
  }

  return recipe;
}

// ========================================
// SECCIÓN 6: RESEÑAS PERSISTENTES
// ========================================

const REVIEWS_KEY = "recipeshare_reviews";

function getReviewsFromStorage(recipeId: string): Recipe["reviews"] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${REVIEWS_KEY}_${recipeId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReviewsToStorage(recipeId: string, reviews: Recipe["reviews"]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${REVIEWS_KEY}_${recipeId}`, JSON.stringify(reviews));
}

function reviewKey(r: Recipe["reviews"][number]): string {
  return `${JSON.stringify(r.user)}::${r.comment}`;
}

export function getRecipeReviews(recipeId: string): Recipe["reviews"] {
  const recipe = MOCK_RECIPES.find((r) => r.id === recipeId || r.slug === recipeId);
  const stored = getReviewsFromStorage(recipeId);
  const initial = recipe?.reviews ?? [];

  if (stored.length === 0) return initial;

  const storedKeys = new Set(stored.map(reviewKey));
  return [
    ...stored,
    ...initial.filter((r) => !storedKeys.has(reviewKey(r))),
  ];
}

export function saveRecipeReview(
  recipeId: string,
  review: Recipe["reviews"][number]
): Recipe["reviews"] {
  const stored = getReviewsFromStorage(recipeId);
  const recipe = MOCK_RECIPES.find((r) => r.id === recipeId || r.slug === recipeId);
  const initial = recipe?.reviews ?? [];

  const storedKeys = new Set(stored.map(reviewKey));
  const base = [
    ...stored,
    ...initial.filter((r) => !storedKeys.has(reviewKey(r))),
  ];

  const updated = [review, ...base];
  saveReviewsToStorage(recipeId, updated);

  const recipeIndex = MOCK_RECIPES.findIndex((r) => r.id === recipeId || r.slug === recipeId);
  if (recipeIndex !== -1) {
    MOCK_RECIPES[recipeIndex].reviews = updated;
  }

  return updated;
}