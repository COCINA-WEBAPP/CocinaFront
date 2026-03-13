import type { User } from "@/lib/types/users";
import type { RecipeComment, RecipeReview } from "@/lib/types/recipe-interactions";

export type Recipe = {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  author: Pick<User, "username" | "fullName">;
  category: string;
  cookTime: number;
  calories: number;
  servings: number;
  difficulty: "Fácil" | "Intermedio" | "Difícil";
  rating: number;
  tags: string[];
  ingredients: string[];
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
  calories: number;
  servings: number;
  difficulty: "Fácil" | "Intermedio" | "Difícil";
  tags: string[];
  ingredients: string[];
};

export type UpdateRecipeData = Partial<CreateRecipeData>;
