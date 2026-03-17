"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getAllRecipes } from "@/lib/services/recipe";
import { getRecipeReviews } from "@/lib/services/recipe";
import type { User as AppUser } from "@/lib/types/users";

interface TopRecetasProps {
  user: AppUser;
}

export function TopRecetas({ user }: TopRecetasProps) {
  const topRecipes = useMemo(() => {
    return getAllRecipes()
      .filter((r) => r.author.username === user.username)
      .map((r) => {
        const reviews = getRecipeReviews(r.id);
        const avg = reviews.length > 0
          ? reviews.reduce((sum, rv) => sum + rv.rating, 0) / reviews.length
          : r.rating; // fallback to initial rating
        return { ...r, avgRating: avg, reviewCount: reviews.length };
      })
      .filter((r) => r.reviewCount > 0 || r.avgRating > 0)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);
  }, [user.username]);

  if (topRecipes.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-3">
        <Star size={18} className="fill-yellow-400 text-yellow-400" />
        Mis Recetas Top
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {topRecipes.map((recipe) => (
          <Link key={recipe.id} href={`/recetas/${recipe.id}`}>
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 hover:border-[#2d6a4f] hover:bg-[#f0faf5] transition-colors cursor-pointer">
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {recipe.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={recipe.images[0]} alt={recipe.title}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              {/* Info */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-1">{recipe.title}</p>
                <p className="flex items-center gap-1 text-xs text-yellow-500 font-semibold mt-0.5">
                  <Star size={11} className="fill-yellow-400 text-yellow-400" />
                  {recipe.avgRating.toFixed(1)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}