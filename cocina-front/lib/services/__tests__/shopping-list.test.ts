import { describe, it, expect, beforeEach } from "vitest";
import {
  getShoppingList,
  addRecipeToShoppingList,
  removeRecipeFromShoppingList,
  clearShoppingList,
  toggleOwnedItem,
  isItemOwned,
  isRecipeInShoppingList,
  resetShoppingListCache,
} from "@/lib/services/shopping-list";

beforeEach(() => {
  localStorage.clear();
  resetShoppingListCache();
});

describe("getShoppingList", () => {
  it("returns an empty state initially", () => {
    const list = getShoppingList();
    expect(list.entries).toEqual([]);
    expect(list.ownedItems).toEqual([]);
  });
});

describe("addRecipeToShoppingList", () => {
  it("adds a recipe with ingredients", () => {
    addRecipeToShoppingList("r1", "Pasta", ["Pasta", "Tomate", "Sal"]);
    const list = getShoppingList();
    expect(list.entries.length).toBe(1);
    expect(list.entries[0].recipeId).toBe("r1");
    expect(list.entries[0].recipeTitle).toBe("Pasta");
    expect(list.entries[0].ingredients).toEqual(["Pasta", "Tomate", "Sal"]);
  });

  it("replaces ingredients if recipe already exists", () => {
    addRecipeToShoppingList("r1", "Pasta", ["Pasta", "Sal"]);
    addRecipeToShoppingList("r1", "Pasta", ["Pasta", "Queso"]);
    const list = getShoppingList();
    expect(list.entries.length).toBe(1);
    expect(list.entries[0].ingredients).toEqual(["Pasta", "Queso"]);
  });

  it("adds multiple recipes", () => {
    addRecipeToShoppingList("r1", "Pasta", ["Pasta"]);
    addRecipeToShoppingList("r2", "Ensalada", ["Lechuga"]);
    const list = getShoppingList();
    expect(list.entries.length).toBe(2);
  });
});

describe("removeRecipeFromShoppingList", () => {
  it("removes a recipe from the list", () => {
    addRecipeToShoppingList("r1", "Pasta", ["Pasta"]);
    addRecipeToShoppingList("r2", "Ensalada", ["Lechuga"]);
    removeRecipeFromShoppingList("r1");
    const list = getShoppingList();
    expect(list.entries.length).toBe(1);
    expect(list.entries[0].recipeId).toBe("r2");
  });

  it("does nothing if recipe is not in the list", () => {
    addRecipeToShoppingList("r1", "Pasta", ["Pasta"]);
    removeRecipeFromShoppingList("nonexistent");
    expect(getShoppingList().entries.length).toBe(1);
  });
});

describe("clearShoppingList", () => {
  it("empties the entire list", () => {
    addRecipeToShoppingList("r1", "Pasta", ["Pasta"]);
    addRecipeToShoppingList("r2", "Ensalada", ["Lechuga"]);
    clearShoppingList();
    const list = getShoppingList();
    expect(list.entries).toEqual([]);
    expect(list.ownedItems).toEqual([]);
  });
});

describe("toggleOwnedItem / isItemOwned", () => {
  it("marks an item as owned", () => {
    expect(isItemOwned("Sal")).toBe(false);
    toggleOwnedItem("Sal");
    expect(isItemOwned("Sal")).toBe(true);
  });

  it("unmarks an owned item", () => {
    toggleOwnedItem("Sal");
    toggleOwnedItem("Sal");
    expect(isItemOwned("Sal")).toBe(false);
  });

  it("is case-insensitive", () => {
    toggleOwnedItem("Tomate");
    expect(isItemOwned("tomate")).toBe(true);
    expect(isItemOwned("TOMATE")).toBe(true);
  });
});

describe("isRecipeInShoppingList", () => {
  it("returns true for added recipe", () => {
    addRecipeToShoppingList("r1", "Pasta", ["Pasta"]);
    expect(isRecipeInShoppingList("r1")).toBe(true);
  });

  it("returns false for non-added recipe", () => {
    expect(isRecipeInShoppingList("nonexistent")).toBe(false);
  });

  it("returns false after removing the recipe", () => {
    addRecipeToShoppingList("r1", "Pasta", ["Pasta"]);
    removeRecipeFromShoppingList("r1");
    expect(isRecipeInShoppingList("r1")).toBe(false);
  });
});

describe("resetShoppingListCache", () => {
  it("forces reload from localStorage on next access", () => {
    addRecipeToShoppingList("r1", "Pasta", ["Pasta"]);
    // Manually modify localStorage behind the cache's back
    localStorage.clear();
    resetShoppingListCache();
    const list = getShoppingList();
    expect(list.entries).toEqual([]);
  });
});
