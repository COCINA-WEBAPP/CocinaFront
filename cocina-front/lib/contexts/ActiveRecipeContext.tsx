"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Recipe } from "@/lib/types/recipes";

type ActiveRecipeCtx = {
  activeRecipe: Recipe | null;
  setActiveRecipe: (r: Recipe | null) => void;
};

const ActiveRecipeContext = createContext<ActiveRecipeCtx>({
  activeRecipe: null,
  setActiveRecipe: () => {},
});

export const useActiveRecipe = () => useContext(ActiveRecipeContext);

export function ActiveRecipeProvider({ children }: { children: ReactNode }) {
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  return (
    <ActiveRecipeContext.Provider value={{ activeRecipe, setActiveRecipe }}>
      {children}
    </ActiveRecipeContext.Provider>
  );
}
