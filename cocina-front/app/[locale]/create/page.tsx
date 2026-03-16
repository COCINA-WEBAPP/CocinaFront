"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/services/user";
import { createRecipe, getUserTags } from "@/lib/services/recipe";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { RecipeForm } from "./components/RecipeForm";
import type { CreateRecipeData } from "@/lib/types/recipes";

export default function CreateRecipePage() {
  const t = useTranslations("RecipeForm");
  const tAccount = useTranslations("Account");
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userTags, setUserTags] = useState<string[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    setIsAuthenticated(!!user);
    if (user) {
      setUserTags(getUserTags());
    }
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return (
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
    );
  }

  const handleSubmit = async (data: CreateRecipeData) => {
    setError("");
    setIsLoading(true);

    try {
      const recipe = await createRecipe(data);
      toast.success(t("recipeCreated"));
      router.push(`/recetas/${recipe.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("createError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("createTitle")}</h1>
        <p className="text-muted-foreground mt-2">{t("createSubtitle")}</p>
      </div>

      <RecipeForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        submitLabel={t("publishRecipe")}
        submittingLabel={t("publishing")}
        userTags={userTags}
      />
    </div>
  );
}
