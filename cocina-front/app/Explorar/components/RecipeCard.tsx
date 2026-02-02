"use client";

import { useState } from "react";
import { Heart, Clock, ChefHat, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import Link from "next/link";
import { Recipe } from "@/lib/types/recipes";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const reviewCount = recipe.reviews.length;

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted
        ? "Receta eliminada de favoritos"
        : "Receta agregada a favoritos"
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Difícil":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {recipe.isNew && (
          <Badge className="bg-blue-500 text-white hover:bg-blue-600">
            Nuevo
          </Badge>
        )}
        {recipe.isFeatured && (
          <Badge className="bg-purple-500 text-white hover:bg-purple-600">
            Destacado
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-2 shadow-md transition-all duration-200 hover:scale-110 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
        aria-label={isWishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-600 dark:text-gray-300"
          }`}
        />
      </button>

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <ImageWithFallback
          src={recipe.images[0]}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button asChild
            variant="secondary"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Link href={`/recetas/${recipe.id}`}>Ver Receta</Link>
          </Button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {recipe.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight">
          {recipe.title}
        </h3>

        {/* Author */}
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <ChefHat className="h-4 w-4" />
          <span>Por {recipe.author}</span>
        </div>

        {/* Stats */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} porciones</span>
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-3">
          <Badge className={getDifficultyColor(recipe.difficulty)}>
            {recipe.difficulty}
          </Badge>
        </div>

        {/* Rating */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(recipe.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{recipe.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">
            ({reviewCount})
          </span>
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Button */}
        <Button asChild className="mt-auto w-full">
          <Link href={`/recetas/${recipe.id}`}>Ver Receta Completa</Link>
        </Button>
      </div>
    </motion.div>
  );
}