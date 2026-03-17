import type { User } from "@/lib/types/users";
import type { RecipeComment, RecipeReview } from "@/lib/types/recipe-interactions";

/** Paso de receta con texto e imágenes opcionales */
export type RecipeStep = {
  text: string;
  images: string[];
};

/** Convierte un paso (string legado o RecipeStep) a RecipeStep normalizado */
export function normalizeStep(step: string | RecipeStep): RecipeStep {
  if (typeof step === "string") return { text: step, images: [] };
  return { text: step.text, images: step.images ?? [] };
}

export type Recipe = {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  author: Pick<User, "username" | "fullName">;
  category: string;
  cookTime: number;
  protein: number;
  calories: number;
  servings: number;
  difficulty: "Fácil" | "Intermedio" | "Difícil";
  rating: number;
  tags: string[];
  ingredients: string[];
  /** Pasos de preparación ordenados (string legado o RecipeStep) */
  steps: (string | RecipeStep)[];
  reviews: RecipeReview[];
  comments: RecipeComment[];
  isNew: boolean;
  isFeatured: boolean;
};

export type CreateRecipeData = {
  title: string;
  description: string;
  images: string[];
  category: string;
  cookTime: number;
  protein: number;
  calories: number;
  servings: number;
  difficulty: "Fácil" | "Intermedio" | "Difícil";
  tags: string[];
  ingredients: string[];
  /** Pasos de preparación ordenados */
  steps: RecipeStep[];
};

export type UpdateRecipeData = Partial<CreateRecipeData>;