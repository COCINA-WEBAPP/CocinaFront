"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RecipeCard } from "./RecipeCard";
import { RecipeFilterPanel, RecipeFilters } from "./RecipeFilterPanel";
import { RecipeSortDropdown, SortOption } from "./RecipeSortDropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_RECIPES } from "@/lib/data/recipes";
import { Recipe } from "@/lib/types/recipes";



export function RecipeCatalogue() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [filters, setFilters] = useState<RecipeFilters>({
    categories: [],
    cookTime: [0, 180],
    calories: [0, 800],
    difficulty: [],
    rating: 0,
    servings: [1, 12],
  });

  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return MOCK_RECIPES.filter((recipe) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(query)) ||
          recipe.category.toLowerCase().includes(query);
        
        if (!matchesSearch) {
          return false;
        }
      }

      // Category filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(recipe.category)
      ) {
        return false;
      }

      // Cook time filter
      if (
        recipe.cookTime < filters.cookTime[0] ||
        recipe.cookTime > filters.cookTime[1]
      ) {
        return false;
      }

      // Difficulty filter
      if (
        filters.difficulty.length > 0 &&
        !filters.difficulty.includes(recipe.difficulty)
      ) {
        return false;
      }

      // Rating filter
      if (recipe.rating < filters.rating) {
        return false;
      }

      // Calories filter
      if (
        recipe.calories < filters.calories[0] ||
        recipe.calories > filters.calories[1]
      ) {
        return false;
      }

      // Servings filter
      if (
        recipe.servings < filters.servings[0] ||
        recipe.servings > filters.servings[1]
      ) {
        return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  // Sort recipes
  const sortedRecipes = useMemo(() => {
    const recipes = [...filteredRecipes];

    switch (sortBy) {
      case "rating-high":
        return recipes.sort((a, b) => b.rating - a.rating);
      case "rating-low":
        return recipes.sort((a, b) => a.rating - b.rating);
      case "time-low":
        return recipes.sort((a, b) => a.cookTime - b.cookTime);
      case "time-high":
        return recipes.sort((a, b) => b.cookTime - a.cookTime);
      case "difficulty-easy":
        const difficultyOrder = { Fácil: 1, Intermedio: 2, Difícil: 3 };
        return recipes.sort(
          (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        );
      case "difficulty-hard":
        const difficultyOrderReverse = { Fácil: 3, Intermedio: 2, Difícil: 1 };
        return recipes.sort(
          (a, b) =>
            difficultyOrderReverse[a.difficulty] -
            difficultyOrderReverse[b.difficulty]
        );
      case "newest":
        return recipes.filter((r) => r.isNew).concat(recipes.filter((r) => !r.isNew));
      case "relevance":
      default:
        // Featured first, then by rating
        return recipes
          .filter((r) => r.isFeatured)
          .concat(recipes.filter((r) => !r.isFeatured));
    }
  }, [filteredRecipes, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      cookTime: [0, 180],
      calories: [0, 800],
      difficulty: [],
      rating: 0,
      servings: [1, 12],
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedRecipes.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedRecipes = sortedRecipes.slice(
    startIndex,
    startIndex + pageSize
  );

  const pageButtons = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (safePage > 2) pages.push("ellipsis");

    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);

    if (safePage < totalPages - 1) pages.push("ellipsis");

    pages.push(totalPages);
    return pages;
  }, [safePage, totalPages]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Descubre Recetas Increíbles
        </h1>
        <p className="text-lg text-muted-foreground">
          Explora miles de recetas compartidas por cocineros de todo el mundo
        </p>
      </motion.div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop Filter Panel */}
        <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
          <RecipeFilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Mobile Filter Button */}
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <RecipeFilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    onReset={handleResetFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground">
              Mostrando {paginatedRecipes.length} de {sortedRecipes.length} recetas
            </p>

            {/* Sort Dropdown */}
            <RecipeSortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Recipe Grid */}
          {sortedRecipes.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {paginatedRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="mb-4 text-xl font-semibold">
                No se encontraron recetas
              </p>
              <p className="mb-6 text-muted-foreground">
                Intenta ajustar tus filtros para ver más resultados
              </p>
              <Button onClick={handleResetFilters}>Limpiar Filtros</Button>
            </motion.div>
          )}

          {sortedRecipes.length > pageSize && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage === 1}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {pageButtons.map((page, index) =>
                page === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={page === safePage ? "default" : "outline"}
                    className={page === safePage ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={safePage === totalPages}
                aria-label="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}