"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Clock, Star, TrendingUp, ChefHat } from "lucide-react";

export type SortOption =
  | "relevance"
  | "rating-high"
  | "rating-low"
  | "time-low"
  | "time-high"
  | "difficulty-easy"
  | "difficulty-hard"
  | "newest";

interface RecipeSortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS = [
  {
    value: "relevance" as const,
    label: "Más Relevantes",
    icon: TrendingUp,
  },
  {
    value: "rating-high" as const,
    label: "Mejor Calificadas",
    icon: Star,
  },
  {
    value: "rating-low" as const,
    label: "Menor Calificación",
    icon: Star,
  },
  {
    value: "time-low" as const,
    label: "Más Rápidas",
    icon: Clock,
  },
  {
    value: "time-high" as const,
    label: "Más Lentas",
    icon: Clock,
  },
  {
    value: "difficulty-easy" as const,
    label: "Más Fáciles",
    icon: ChefHat,
  },
  {
    value: "difficulty-hard" as const,
    label: "Más Difíciles",
    icon: ChefHat,
  },
  {
    value: "newest" as const,
    label: "Más Recientes",
    icon: ArrowUpDown,
  },
];

export function RecipeSortDropdown({
  value,
  onChange,
}: RecipeSortDropdownProps) {
  const currentOption = SORT_OPTIONS.find((opt) => opt.value === value);
  const Icon = currentOption?.icon || ArrowUpDown;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm font-medium text-foreground">
        Ordenar por:
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="sort-select"
          className="w-[200px] focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Ordenar recetas"
        >
          <div className="flex items-center gap-2">
          
            <SelectValue placeholder="Selecciona orden" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => {
            const OptionIcon = option.icon;
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <OptionIcon className="h-4 w-4" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}