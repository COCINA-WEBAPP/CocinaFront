import { useState, useEffect } from "react";
import { getShoppingList } from "@/lib/services/shopping-list";

export function useShoppingListCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(getShoppingList().entries.length);
    update();
    window.addEventListener("shopping-list-updated", update);
    return () => window.removeEventListener("shopping-list-updated", update);
  }, []);
  return count;
}
