import { describe, it, expect } from "vitest";

/**
 * Tests for the filter/sort logic used by RecipeCatalogue.
 * We test the pure data structures and sort/filter algorithms
 * without rendering React components.
 */

// ── RecipeFilters type and DEFAULT values ──

interface RecipeFilters {
  tag: string | null;
  categories: string[];
  cookTime: [number, number];
  calories: [number, number];
  protein: [number, number];
  difficulty: string[];
  rating: number;
  servings: [number, number];
}

const DEFAULT_FILTERS: RecipeFilters = {
  tag: null,
  categories: [],
  cookTime: [0, 180],
  calories: [0, 800],
  protein: [0, 100],
  difficulty: [],
  rating: 0,
  servings: [1, 12],
};

// ── Active filters count logic (from RecipeFilterPanel) ──

function getActiveFiltersCount(filters: RecipeFilters): number {
  let count = 0;
  if (filters.tag) count += 1;
  if (filters.categories.length > 0) count += filters.categories.length;
  if (filters.difficulty.length > 0) count += filters.difficulty.length;
  if (filters.rating > 0) count += 1;
  if (filters.cookTime[0] !== 0 || filters.cookTime[1] !== 180) count += 1;
  if (filters.calories[0] !== 0 || filters.calories[1] !== 800) count += 1;
  if (filters.protein[0] !== 0 || filters.protein[1] !== 100) count += 1;
  if (filters.servings[0] !== 1 || filters.servings[1] !== 12) count += 1;
  return count;
}

// ── Sort options ──

type SortOption =
  | "relevance"
  | "rating-high"
  | "rating-low"
  | "time-low"
  | "time-high"
  | "difficulty-easy"
  | "difficulty-hard"
  | "newest";

const ALL_SORT_OPTIONS: SortOption[] = [
  "relevance", "rating-high", "rating-low",
  "time-low", "time-high",
  "difficulty-easy", "difficulty-hard",
  "newest",
];

// ── Mock recipe for filter tests ──

interface MockRecipe {
  id: string;
  title: string;
  tags: string[];
  category: string;
  cookTime: number;
  calories: number;
  protein: number;
  difficulty: string;
  rating: number;
  servings: number;
  isFeatured: boolean;
  isNew: boolean;
}

const MOCK_RECIPES: MockRecipe[] = [
  { id: "1", title: "Ensalada", tags: ["Saludable"], category: "Ensalada", cookTime: 10, calories: 200, protein: 5, difficulty: "Fácil", rating: 4.5, servings: 2, isFeatured: true, isNew: false },
  { id: "2", title: "Pasta Carbonara", tags: ["Italiana"], category: "Cena", cookTime: 30, calories: 600, protein: 25, difficulty: "Intermedio", rating: 4.0, servings: 4, isFeatured: false, isNew: true },
  { id: "3", title: "Sushi", tags: ["Japonesa"], category: "Cena", cookTime: 90, calories: 350, protein: 30, difficulty: "Difícil", rating: 4.8, servings: 6, isFeatured: false, isNew: false },
];

function filterRecipes(recipes: MockRecipe[], filters: RecipeFilters, searchQuery = ""): MockRecipe[] {
  return recipes.filter((recipe) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        recipe.title.toLowerCase().includes(q) ||
        recipe.tags.some((t) => t.toLowerCase().includes(q)) ||
        recipe.category.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (filters.tag && !recipe.tags.includes(filters.tag)) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(recipe.category)) return false;
    if (recipe.cookTime < filters.cookTime[0] || recipe.cookTime > filters.cookTime[1]) return false;
    if (recipe.calories < filters.calories[0] || recipe.calories > filters.calories[1]) return false;
    const protein = recipe.protein ?? 0;
    if (protein < filters.protein[0] || protein > filters.protein[1]) return false;
    if (filters.difficulty.length > 0 && !filters.difficulty.includes(recipe.difficulty)) return false;
    if (recipe.rating < filters.rating) return false;
    if (recipe.servings < filters.servings[0] || recipe.servings > filters.servings[1]) return false;
    return true;
  });
}

function sortRecipes(recipes: MockRecipe[], sortBy: SortOption): MockRecipe[] {
  const sorted = [...recipes];
  switch (sortBy) {
    case "rating-high":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "rating-low":
      return sorted.sort((a, b) => a.rating - b.rating);
    case "time-low":
      return sorted.sort((a, b) => a.cookTime - b.cookTime);
    case "time-high":
      return sorted.sort((a, b) => b.cookTime - a.cookTime);
    case "difficulty-easy": {
      const order: Record<string, number> = { "Fácil": 1, "Intermedio": 2, "Difícil": 3 };
      return sorted.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    }
    case "difficulty-hard": {
      const order: Record<string, number> = { "Fácil": 3, "Intermedio": 2, "Difícil": 1 };
      return sorted.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    }
    case "newest":
      return sorted.filter((r) => r.isNew).concat(sorted.filter((r) => !r.isNew));
    case "relevance":
    default:
      return sorted.filter((r) => r.isFeatured).concat(sorted.filter((r) => !r.isFeatured));
  }
}

// ─── Tests ───

describe("Active filters count", () => {
  it("returns 0 for default filters", () => {
    expect(getActiveFiltersCount(DEFAULT_FILTERS)).toBe(0);
  });

  it("counts tag filter", () => {
    expect(getActiveFiltersCount({ ...DEFAULT_FILTERS, tag: "Saludable" })).toBe(1);
  });

  it("counts each selected category", () => {
    expect(getActiveFiltersCount({ ...DEFAULT_FILTERS, categories: ["Cena", "Postre"] })).toBe(2);
  });

  it("counts difficulty selections", () => {
    expect(getActiveFiltersCount({ ...DEFAULT_FILTERS, difficulty: ["Fácil"] })).toBe(1);
  });

  it("counts rating when above 0", () => {
    expect(getActiveFiltersCount({ ...DEFAULT_FILTERS, rating: 3 })).toBe(1);
  });

  it("counts changed cook time range", () => {
    expect(getActiveFiltersCount({ ...DEFAULT_FILTERS, cookTime: [10, 60] })).toBe(1);
  });

  it("counts multiple active filters together", () => {
    const filters: RecipeFilters = {
      ...DEFAULT_FILTERS,
      tag: "Saludable",
      categories: ["Cena"],
      rating: 4,
      cookTime: [0, 60],
    };
    expect(getActiveFiltersCount(filters)).toBe(4);
  });
});

describe("Recipe filtering", () => {
  it("returns all recipes with default filters", () => {
    const result = filterRecipes(MOCK_RECIPES, DEFAULT_FILTERS);
    expect(result.length).toBe(3);
  });

  it("filters by tag", () => {
    const result = filterRecipes(MOCK_RECIPES, { ...DEFAULT_FILTERS, tag: "Italiana" });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("2");
  });

  it("filters by category", () => {
    const result = filterRecipes(MOCK_RECIPES, { ...DEFAULT_FILTERS, categories: ["Cena"] });
    expect(result.length).toBe(2);
  });

  it("filters by cook time range", () => {
    const result = filterRecipes(MOCK_RECIPES, { ...DEFAULT_FILTERS, cookTime: [0, 30] });
    expect(result.length).toBe(2);
    expect(result.every((r) => r.cookTime <= 30)).toBe(true);
  });

  it("filters by calories range", () => {
    const result = filterRecipes(MOCK_RECIPES, { ...DEFAULT_FILTERS, calories: [0, 300] });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("1");
  });

  it("filters by protein range", () => {
    const result = filterRecipes(MOCK_RECIPES, { ...DEFAULT_FILTERS, protein: [20, 100] });
    expect(result.length).toBe(2);
  });

  it("filters by difficulty", () => {
    const result = filterRecipes(MOCK_RECIPES, { ...DEFAULT_FILTERS, difficulty: ["Difícil"] });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("3");
  });

  it("filters by minimum rating", () => {
    const result = filterRecipes(MOCK_RECIPES, { ...DEFAULT_FILTERS, rating: 4.5 });
    expect(result.length).toBe(2);
  });

  it("filters by servings range", () => {
    const result = filterRecipes(MOCK_RECIPES, { ...DEFAULT_FILTERS, servings: [4, 12] });
    expect(result.length).toBe(2);
  });

  it("filters by search query", () => {
    const result = filterRecipes(MOCK_RECIPES, DEFAULT_FILTERS, "pasta");
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("2");
  });

  it("search matches tags", () => {
    const result = filterRecipes(MOCK_RECIPES, DEFAULT_FILTERS, "japonesa");
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("3");
  });

  it("combines multiple filters", () => {
    const result = filterRecipes(MOCK_RECIPES, {
      ...DEFAULT_FILTERS,
      categories: ["Cena"],
      difficulty: ["Difícil"],
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("3");
  });
});

describe("Recipe sorting", () => {
  it("sorts by rating-high", () => {
    const sorted = sortRecipes(MOCK_RECIPES, "rating-high");
    expect(sorted[0].id).toBe("3"); // 4.8
    expect(sorted[1].id).toBe("1"); // 4.5
    expect(sorted[2].id).toBe("2"); // 4.0
  });

  it("sorts by rating-low", () => {
    const sorted = sortRecipes(MOCK_RECIPES, "rating-low");
    expect(sorted[0].id).toBe("2"); // 4.0
  });

  it("sorts by time-low (fastest first)", () => {
    const sorted = sortRecipes(MOCK_RECIPES, "time-low");
    expect(sorted[0].id).toBe("1"); // 10 min
    expect(sorted[2].id).toBe("3"); // 90 min
  });

  it("sorts by time-high (slowest first)", () => {
    const sorted = sortRecipes(MOCK_RECIPES, "time-high");
    expect(sorted[0].id).toBe("3"); // 90 min
  });

  it("sorts by difficulty-easy", () => {
    const sorted = sortRecipes(MOCK_RECIPES, "difficulty-easy");
    expect(sorted[0].difficulty).toBe("Fácil");
    expect(sorted[2].difficulty).toBe("Difícil");
  });

  it("sorts by difficulty-hard", () => {
    const sorted = sortRecipes(MOCK_RECIPES, "difficulty-hard");
    expect(sorted[0].difficulty).toBe("Difícil");
    expect(sorted[2].difficulty).toBe("Fácil");
  });

  it("newest puts isNew items first", () => {
    const sorted = sortRecipes(MOCK_RECIPES, "newest");
    expect(sorted[0].isNew).toBe(true);
  });

  it("relevance puts featured items first", () => {
    const sorted = sortRecipes(MOCK_RECIPES, "relevance");
    expect(sorted[0].isFeatured).toBe(true);
  });

  it("has all 8 sort options", () => {
    expect(ALL_SORT_OPTIONS.length).toBe(8);
  });
});
