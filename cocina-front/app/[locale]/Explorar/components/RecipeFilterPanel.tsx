"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export interface RecipeFilters {
  tag: string | null;
  categories: string[];
  cookTime: [number, number];
  calories: [number, number];
  protein: [number, number];
  difficulty: string[];
  rating: number;
  servings: [number, number];
}

interface RecipeFilterPanelProps {
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
  onReset: () => void;
  availableTags?: string[];
}

const CATEGORIES = [
  { value: "Desayuno",    key: "breakfast"   },
  { value: "Almuerzo",    key: "lunch"       },
  { value: "Cena",        key: "dinner"      },
  { value: "Postre",      key: "dessert"     },
  { value: "Aperitivo",   key: "appetizer"   },
  { value: "Ensalada",    key: "salad"       },
  { value: "Sopa",        key: "soup"        },
  { value: "Bebida",      key: "drink"       },
  { value: "Vegano",      key: "vegan"       },
  { value: "Vegetariano", key: "vegetarian"  },
];

const DIFFICULTIES = [
  { value: "Fácil",      key: "easy"         },
  { value: "Intermedio", key: "intermediate" },
  { value: "Difícil",    key: "hard"         },
];

export function RecipeFilterPanel({
  filters,
  onFiltersChange,
  onReset,
  availableTags = [],
}: RecipeFilterPanelProps) {
  const t = useTranslations("Filters");

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    const newDifficulties = checked
      ? [...filters.difficulty, difficulty]
      : filters.difficulty.filter((d) => d !== difficulty);
    onFiltersChange({ ...filters, difficulty: newDifficulties });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.tag) count += 1;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.difficulty.length > 0) count += filters.difficulty.length;
    if (filters.rating > 0) count += 1;
    if (filters.cookTime[0] !== 0 || filters.cookTime[1] !== 180) count += 1;
    if (filters.calories[0] !== 0 || filters.calories[1] !== 800) count += 1;
    if (filters.protein[0] !== 0 || filters.protein[1] !== 100) count += 1;
    if (filters.servings[0] !== 1 || filters.servings[1] !== 12) count += 1;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <motion.aside
      className="h-fit w-full rounded-lg border border-citrus-accent/30 bg-card p-6 shadow-sm lg:sticky lg:top-20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-4 -mx-6 -mt-6 flex items-center justify-between rounded-t-lg bg-citrus-accent px-6 py-3 text-white">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{t("title")}</h2>
          {activeFiltersCount > 0 && (
            <Badge className="bg-white/90 text-citrus-accent">{activeFiltersCount}</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2 text-white hover:bg-white/20 hover:text-white"
          disabled={activeFiltersCount === 0}
        >
          <X className="mr-1 h-4 w-4" />
          {t("clear")}
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={[]} className="w-full">

        {/* Tags */}
        {availableTags.length > 0 && (
          <AccordionItem value="tags">
            <AccordionTrigger className="rounded-md bg-primary px-3 text-base font-medium text-primary-foreground hover:no-underline">
              Etiquetas
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onFiltersChange({ ...filters, tag: null })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    filters.tag === null
                      ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                      : "bg-white text-gray-600 border-gray-300 hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
                  }`}
                >
                  Todas
                </button>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, tag: filters.tag === tag ? null : tag })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      filters.tag === tag
                        ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="rounded-md bg-primary px-3 text-base font-medium text-primary-foreground hover:no-underline">
            {t("categories")}
          </AccordionTrigger>
          <AccordionContent>
            <motion.div className="space-y-3 pt-2"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
              {CATEGORIES.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.value}`}
                    checked={filters.categories.includes(category.value)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`category-${category.value}`} className="cursor-pointer text-sm font-normal">
                    {t(category.key)}
                  </Label>
                </div>
              ))}
            </motion.div>
          </AccordionContent>
        </AccordionItem>

        {/* Cook Time */}
        <AccordionItem value="cookTime">
          <AccordionTrigger className="rounded-md bg-primary px-3 text-base font-medium text-primary-foreground hover:no-underline">
            {t("cookTime")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider min={0} max={180} step={5} value={filters.cookTime}
                onValueChange={(v) => onFiltersChange({ ...filters, cookTime: [v[0], v[1]] })}
                className="w-full" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{filters.cookTime[0]} min</span>
                <span>{filters.cookTime[1]} min</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Calories */}
        <AccordionItem value="calories">
          <AccordionTrigger className="rounded-md bg-primary px-3 text-base font-medium text-primary-foreground hover:no-underline">
            {t("calories")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider min={0} max={800} step={50} value={filters.calories}
                onValueChange={(v) => onFiltersChange({ ...filters, calories: [v[0], v[1]] })}
                className="w-full" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{filters.calories[0]} kcal</span>
                <span>{filters.calories[1]} kcal</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Protein ← nuevo */}
        <AccordionItem value="protein">
          <AccordionTrigger className="rounded-md bg-primary px-3 text-base font-medium text-primary-foreground hover:no-underline">
            Proteína (g)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider min={0} max={100} step={5} value={filters.protein}
                onValueChange={(v) => onFiltersChange({ ...filters, protein: [v[0], v[1]] })}
                className="w-full" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{filters.protein[0]} g</span>
                <span>{filters.protein[1]} g</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Difficulty */}
        <AccordionItem value="difficulty">
          <AccordionTrigger className="rounded-md bg-primary px-3 text-base font-medium text-primary-foreground hover:no-underline">
            {t("difficulty")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {DIFFICULTIES.map((difficulty) => (
                <div key={difficulty.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${difficulty.value}`}
                    checked={filters.difficulty.includes(difficulty.value)}
                    onCheckedChange={(checked) =>
                      handleDifficultyChange(difficulty.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`difficulty-${difficulty.value}`} className="cursor-pointer text-sm font-normal">
                    {t(difficulty.key)}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger className="rounded-md bg-primary px-3 text-base font-medium text-primary-foreground hover:no-underline">
            {t("minRating")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider min={0} max={5} step={0.5} value={[filters.rating]}
                onValueChange={(v) => onFiltersChange({ ...filters, rating: v[0] })}
                className="w-full" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>0 ⭐</span>
                <span className="font-medium text-foreground">{filters.rating.toFixed(1)} ⭐</span>
                <span>5 ⭐</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Servings */}
        <AccordionItem value="servings">
          <AccordionTrigger className="rounded-md bg-primary px-3 text-base font-medium text-primary-foreground hover:no-underline">
            {t("servings")}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider min={1} max={12} step={1} value={filters.servings}
                onValueChange={(v) => onFiltersChange({ ...filters, servings: [v[0], v[1]] })}
                className="w-full" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{filters.servings[0]} {t("persons")}</span>
                <span>{filters.servings[1]} {t("persons")}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* Active Filters Summary */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 border-t pt-4"
          >
            <p className="text-sm font-medium">{t("activeFilters")}</p>
            <div className="flex flex-wrap gap-2">
              {filters.tag && (
                <Badge variant="secondary" className="text-xs">
                  Etiqueta: {filters.tag}
                </Badge>
              )}
              {filters.categories.map((cat) => {
                const catObj = CATEGORIES.find((c) => c.value === cat);
                return (
                  <Badge key={cat} variant="secondary" className="text-xs">
                    {catObj ? t(catObj.key) : cat}
                  </Badge>
                );
              })}
              {filters.difficulty.map((diff) => {
                const diffObj = DIFFICULTIES.find((d) => d.value === diff);
                return (
                  <Badge key={diff} variant="secondary" className="text-xs">
                    {diffObj ? t(diffObj.key) : diff}
                  </Badge>
                );
              })}
              {(filters.protein[0] !== 0 || filters.protein[1] !== 100) && (
                <Badge variant="secondary" className="text-xs">
                  Proteína: {filters.protein[0]}–{filters.protein[1]}g
                </Badge>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}