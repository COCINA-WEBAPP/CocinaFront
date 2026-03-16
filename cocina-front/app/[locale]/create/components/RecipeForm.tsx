"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CreateRecipeData } from "@/lib/types/recipes";

const CATEGORIES = [
  "Desayuno", "Almuerzo", "Cena", "Postre", "Aperitivo",
  "Ensalada", "Sopa", "Bebida", "Vegano", "Vegetariano",
];

const DIFFICULTIES = ["Fácil", "Intermedio", "Difícil"] as const;

interface RecipeFormProps {
  initialData?: Partial<CreateRecipeData>;
  onSubmit: (data: CreateRecipeData) => Promise<void>;
  isLoading: boolean;
  error: string;
  submitLabel: string;
  submittingLabel: string;
  userTags?: string[];
}

export function RecipeForm({ initialData, onSubmit, isLoading, error, submitLabel, submittingLabel, userTags = [] }: RecipeFormProps) {
  const t = useTranslations("RecipeForm");

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [cookTime, setCookTime] = useState(initialData?.cookTime?.toString() || "");
  const [calories, setCalories] = useState(initialData?.calories?.toString() || "");
  const [servings, setServings] = useState(initialData?.servings?.toString() || "");
  const [difficulty, setDifficulty] = useState<string>(initialData?.difficulty || "");

  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || [""]);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>(initialData?.images || [""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredIngredients = ingredients.filter((i) => i.trim() !== "");
    const filteredImages = images.filter((i) => i.trim() !== "");

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      cookTime: Number(cookTime) || 0,
      calories: Number(calories) || 0,
      servings: Number(servings) || 1,
      difficulty: difficulty as CreateRecipeData["difficulty"],
      ingredients: filteredIngredients,
      tags,
      images: filteredImages,
    });
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };
  const removeTag = (index: number) => setTags(tags.filter((_, i) => i !== index));

  const addImage = () => setImages([...images, ""]);
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const updateImage = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>{t("basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
              placeholder={t("titlePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              required
              rows={3}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("category")}</Label>
              <Select value={category} onValueChange={setCategory} disabled={isLoading} required>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("difficulty")}</Label>
              <Select value={difficulty} onValueChange={setDifficulty} disabled={isLoading} required>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectDifficulty")} />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((diff) => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cookTime">{t("cookTime")}</Label>
              <Input
                id="cookTime"
                type="number"
                min="1"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                disabled={isLoading}
                required
                placeholder="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">{t("calories")}</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                disabled={isLoading}
                required
                placeholder="350"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="servings">{t("servings")}</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                disabled={isLoading}
                required
                placeholder="4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredientes */}
      <Card>
        <CardHeader>
          <CardTitle>{t("ingredients")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
                disabled={isLoading}
                placeholder={t("ingredientPlaceholder")}
              />
              {ingredients.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)} disabled={isLoading}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addIngredient} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addIngredient")}
          </Button>
        </CardContent>
      </Card>

      {/* Etiquetas */}
      <Card>
        <CardHeader>
          <CardTitle>{t("tags")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(index)} disabled={isLoading} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          {(() => {
            const availableUserTags = userTags.filter((t) => !tags.includes(t));
            if (availableUserTags.length === 0) return null;
            return (
              <Select onValueChange={(tag) => { setTags([...tags, tag]); }} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectExistingTag")} />
                </SelectTrigger>
                <SelectContent>
                  {availableUserTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })()}
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              disabled={isLoading}
              placeholder={t("tagPlaceholder")}
            />
            <Button type="button" variant="outline" size="sm" onClick={addTag} disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addTag")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Imágenes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5" />
            {t("images")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {images.map((image, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={image}
                onChange={(e) => updateImage(index, e.target.value)}
                disabled={isLoading}
                placeholder={t("imagePlaceholder")}
              />
              {images.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)} disabled={isLoading}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addImage} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addImage")}
          </Button>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}
