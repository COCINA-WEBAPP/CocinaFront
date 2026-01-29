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
import { motion, AnimatePresence } from 'framer-motion';

export interface RecipeFilters {
  categories: string[];
  cookTime: [number, number]; // [min, max] en minutos
  difficulty: string[];
  rating: number;
  servings: [number, number];
}

interface RecipeFilterPanelProps {
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
  onReset: () => void;
}

const CATEGORIES = [
  "Desayuno",
  "Almuerzo",
  "Cena",
  "Postre",
  "Aperitivo",
  "Ensalada",
  "Sopa",
  "Bebida",
  "Vegano",
  "Vegetariano",
];

const DIFFICULTIES = ["Fácil", "Intermedio", "Difícil"];

export function RecipeFilterPanel({
  filters,
  onFiltersChange,
  onReset,
}: RecipeFilterPanelProps) {
  const [isSticky, setIsSticky] = useState(false);

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

  const handleCookTimeChange = (value: number[]) => {
    onFiltersChange({ ...filters, cookTime: [value[0], value[1]] });
  };

  const handleServingsChange = (value: number[]) => {
    onFiltersChange({ ...filters, servings: [value[0], value[1]] });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({ ...filters, rating: value[0] });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.difficulty.length > 0) count += filters.difficulty.length;
    if (filters.rating > 0) count += 1;
    if (filters.cookTime[0] !== 0 || filters.cookTime[1] !== 180) count += 1;
    if (filters.servings[0] !== 1 || filters.servings[1] !== 12) count += 1;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <motion.aside
      className="h-fit w-full rounded-lg border bg-card p-6 shadow-sm lg:sticky lg:top-20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Filtros</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2"
          disabled={activeFiltersCount === 0}
        >
          <X className="mr-1 h-4 w-4" />
          Limpiar
        </Button>
      </div>

      {/* Filters Accordion */}
      <Accordion
        type="multiple"
        defaultValue={["categories", "cookTime", "difficulty", "rating"]}
        className="w-full"
      >
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-medium">
            Categorías
          </AccordionTrigger>
          <AccordionContent>
            <motion.div
              className="space-y-3 pt-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </motion.div>
          </AccordionContent>
        </AccordionItem>

        {/* Cook Time */}
        <AccordionItem value="cookTime">
          <AccordionTrigger className="text-base font-medium">
            Tiempo de Cocción
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                min={0}
                max={180}
                step={5}
                value={filters.cookTime}
                onValueChange={handleCookTimeChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{filters.cookTime[0]} min</span>
                <span>{filters.cookTime[1]} min</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Difficulty */}
        <AccordionItem value="difficulty">
          <AccordionTrigger className="text-base font-medium">
            Dificultad
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {DIFFICULTIES.map((difficulty) => (
                <div key={difficulty} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${difficulty}`}
                    checked={filters.difficulty.includes(difficulty)}
                    onCheckedChange={(checked) =>
                      handleDifficultyChange(difficulty, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`difficulty-${difficulty}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {difficulty}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger className="text-base font-medium">
            Calificación Mínima
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                min={0}
                max={5}
                step={0.5}
                value={[filters.rating]}
                onValueChange={handleRatingChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>0 ⭐</span>
                <span className="font-medium text-foreground">
                  {filters.rating.toFixed(1)} ⭐
                </span>
                <span>5 ⭐</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Servings */}
        <AccordionItem value="servings">
          <AccordionTrigger className="text-base font-medium">
            Porciones
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                min={1}
                max={12}
                step={1}
                value={filters.servings}
                onValueChange={handleServingsChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{filters.servings[0]} personas</span>
                <span>{filters.servings[1]} personas</span>
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
            <p className="text-sm font-medium">Filtros activos:</p>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs">
                  {cat}
                </Badge>
              ))}
              {filters.difficulty.map((diff) => (
                <Badge key={diff} variant="secondary" className="text-xs">
                  {diff}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}