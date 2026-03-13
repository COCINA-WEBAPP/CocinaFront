import type { ShoppingListState } from "@/lib/types/shopping-list";

const STORAGE_KEY = "recipeshare_shopping_list";

const EMPTY_STATE: ShoppingListState = {
  entries: [],
  ownedItems: [],
};

let shoppingListState: ShoppingListState | null = null;

// ========================================
// Helpers de persistencia (patrón user.ts)
// ========================================

function persistShoppingList(state: ShoppingListState): void {
  shoppingListState = state;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function restoreShoppingList(): ShoppingListState {
  if (typeof window === "undefined") return { ...EMPTY_STATE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ShoppingListState;
      if (parsed.entries && Array.isArray(parsed.entries)) {
        return parsed;
      }
    }
  } catch {
    // localStorage corrupto, empezar de cero
  }
  return { ...EMPTY_STATE, entries: [], ownedItems: [] };
}

// ========================================
// API pública
// ========================================

/**
 * Obtiene el estado actual de la lista de compras.
 * Restaura desde localStorage si es la primera llamada.
 */
export function getShoppingList(): ShoppingListState {
  if (!shoppingListState) {
    shoppingListState = restoreShoppingList();
  }
  return shoppingListState;
}

/**
 * Agrega los ingredientes de una receta a la lista.
 * Si la receta ya existe, reemplaza sus ingredientes.
 */
export function addRecipeToShoppingList(
  recipeId: string,
  recipeTitle: string,
  ingredients: string[]
): void {
  const state = getShoppingList();
  const existing = state.entries.findIndex((e) => e.recipeId === recipeId);
  if (existing !== -1) {
    state.entries[existing] = { recipeId, recipeTitle, ingredients: [...ingredients] };
  } else {
    state.entries.push({ recipeId, recipeTitle, ingredients: [...ingredients] });
  }
  persistShoppingList({ ...state });
}

/**
 * Elimina una receta y sus ingredientes de la lista.
 */
export function removeRecipeFromShoppingList(recipeId: string): void {
  const state = getShoppingList();
  state.entries = state.entries.filter((e) => e.recipeId !== recipeId);
  persistShoppingList({ ...state });
}

/**
 * Vacía toda la lista de compras.
 */
export function clearShoppingList(): void {
  persistShoppingList({ entries: [], ownedItems: [] });
}

/**
 * Marca o desmarca un ingrediente como "ya tengo en casa".
 * Usa el string del ingrediente normalizado a minúsculas como clave.
 */
export function toggleOwnedItem(ingredient: string): void {
  const state = getShoppingList();
  const normalized = ingredient.toLowerCase().trim();
  const idx = state.ownedItems.indexOf(normalized);
  if (idx !== -1) {
    state.ownedItems.splice(idx, 1);
  } else {
    state.ownedItems.push(normalized);
  }
  persistShoppingList({ ...state });
}

/**
 * Comprueba si un ingrediente está marcado como "en casa".
 */
export function isItemOwned(ingredient: string): boolean {
  const state = getShoppingList();
  return state.ownedItems.includes(ingredient.toLowerCase().trim());
}

/**
 * Comprueba si una receta ya está en la lista de compras.
 */
export function isRecipeInShoppingList(recipeId: string): boolean {
  const state = getShoppingList();
  return state.entries.some((e) => e.recipeId === recipeId);
}
