// lib/services/recipes.ts
import { MOCK_RECIPES } from "@/lib/data/recipes";
import { Recipe, CreateRecipeData, UpdateRecipeData } from "lib/types/recipes";
import { getCurrentUser } from "@/lib/services/user";
import { MOCK_USERS } from "@/lib/data/users";

// ========================================
// SECCIÓN 1: LECTURA (READ)
// ========================================

export function getAllRecipes(): Recipe[] {
  // En el futuro haz esto async y fetch a tu API/Supabase
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

/**
 * Crea una nueva receta
 *
 * MOCK: Agrega la receta a MOCK_RECIPES y actualiza el usuario
 * PRODUCCIÓN: POST /api/recipes
 */
export async function createRecipe(data: CreateRecipeData): Promise<Recipe> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = getCurrentUser();
  if (!user) {
    throw new Error("Debes iniciar sesión para crear una receta");
  }

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
    servings: data.servings,
    difficulty: data.difficulty,
    rating: 0,
    tags: data.tags,
    ingredients: data.ingredients,
    reviews: [],
    comments: [],
    isNew: true,
    isFeatured: false,
  };

  MOCK_RECIPES.unshift(newRecipe);

  // Actualizar las recetas del usuario
  const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    MOCK_USERS[userIndex].recipes.push(newId);
    MOCK_USERS[userIndex].stats.recipesCount++;
  }

  return newRecipe;
}

// ========================================
// SECCIÓN 3: ACTUALIZACIÓN (UPDATE)
// ========================================

/**
 * Actualiza una receta existente
 *
 * MOCK: Modifica la receta en MOCK_RECIPES
 * PRODUCCIÓN: PATCH /api/recipes/:id
 */
export async function updateRecipe(id: string, data: UpdateRecipeData): Promise<Recipe> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = getCurrentUser();
  if (!user) {
    throw new Error("Debes iniciar sesión para editar una receta");
  }

  const recipeIndex = MOCK_RECIPES.findIndex((r) => r.id === id);
  if (recipeIndex === -1) {
    throw new Error("Receta no encontrada");
  }

  const recipe = MOCK_RECIPES[recipeIndex];
  if (recipe.author.username !== user.username) {
    throw new Error("No tienes permiso para editar esta receta");
  }

  const updatedRecipe: Recipe = {
    ...recipe,
    ...data,
    // Regenerar slug si cambió el título
    slug: data.title ? generateSlug(data.title) : recipe.slug,
  };

  MOCK_RECIPES[recipeIndex] = updatedRecipe;

  return updatedRecipe;
}

// ========================================
// SECCIÓN 4: ELIMINACIÓN (DELETE)
// ========================================

/**
 * Elimina una receta
 *
 * MOCK: Elimina de MOCK_RECIPES y actualiza el usuario
 * PRODUCCIÓN: DELETE /api/recipes/:id
 */
export async function deleteRecipe(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = getCurrentUser();
  if (!user) {
    throw new Error("Debes iniciar sesión para eliminar una receta");
  }

  const recipeIndex = MOCK_RECIPES.findIndex((r) => r.id === id);
  if (recipeIndex === -1) {
    throw new Error("Receta no encontrada");
  }

  const recipe = MOCK_RECIPES[recipeIndex];
  if (recipe.author.username !== user.username) {
    throw new Error("No tienes permiso para eliminar esta receta");
  }

  MOCK_RECIPES.splice(recipeIndex, 1);

  // Actualizar las recetas del usuario
  const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    MOCK_USERS[userIndex].recipes = MOCK_USERS[userIndex].recipes.filter((rId) => rId !== id);
    MOCK_USERS[userIndex].stats.recipesCount = Math.max(0, MOCK_USERS[userIndex].stats.recipesCount - 1);
  }

  // Eliminar de savedRecipes de todos los usuarios
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

/**
 * Obtiene todas las etiquetas únicas existentes en las recetas
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const recipe of MOCK_RECIPES) {
    for (const tag of recipe.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

/**
 * Añade una etiqueta existente a una receta
 *
 * Valida que:
 * - El usuario esté autenticado
 * - La receta exista
 * - La receta pertenezca al usuario
 * - La etiqueta no esté ya en la receta (bloquea duplicados)
 */
export async function addTagToRecipe(recipeId: string, tag: string): Promise<Recipe> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("Debes iniciar sesión para modificar una receta");
  }

  const recipeIndex = MOCK_RECIPES.findIndex((r) => r.id === recipeId);
  if (recipeIndex === -1) {
    throw new Error("Receta no encontrada");
  }

  const recipe = MOCK_RECIPES[recipeIndex];
  if (recipe.author.username !== user.username) {
    throw new Error("No tienes permiso para modificar esta receta");
  }

  if (recipe.tags.includes(tag)) {
    throw new Error("La receta ya tiene esta etiqueta");
  }

  recipe.tags.push(tag);
  return recipe;
}

/**
 * Elimina una etiqueta de una receta
 *
 * Valida que:
 * - El usuario esté autenticado
 * - La receta exista
 * - La receta pertenezca al usuario
 * - La etiqueta exista en la receta
 */
export async function removeTagFromRecipe(recipeId: string, tag: string): Promise<Recipe> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("Debes iniciar sesión para modificar una receta");
  }

  const recipeIndex = MOCK_RECIPES.findIndex((r) => r.id === recipeId);
  if (recipeIndex === -1) {
    throw new Error("Receta no encontrada");
  }

  const recipe = MOCK_RECIPES[recipeIndex];
  if (recipe.author.username !== user.username) {
    throw new Error("No tienes permiso para modificar esta receta");
  }

  const tagIndex = recipe.tags.indexOf(tag);
  if (tagIndex === -1) {
    throw new Error("La receta no tiene esta etiqueta");
  }

  recipe.tags.splice(tagIndex, 1);
  return recipe;
}
