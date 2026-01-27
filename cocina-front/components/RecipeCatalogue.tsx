"use client";

import { useState, useMemo } from "react";
import { RecipeCard, Recipe } from "@/components/RecipeCard";
import { RecipeFilterPanel, RecipeFilters } from "@/components/RecipeFilterPanel";
import { RecipeSortDropdown, SortOption } from "@/components/RecipeSortDropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

// Mock data de recetas
const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Pancakes Esponjosos con Miel",
    description: "Pancakes perfectos para empezar el día",
    image: "https://images.unsplash.com/photo-1619592982310-7b7d51e4207f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5jYWtlcyUyMGJyZWFrZmFzdCUyMHN5cnVwfGVufDF8fHx8MTc2OTQ5MzgwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    author: "María González",
    cookTime: 20,
    difficulty: "Fácil",
    servings: 4,
    rating: 4.8,
    reviews: 152,
    category: "Desayuno",
    tags: ["Dulce", "Rápido", "Clásico"],
    isNew: true,
    ingredients: 8,
  },
  {
    id: "2",
    title: "Pasta Carbonara Auténtica",
    description: "Receta tradicional italiana con huevo y panceta",
    image: "https://images.unsplash.com/photo-1655662844229-d2c2a81f09ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYSUyMGl0YWxpYW58ZW58MXx8fHwxNzY5NDkwOTg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Carlos Rossi",
    cookTime: 25,
    difficulty: "Intermedio",
    servings: 4,
    rating: 4.9,
    reviews: 234,
    category: "Almuerzo",
    tags: ["Italiana", "Pasta", "Cremosa"],
    isFeatured: true,
    ingredients: 6,
  },
  {
    id: "3",
    title: "Torta de Chocolate Decadente",
    description: "Irresistible postre de chocolate para ocasiones especiales",
    image: "https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3Njk0NzkxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Ana Martínez",
    cookTime: 60,
    difficulty: "Difícil",
    servings: 8,
    rating: 5.0,
    reviews: 189,
    category: "Postre",
    tags: ["Chocolate", "Cumpleaños", "Especial"],
    isFeatured: true,
    ingredients: 12,
  },
  {
    id: "4",
    title: "Ensalada Mediterránea Fresca",
    description: "Saludable y deliciosa ensalada con ingredientes frescos",
    image: "https://images.unsplash.com/photo-1677653805080-59c57727c84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3Njk0OTYwNDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Laura Sánchez",
    cookTime: 15,
    difficulty: "Fácil",
    servings: 2,
    rating: 4.6,
    reviews: 98,
    category: "Ensalada",
    tags: ["Saludable", "Vegetariano", "Mediterránea"],
    ingredients: 10,
  },
  {
    id: "5",
    title: "Pollo a la Parrilla con Hierbas",
    description: "Pollo jugoso marinado con hierbas aromáticas",
    image: "https://images.unsplash.com/photo-1496074620649-6b1b02e5c1c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMGRpbm5lcnxlbnwxfHx8fDE3Njk0Nzg1Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Roberto Díaz",
    cookTime: 45,
    difficulty: "Intermedio",
    servings: 4,
    rating: 4.7,
    reviews: 176,
    category: "Cena",
    tags: ["Proteína", "Saludable", "Parrilla"],
    ingredients: 9,
  },
  {
    id: "6",
    title: "Bowl de Smoothie Tropical",
    description: "Energizante bowl de frutas tropicales",
    image: "https://images.unsplash.com/photo-1640126219893-6c869dbe9bd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbW9vdGhpZSUyMGJvd2wlMjBmcnVpdHxlbnwxfHx8fDE3Njk0ODQ0NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Sofia Ramírez",
    cookTime: 10,
    difficulty: "Fácil",
    servings: 1,
    rating: 4.5,
    reviews: 87,
    category: "Desayuno",
    tags: ["Vegano", "Saludable", "Frutas"],
    isNew: true,
    ingredients: 7,
  },
  {
    id: "7",
    title: "Tacos de Carne Asada",
    description: "Auténticos tacos mexicanos con carne marinada",
    image: "https://images.unsplash.com/photo-1599488400918-5f5f96b3f463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwdGFjb3MlMjBtZXhpY2FufGVufDF8fHx8MTc2OTQ4MTI0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Miguel Hernández",
    cookTime: 35,
    difficulty: "Intermedio",
    servings: 6,
    rating: 4.8,
    reviews: 203,
    category: "Cena",
    tags: ["Mexicana", "Carne", "Picante"],
    ingredients: 15,
  },
  {
    id: "8",
    title: "Sushi Rolls Caseros",
    description: "Aprende a hacer sushi en casa con esta receta detallada",
    image: "https://images.unsplash.com/photo-1712183718471-dab51f0748ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJvbGxzJTIwamFwYW5lc2V8ZW58MXx8fHwxNzY5NTE3MTQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Yuki Tanaka",
    cookTime: 50,
    difficulty: "Difícil",
    servings: 4,
    rating: 4.9,
    reviews: 145,
    category: "Almuerzo",
    tags: ["Japonesa", "Pescado", "Gourmet"],
    ingredients: 11,
  },
  {
    id: "9",
    title: "Pizza Margherita Clásica",
    description: "Pizza italiana simple y deliciosa con albahaca fresca",
    image: "https://images.unsplash.com/photo-1573821663912-6df460f9c684?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGElMjBjaGVlc2V8ZW58MXx8fHwxNzY5NTA1MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Giuseppe Bianchi",
    cookTime: 40,
    difficulty: "Intermedio",
    servings: 4,
    rating: 4.7,
    reviews: 167,
    category: "Cena",
    tags: ["Italiana", "Pizza", "Vegetariano"],
    isFeatured: true,
    ingredients: 8,
  },
  {
    id: "10",
    title: "Tiramisú Tradicional",
    description: "El postre italiano más famoso del mundo",
    image: "https://images.unsplash.com/photo-1714385905983-6f8e06fffae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aXJhbWlzdSUyMGRlc3NlcnQlMjBjb2ZmZWV8ZW58MXx8fHwxNzY5NDg1MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Francesca Romano",
    cookTime: 30,
    difficulty: "Intermedio",
    servings: 6,
    rating: 5.0,
    reviews: 221,
    category: "Postre",
    tags: ["Italiana", "Café", "Cremoso"],
    isNew: true,
    ingredients: 7,
  },
  {
    id: "11",
    title: "Sopa de Verduras Casera",
    description: "Reconfortante sopa llena de verduras frescas",
    image: "https://images.unsplash.com/photo-1701109876066-7fc0c08da447?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBzb3VwJTIwYm93bHxlbnwxfHx8fDE3Njk0OTA5OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Elena Torres",
    cookTime: 35,
    difficulty: "Fácil",
    servings: 6,
    rating: 4.4,
    reviews: 112,
    category: "Sopa",
    tags: ["Vegano", "Saludable", "Reconfortante"],
    ingredients: 12,
  },
  {
    id: "12",
    title: "Hamburguesa Gourmet Completa",
    description: "Hamburguesa jugosa con todos los ingredientes",
    image: "https://images.unsplash.com/photo-1643234567681-b28137fb1c33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmcmllcyUyMGFtZXJpY2FufGVufDF8fHx8MTc2OTUxNzE0MXww&ixlib=rb-4.1.0&q=80&w=1080",
    author: "James Cooper",
    cookTime: 30,
    difficulty: "Fácil",
    servings: 4,
    rating: 4.6,
    reviews: 198,
    category: "Almuerzo",
    tags: ["Americana", "Carne", "Clásico"],
    ingredients: 14,
  },
];

export function RecipeCatalogue() {
  const [filters, setFilters] = useState<RecipeFilters>({
    categories: [],
    cookTime: [0, 180],
    difficulty: [],
    rating: 0,
    servings: [1, 12],
  });

  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return MOCK_RECIPES.filter((recipe) => {
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

      // Servings filter
      if (
        recipe.servings < filters.servings[0] ||
        recipe.servings > filters.servings[1]
      ) {
        return false;
      }

      return true;
    });
  }, [filters]);

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
      difficulty: [],
      rating: 0,
      servings: [1, 12],
    });
  };

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
              Mostrando {sortedRecipes.length} de {MOCK_RECIPES.length} recetas
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
              {sortedRecipes.map((recipe, index) => (
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
        </div>
      </div>
    </div>
  );
}