"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RecipeCard } from "./RecipeCard";
import { RecipeFilterPanel, RecipeFilters } from "./RecipeFilterPanel";
import { RecipeSortDropdown, SortOption } from "./RecipeSortDropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight, Filter, Search, Store, X } from "lucide-react";
import { motion } from "framer-motion";
import { getAllRecipes } from "@/lib/services/recipe";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { localizeRecipe } from "@/lib/services/recipe-i18n";
import { BrandSearch } from "@/components/BrandSearch";
import type { Brand } from "@/lib/data/brands";

const DEFAULT_FILTERS: RecipeFilters = {
  tag: null,
  categories: [],
  cookTime:  [0, 180],
  calories:  [0, 800],
  protein:   [0, 100],
  difficulty: [],
  rating: 0,
  servings: [1, 12],
};

export function RecipeCatalogue() {
  const t = useTranslations("Explore");
  const tHeader = useTranslations("Header");
  const tRecipes = useTranslations("Recipes");
  const tBrand = useTranslations("BrandSearch");
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [mobileSearch, setMobileSearch] = useState(searchQuery);

  const [filters, setFilters] = useState<RecipeFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchMode, setSearchMode] = useState<"recipe" | "brand">("recipe");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const pageSize = 9;

  const rawRecipes = getAllRecipes();
  const allRecipes = useMemo(
    () => rawRecipes.map((r) => localizeRecipe(r, tRecipes as any)),
    [rawRecipes, tRecipes]
  );

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const r of allRecipes) {
      for (const tag of r.tags) tagSet.add(tag);
    }
    return Array.from(tagSet).sort();
  }, [allRecipes]);

  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      // Brand filter
      if (searchMode === "brand" && selectedBrand) {
        const kws = selectedBrand.ingredientKeywords.map((k) => k.toLowerCase());
        const hasMatch = recipe.ingredients.some((ing) => {
          const ingLower = ing.toLowerCase();
          return kws.some((kw) => ingLower.includes(kw));
        });
        if (!hasMatch) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          recipe.category.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (filters.tag && !recipe.tags.includes(filters.tag)) return false;

      if (filters.categories.length > 0 && !filters.categories.includes(recipe.category))
        return false;

      if (recipe.cookTime < filters.cookTime[0] || recipe.cookTime > filters.cookTime[1])
        return false;

      if (recipe.calories < filters.calories[0] || recipe.calories > filters.calories[1])
        return false;

      const protein = recipe.protein ?? 0;
      if (protein < filters.protein[0] || protein > filters.protein[1])
        return false;

      if (filters.difficulty.length > 0 && !filters.difficulty.includes(recipe.difficulty))
        return false;

      if (recipe.rating < filters.rating) return false;

      if (recipe.servings < filters.servings[0] || recipe.servings > filters.servings[1])
        return false;

      return true;
    });
  }, [allRecipes, filters, searchQuery, searchMode, selectedBrand]);

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
      case "difficulty-easy": {
        const order = { Fácil: 1, Intermedio: 2, Difícil: 3 };
        return recipes.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
      }
      case "difficulty-hard": {
        const order = { Fácil: 3, Intermedio: 2, Difícil: 1 };
        return recipes.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
      }
      case "newest":
        return recipes.filter((r) => r.isNew).concat(recipes.filter((r) => !r.isNew));
      case "relevance":
      default:
        return recipes.filter((r) => r.isFeatured).concat(recipes.filter((r) => !r.isFeatured));
    }
  }, [filteredRecipes, sortBy]);

  const handleResetFilters = () => setFilters(DEFAULT_FILTERS);

  useEffect(() => { setMobileSearch(searchQuery); }, [searchQuery]);
  useEffect(() => { setCurrentPage(1); }, [filters, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedRecipes.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedRecipes = sortedRecipes.slice(startIndex, startIndex + pageSize);

  const pageButtons = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 3;
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (safePage > 2) pages.push("ellipsis");
    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (safePage < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  }, [safePage, totalPages]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      </motion.div>

      {/* Search mode toggle + brand search */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => { setSearchMode("recipe"); setSelectedBrand(null); }}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              searchMode === "recipe"
                ? "bg-[#2d6a4f] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Search size={14} />
            {tBrand("byRecipe")}
          </button>
          <button
            onClick={() => setSearchMode("brand")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              searchMode === "brand"
                ? "bg-[#2d6a4f] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Store size={14} />
            {tBrand("byBrand")}
          </button>
        </div>

        {searchMode === "brand" && (
          <div className="max-w-md mx-auto w-full">
            <BrandSearch
              onSelect={(brand) => { setSelectedBrand(brand); setCurrentPage(1); }}
              onClear={() => setSelectedBrand(null)}
              selectedBrand={selectedBrand}
            />
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); router.push(`/Explorar?search=${encodeURIComponent(mobileSearch)}`); }}
        className="md:hidden mb-6 relative flex items-center gap-2 rounded-xl border border-[#e07b39]/30 bg-white shadow-sm px-3 py-1.5"
      >
        <Search className="h-5 w-5 text-[#e07b39] flex-shrink-0" />
        <input
          type="text"
          placeholder={tHeader("searchPlaceholder")}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 py-2"
          value={mobileSearch}
          onChange={(e) => setMobileSearch(e.target.value)}
        />
        {mobileSearch && (
          <button type="button" onClick={() => { setMobileSearch(""); router.push("/Explorar"); }}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
          <RecipeFilterPanel filters={filters} onFiltersChange={setFilters} onReset={handleResetFilters} availableTags={allTags} />
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="mr-2 h-4 w-4" />{t("filters")}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader><SheetTitle>{t("filters")}</SheetTitle></SheetHeader>
                <div className="mt-6">
                  <RecipeFilterPanel filters={filters} onFiltersChange={setFilters} onReset={handleResetFilters} availableTags={allTags} />
                </div>
              </SheetContent>
            </Sheet>

            <p className="text-sm text-muted-foreground">
              {t("showingResults", { showing: paginatedRecipes.length, total: sortedRecipes.length })}
            </p>
            <RecipeSortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {sortedRecipes.length > 0 ? (
            <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {paginatedRecipes.map((recipe, index) => (
                <motion.div key={recipe.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}>
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div className="flex flex-col items-center justify-center py-16 text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="mb-4 text-xl font-semibold">{t("noRecipesFound")}</p>
              <p className="mb-6 text-muted-foreground">{t("noRecipesHint")}</p>
              <Button onClick={handleResetFilters}>{t("clearFilters")}</Button>
            </motion.div>
          )}

          {sortedRecipes.length > pageSize && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Button variant="outline" size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1} aria-label={t("previousPage")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {pageButtons.map((page, index) =>
                page === "ellipsis" ? (
                  <span key={`e-${index}`} className="px-2 text-muted-foreground">...</span>
                ) : (
                  <Button key={page}
                    variant={page === safePage ? "default" : "outline"}
                    className={page === safePage ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => setCurrentPage(page)}>
                    {page}
                  </Button>
                )
              )}
              <Button variant="outline" size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages} aria-label={t("nextPage")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}