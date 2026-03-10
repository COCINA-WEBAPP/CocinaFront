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
import { useTranslations } from "next-intl";

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
  { value: "relevance" as const, labelKey: "mostRelevant", icon: TrendingUp },
  { value: "rating-high" as const, labelKey: "highestRated", icon: Star },
  { value: "rating-low" as const, labelKey: "lowestRated", icon: Star },
  { value: "time-low" as const, labelKey: "fastest", icon: Clock },
  { value: "time-high" as const, labelKey: "slowest", icon: Clock },
  { value: "difficulty-easy" as const, labelKey: "easiest", icon: ChefHat },
  { value: "difficulty-hard" as const, labelKey: "hardest", icon: ChefHat },
  { value: "newest" as const, labelKey: "newest", icon: ArrowUpDown },
];

export function RecipeSortDropdown({
  value,
  onChange,
}: RecipeSortDropdownProps) {
  const t = useTranslations("Sort");
  const currentOption = SORT_OPTIONS.find((opt) => opt.value === value);
  const Icon = currentOption?.icon || ArrowUpDown;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm font-medium text-foreground">
        {t("sortBy")}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="sort-select"
          className="w-[200px] focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={t("sortRecipes")}
        >
          <div className="flex items-center gap-2">

            <SelectValue placeholder={t("selectOrder")} />
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
                  <span>{t(option.labelKey)}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}