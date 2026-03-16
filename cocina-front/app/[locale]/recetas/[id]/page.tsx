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
import { Clock, Users, ChefHat, Star, Heart, Share2, Printer, Flame, Pencil, Trash2, Tag, X, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageCarousel } from "./components/ImageCarousel";
import { Comments } from "./components/Comments";
import { Reseñas } from "./components/Reseñas";
import type { Recipe } from "@/lib/types/recipes";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getCurrentUser, saveRecipe, unsaveRecipe, isRecipeSaved } from "@/lib/services/user";
import { deleteRecipe, getUserTags, addTagToRecipe, removeTagFromRecipe } from "@/lib/services/recipe";
import { addRecipeToShoppingList, isRecipeInShoppingList } from "@/lib/services/shopping-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveRecipeUser, getInitials, getAvatarSrc } from "@/lib/services/recipe-user";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function RecipePage() {
  const t = useTranslations("Recipe");
  const tCard = useTranslations("RecipeCard");
  const params = useParams();
  const router = useRouter();
  const recipeId = (params as any).id as string; // ajusta si usas slug
  const [isSaved, setIsSaved] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [recipeTags, setRecipeTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [inShoppingList, setInShoppingList] = useState(false);

  useEffect(() => {
    getCurrentUser();
    setIsSaved(isRecipeSaved(recipeId));
    setInShoppingList(isRecipeInShoppingList(recipeId));
  }, [recipeId]);

  const recipe: Recipe | undefined = MOCK_RECIPES.find((r) => r.id === recipeId || r.slug === recipeId);

  useEffect(() => {
    if (recipe) {
      setRecipeTags([...recipe.tags]);
      setAvailableTags(getUserTags().filter((tag) => !recipe.tags.includes(tag)));
    }
  }, [recipe?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddTag = async (tag: string) => {
    try {
      await addTagToRecipe(recipeId, tag);
      setRecipeTags((prev) => [...prev, tag]);
      setAvailableTags((prev) => prev.filter((t) => t !== tag));
      toast.success(t("tagAdded"));
    } catch (error) {
      if (error instanceof Error && error.message === "La receta ya tiene esta etiqueta") {
        toast.error(t("tagDuplicate"));
      } else {
        toast.error(t("tagError"));
      }
    }
  };

  const handleRemoveTag = async (tag: string) => {
    try {
      await removeTagFromRecipe(recipeId, tag);
      const updatedRecipeTags = recipeTags.filter((t) => t !== tag);
      setRecipeTags(updatedRecipeTags);
      setAvailableTags(getUserTags().filter((t) => !updatedRecipeTags.includes(t)));
      toast.success(t("tagRemoved"));
    } catch {
      toast.error(t("tagRemoveError"));
    }
  };

  const handleAddToShoppingList = () => {
    if (!recipe) return;
    addRecipeToShoppingList(recipeId, recipe.title, recipe.ingredients);
    setInShoppingList(true);
    toast.success(t("addedToShoppingList"));
  };

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

  const currentUser = getCurrentUser();
  const isAuthor = currentUser?.username === recipe.author.username;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRecipe(recipeId);
      toast.success(t("recipeDeleted"));
      router.push("/Explorar");
    } catch {
      toast.error(t("deleteError"));
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
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
            <Button
              onClick={handleAddToShoppingList}
              variant={inShoppingList ? "default" : "outline"}
            >
              <ShoppingCart className={`mr-2 h-4 w-4 ${inShoppingList ? "fill-current" : ""}`} />
              {inShoppingList ? t("alreadyInShoppingList") : t("shoppingList")}
            </Button>
            {isAuthor && (
              <>
                <Link href={`/recetas/${recipeId}/editar`}>
                  <Button variant="outline">
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("edit")}
                  </Button>
                </Link>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("delete")}
                </Button>
              </>
            )}
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
              {(recipeTags.length > 0 || isAuthor) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      {t("tags")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recipeTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {recipeTags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            {isAuthor && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-0.5 rounded-full hover:bg-destructive/20 hover:text-destructive"
                                aria-label={t("removeTag")}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {isAuthor && availableTags.length > 0 && (
                      <Select onValueChange={handleAddTag}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("addTag")} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTags.map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDelete")}</DialogTitle>
            <DialogDescription>{t("confirmDeleteDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
