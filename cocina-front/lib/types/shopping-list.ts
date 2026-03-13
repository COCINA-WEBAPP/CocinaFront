export type ShoppingListEntry = {
  recipeId: string;
  recipeTitle: string;
  ingredients: string[];
};

export type ShoppingListState = {
  entries: ShoppingListEntry[];
  ownedItems: string[];
};
