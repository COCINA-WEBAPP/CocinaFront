"use client";

import { useParams } from "next/navigation";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { MOCK_RECIPES } from "@/lib/data/recipes";

export default function RecipePage() {
  const params = useParams();
  const recipeId = params.id as string;

  // Buscar la receta por ID
  const recipe = MOCK_RECIPES.find(r => r.id === recipeId);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Receta no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="relative w-full h-[600px] overflow-hidden rounded-lg">
          <ImageWithFallback
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
