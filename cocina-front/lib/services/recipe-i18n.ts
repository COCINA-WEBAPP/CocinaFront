import type { Recipe } from "@/lib/types/recipes";

type TranslationFn = {
  (key: string): string;
  raw(key: string): unknown;
};

/**
 * Returns a copy of the recipe with localized text fields.
 * Falls back to original values if translation keys are missing.
 */
export function localizeRecipe(recipe: Recipe, t: TranslationFn): Recipe {
  const slug = recipe.slug;

  const getString = (field: string): string => {
    try {
      const val = t(`${slug}.${field}`);
      return val && !val.startsWith(`${slug}.`) ? val : (recipe as any)[field];
    } catch {
      return (recipe as any)[field];
    }
  };

  const getArray = (field: string): string[] => {
    try {
      const val = t.raw(`${slug}.${field}`);
      return Array.isArray(val) ? val : (recipe as any)[field];
    } catch {
      return (recipe as any)[field];
    }
  };

  return {
    ...recipe,
    title: getString("title"),
    description: getString("description"),
    category: getString("category"),
    difficulty: getString("difficulty") as Recipe["difficulty"],
    tags: getArray("tags"),
    ingredients: getArray("ingredients"),
    steps: getArray("steps"),
  };
}
