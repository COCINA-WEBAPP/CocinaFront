// lib/services/recipes.ts
import { MOCK_RECIPES } from "@/lib/data/recipes";
import { Recipe } from "lib/types/recipes";

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
