import { describe, it, expect } from "vitest";
import {
  categorizeIngredient,
  groupIngredientsByCategory,
  INGREDIENT_CATEGORIES,
} from "@/lib/data/ingredient-categories";

describe("categorizeIngredient", () => {
  it("classifies dairy items", () => {
    expect(categorizeIngredient("Leche entera")).toBe("dairy");
    expect(categorizeIngredient("Queso mozzarella")).toBe("dairy");
    expect(categorizeIngredient("Yogur natural")).toBe("dairy");
  });

  it("classifies meat items", () => {
    expect(categorizeIngredient("Pechuga de pollo")).toBe("meat");
    expect(categorizeIngredient("Carne de res molida")).toBe("meat");
    expect(categorizeIngredient("Tocino ahumado")).toBe("meat");
  });

  it("classifies seafood items", () => {
    expect(categorizeIngredient("Camarón grande")).toBe("seafood");
    expect(categorizeIngredient("Salmón ahumado")).toBe("seafood");
    expect(categorizeIngredient("Atún rojo")).toBe("seafood");
  });

  it("classifies vegetables", () => {
    expect(categorizeIngredient("Tomate maduro")).toBe("vegetables");
    expect(categorizeIngredient("Lechuga romana")).toBe("vegetables");
    expect(categorizeIngredient("Zanahoria rallada")).toBe("vegetables");
  });

  it("classifies fruits", () => {
    expect(categorizeIngredient("Manzana verde")).toBe("fruits");
    expect(categorizeIngredient("Limón")).toBe("fruits");
  });

  it("classifies grains", () => {
    expect(categorizeIngredient("Arroz blanco")).toBe("grains");
    expect(categorizeIngredient("Pasta penne")).toBe("grains");
    expect(categorizeIngredient("Harina de trigo")).toBe("grains");
  });

  it("classifies spices", () => {
    expect(categorizeIngredient("Pimienta negra")).toBe("spices");
    expect(categorizeIngredient("Orégano seco")).toBe("spices");
    expect(categorizeIngredient("Canela en polvo")).toBe("spices");
  });

  it("classifies oils and sauces", () => {
    expect(categorizeIngredient("Aceite de oliva")).toBe("oils");
    expect(categorizeIngredient("Vinagre balsámico")).toBe("oils");
  });

  it("classifies eggs", () => {
    expect(categorizeIngredient("2 Huevos")).toBe("eggs");
  });

  it("classifies bakery items", () => {
    expect(categorizeIngredient("Azúcar glass")).toBe("bakery");
    expect(categorizeIngredient("Levadura seca")).toBe("bakery");
    expect(categorizeIngredient("Cacao amargo")).toBe("bakery");
  });

  it("returns 'other' for unknown ingredients", () => {
    expect(categorizeIngredient("Caviar de esturión")).toBe("other");
    expect(categorizeIngredient("Trufa negra")).toBe("other");
  });

  it("handles accented characters correctly", () => {
    expect(categorizeIngredient("Jamón serrano")).toBe("meat");
    expect(categorizeIngredient("Plátano maduro")).toBe("fruits");
  });
});

describe("groupIngredientsByCategory", () => {
  it("groups ingredients by their category", () => {
    const ingredients = ["Leche", "Pollo", "Tomate", "Arroz"];
    const groups = groupIngredientsByCategory(ingredients);

    expect(groups.get("dairy")).toEqual(["Leche"]);
    expect(groups.get("meat")).toEqual(["Pollo"]);
    expect(groups.get("vegetables")).toEqual(["Tomate"]);
    expect(groups.get("grains")).toEqual(["Arroz"]);
  });

  it("puts unknown ingredients in 'other'", () => {
    const groups = groupIngredientsByCategory(["Trufa negra"]);
    expect(groups.get("other")).toEqual(["Trufa negra"]);
  });

  it("places 'other' at the end of the map", () => {
    const groups = groupIngredientsByCategory(["Trufa", "Leche", "Pollo"]);
    const keys = Array.from(groups.keys());
    expect(keys[keys.length - 1]).toBe("other");
  });

  it("returns empty map for empty input", () => {
    const groups = groupIngredientsByCategory([]);
    expect(groups.size).toBe(0);
  });

  it("keeps categories in the order defined by INGREDIENT_CATEGORIES", () => {
    const groups = groupIngredientsByCategory(["Arroz", "Leche", "Pollo"]);
    const keys = Array.from(groups.keys());
    const dairyIndex = INGREDIENT_CATEGORIES.findIndex((c) => c.key === "dairy");
    const meatIndex = INGREDIENT_CATEGORIES.findIndex((c) => c.key === "meat");
    const grainsIndex = INGREDIENT_CATEGORIES.findIndex((c) => c.key === "grains");
    expect(dairyIndex).toBeLessThan(meatIndex);
    expect(meatIndex).toBeLessThan(grainsIndex);
    expect(keys.indexOf("dairy")).toBeLessThan(keys.indexOf("meat"));
    expect(keys.indexOf("meat")).toBeLessThan(keys.indexOf("grains"));
  });
});
