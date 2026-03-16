"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { getCurrentUser } from "@/lib/services/user";
import { getRecipeById, updateRecipe, getUserTags } from "@/lib/services/recipe";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { RecipeForm } from "../../../create/components/RecipeForm";
import type { Recipe, CreateRecipeData } from "@/lib/types/recipes";

export default function EditRecipePage() {
  const t = useTranslations("RecipeForm");
  const tAccount = useTranslations("Account");
  const tRecipe = useTranslations("Recipe");
  const router = useRouter();
  const params = useParams();
  const recipeId = (params as { id: string }).id;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userTags, setUserTags] = useState<string[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    const found = getRecipeById(recipeId);

    if (!user) {
      setIsAuthorized(false);
      return;
    }

    if (!found) {
      setRecipe(null);
      setIsAuthorized(true);
      return;
    }

    if (found.author.username !== user.username) {
      setIsAuthorized(false);
      return;
    }

    setRecipe(found);
    setIsAuthorized(true);
    setUserTags(getUserTags());
  }, [recipeId]);

  if (isAuthorized === null) {
    return null;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-16 flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle>{tAccount("notLoggedIn")}</CardTitle>
                <CardDescription>{tAccount("loginRequired")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/login")}>{tAccount("goToLogin")}</Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 pb-20 md:pb-0 flex items-center justify-center">
          <p className="text-muted-foreground">{tRecipe("notFound")}</p>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  const handleSubmit = async (data: CreateRecipeData) => {
    setError("");
    setIsLoading(true);

    try {
      await updateRecipe(recipeId, data);
      toast.success(t("recipeUpdated"));
      router.push(`/recetas/${recipeId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("updateError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{t("editTitle")}</h1>
            <p className="text-muted-foreground mt-2">{t("editSubtitle")}</p>
          </div>

          <RecipeForm
            initialData={{
              title: recipe.title,
              description: recipe.description,
              category: recipe.category,
              cookTime: recipe.cookTime,
              calories: recipe.calories,
              servings: recipe.servings,
              difficulty: recipe.difficulty,
              ingredients: recipe.ingredients,
              tags: recipe.tags,
              images: recipe.images,
            }}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            submitLabel={t("saveChanges")}
            submittingLabel={t("saving")}
            userTags={userTags}
          />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
