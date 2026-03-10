// app/recetas/[id]/page.tsx
"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useParams } from "next/navigation";
import { MOCK_RECIPES } from "@/lib/data/recipes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, ChefHat, Star, Heart, Share2, Printer, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ImageCarousel } from "./components/ImageCarousel";
import { Comments } from "./components/Comments";
import { Reseñas } from "./components/Reseñas";
import type { Recipe } from "@/lib/types/recipes";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getCurrentUser, saveRecipe, unsaveRecipe, isRecipeSaved } from "@/lib/services/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveRecipeUser, getInitials, getAvatarSrc } from "@/lib/services/recipe-user";

export default function RecipePage() {
  const t = useTranslations("Recipe");
  const tCard = useTranslations("RecipeCard");
  const params = useParams();
  const recipeId = (params as any).id as string; // ajusta si usas slug
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    getCurrentUser();
    setIsSaved(isRecipeSaved(recipeId));
  }, [recipeId]);

  const recipe: Recipe | undefined = MOCK_RECIPES.find((r) => r.id === recipeId || r.slug === recipeId);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main id="main-content" className="flex flex-1 items-center justify-center pb-20 md:pb-0">
          <p className="text-muted-foreground">{t("notFound")}</p>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  const handleSave = async () => {
    const user = getCurrentUser();
    if (!user) {
      toast.error(t("loginToSave"));
      return;
    }

    try {
      if (isSaved) {
        await unsaveRecipe(recipeId);
        setIsSaved(false);
        toast.success(t("unsavedSuccess"));
      } else {
        await saveRecipe(recipeId);
        setIsSaved(true);
        toast.success(t("savedSuccess"));
      }
    } catch {
      toast.error(t("favoriteError"));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t("linkCopied"));
  };

  const handlePrint = () => {
    window.print();
  };

  const [reviews, setReviews] = useState(recipe.reviews);
  const resolvedAuthor = resolveRecipeUser(recipe.author);
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : recipe.rating;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {/* pb-20 en móvil para evitar que el contenido quede detrás del MobileBottomNav */}
      <main id="main-content" className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header Carousel */}
          <div className="relative mb-8">
            <ImageCarousel images={Array.isArray(recipe.images) && recipe.images.length > 0 ? recipe.images : [""]} height="h-[400px]" />
            {/* Badges on image overlay handled by the carousel container */}
            <div className="absolute left-4 top-4 flex gap-2">
              {recipe.isNew && <Badge className="bg-blue-500 text-white">{tCard("new")}</Badge>}
              {recipe.isFeatured && <Badge className="bg-purple-500 text-white">{tCard("featured")}</Badge>}
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
              <h1 className="mb-2 text-4xl font-bold md:text-5xl">{recipe.title}</h1>
              <p className="text-lg opacity-90">{recipe.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap gap-3">
            <Button onClick={handleSave} variant={isSaved ? "default" : "outline"}>
              <Heart className={`mr-2 h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? t("saved") : t("save")}
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              {t("share")}
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              {t("print")}
            </Button> 
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recipe Info Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                    <div className="flex flex-col items-center rounded-lg border p-4">
                      <Clock className="mb-2 h-6 w-6 text-primary" />
                      <span className="text-sm text-muted-foreground">{t("time")}</span>
                      <span className="font-semibold">{recipe.cookTime} min</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg border p-4">
                      <Flame className="mb-2 h-6 w-6 text-primary" />
                      <span className="text-sm text-muted-foreground">{t("calories")}</span>
                      <span className="font-semibold">{recipe.calories} kcal</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg border p-4">
                      <Users className="mb-2 h-6 w-6 text-primary" />
                      <span className="text-sm text-muted-foreground">{t("servings")}</span>
                      <span className="font-semibold">{recipe.servings}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg border p-4">
                      <ChefHat className="mb-2 h-6 w-6 text-primary" />
                      <span className="text-sm text-muted-foreground">{t("difficulty")}</span>
                      <span className="font-semibold">{recipe.difficulty}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg border p-4">
                      <Star className="mb-2 h-6 w-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{t("rating")}</span>
                      <span className="font-semibold">{avgRating.toFixed(1)}/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Author Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Link href={`/perfil/${recipe.author.username}`} aria-label={t("goToProfile", { name: recipe.author.fullName })}>
                      <Avatar size="lg">
                        <AvatarImage src={getAvatarSrc(recipe.author.fullName, resolvedAuthor?.avatar)} alt={recipe.author.fullName} />
                        <AvatarFallback>{getInitials(recipe.author.fullName)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("createdBy")}</p>
                      <Link
                        href={`/perfil/${recipe.author.username}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {recipe.author.fullName}
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ingredients */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    {t("ingredients")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Reseñas
                initialReviews={reviews}
                onChange={(next) => {
                  setReviews(next);
                }}
              />

              {/* Comments (component) */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("comments")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Comments initialComments={recipe.comments} onChange={(next) => {
                    // opcional: persistir cambios en BACKEND aquí
                    console.log("Comentarios actualizados (mock):", next);
                  }} />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("category")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-base">
                    {recipe.category}
                  </Badge>
                </CardContent>
              </Card>

              {/* Tags */}
              {recipe.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("tags")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("statistics")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t("avgRating")}</span>
                    <span className="font-semibold">{avgRating.toFixed(1)}/5</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t("totalReviews")}</span>
                    <span className="font-semibold">{reviewCount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t("comments")}</span>
                    <span className="font-semibold">{recipe.comments.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
