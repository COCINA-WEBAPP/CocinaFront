/**
 * Función principal de respuesta del ChefBot.
 *
 * Usa búsqueda por palabras clave para decidir el tipo de respuesta.
 * En el futuro esta función será reemplazada por una llamada a la API de IA.
 */

// Re-export data dictionaries for backwards compatibility
export {
  INGREDIENT_SUBSTITUTIONS,
  CULINARY_TERMS,
  COOKING_TIPS,
  MEASUREMENT_CONVERSIONS,
  FOOD_SAFETY_TIPS,
} from "./data";

import type { Recipe } from "@/lib/types/recipes";
import { getResponseData } from "./responses";

export function getChefBotResponse(message: string, locale?: string, recipe?: Recipe): string {
  const data = getResponseData(locale ?? "es");
  const { keywords, templates } = data;

  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // ── 0. Recipe-aware context ─────────────────────────────────────────────
  const recipeKw = ["receta","recipe","recette","ingrediente","ingredient","ingrédient","paso","step","étape","esta receta","this recipe","cette recette"];
  if (recipe && recipeKw.some((kw) => normalized.includes(norm(kw)))) {
    const ingredientsList = recipe.ingredients.map((i) => `• ${i}`).join("\n");
    if (["ingrediente","ingredient","ingrédient"].some(k => normalized.includes(norm(k)))) {
      return templates.recipeIngredients(recipe.title, ingredientsList);
    }
    if (["paso","step","étape"].some(k => normalized.includes(norm(k)))) {
      const stepsList = recipe.steps.map((s, i) => `**${i + 1}.** ${typeof s === "string" ? s : s.text}`).join("\n");
      return templates.recipeSteps(recipe.title, stepsList);
    }
    return templates.recipeContext(recipe.title);
  }

  // ── 1. Sustitución de ingredientes ──────────────────────────────────────
  const isSubstitutionQuery = keywords.substitution.some((kw) =>
    normalized.includes(norm(kw))
  );

  if (isSubstitutionQuery) {
    for (const [ingredient, sub] of Object.entries(data.ingredientSubstitutions)) {
      if (normalized.includes(norm(ingredient))) {
        return templates.substituteResult(ingredient, sub.substitute, sub.note);
      }
    }
    return templates.substituteNotFound;
  }

  // ── 2. Conversiones de medidas ────────────────────────────────────────
  const isConversionQuery = keywords.conversion.some((kw) =>
    normalized.includes(norm(kw))
  );

  if (isConversionQuery) {
    for (const [unit, info] of Object.entries(data.measurementConversions)) {
      if (normalized.includes(norm(unit))) {
        return templates.conversionResult(unit, info);
      }
    }
    return templates.conversionNotFound;
  }

  // ── 3. Seguridad alimentaria ──────────────────────────────────────────
  const isSafetyQuery = keywords.safety.some((kw) =>
    normalized.includes(norm(kw))
  );

  if (isSafetyQuery) {
    for (const [topic, tip] of Object.entries(data.foodSafetyTips)) {
      if (normalized.includes(norm(topic))) {
        return templates.safetyResult(topic, tip);
      }
    }
    // Try to find a relevant safety tip based on common words
    const meatWords = ["pollo", "chicken", "poulet", "carne", "meat", "viande", "cerdo", "pork", "porc", "res", "beef", "boeuf"];
    if (meatWords.some((w) => normalized.includes(norm(w)))) {
      return templates.safetyResult("carnes", data.foodSafetyTips.carnes);
    }
    const eggWords = ["huevo", "egg", "oeuf"];
    if (eggWords.some((w) => normalized.includes(norm(w)))) {
      return templates.safetyResult("huevos", data.foodSafetyTips.huevos);
    }
    const seafoodWords = ["marisco", "seafood", "fruit de mer", "camaron", "shrimp", "crevette", "mejillon", "mussel", "moule"];
    if (seafoodWords.some((w) => normalized.includes(norm(w)))) {
      return templates.safetyResult("mariscos", data.foodSafetyTips.mariscos);
    }
    return templates.safetyGeneral(data.foodSafetyTips.temperaturas);
  }

  // ── 4. Tips y técnicas de cocción ─────────────────────────────────────
  const isTipQuery = keywords.tip.some((kw) => normalized.includes(norm(kw)));

  if (isTipQuery) {
    for (const [topic, tip] of Object.entries(data.cookingTips)) {
      if (normalized.includes(norm(topic))) {
        return templates.tipResult(topic, tip);
      }
    }
    return templates.tipNotFound;
  }

  // ── 5. Términos culinarios (con keywords explícitos) ──────────────────
  const isTermQuery = keywords.term.some((kw) => normalized.includes(norm(kw)));

  if (isTermQuery) {
    for (const [term, definition] of Object.entries(data.culinaryTerms)) {
      const termNorm = norm(term).replace(/_/g, " ");
      if (normalized.includes(termNorm)) {
        const displayTerm = term.replace(/_/g, " ");
        return templates.termResult(displayTerm, definition);
      }
    }
    return templates.termNotFound;
  }

  // ── 6. Coincidencia directa con un término (sin keyword de pregunta) ──
  for (const [term, definition] of Object.entries(data.culinaryTerms)) {
    const termNorm = norm(term).replace(/_/g, " ");
    if (normalized === termNorm) {
      const displayTerm = term.replace(/_/g, " ");
      return templates.termResult(displayTerm, definition);
    }
  }

  // ── 7. Coincidencia directa con un tip de cocción ────────────────────
  for (const [topic, tip] of Object.entries(data.cookingTips)) {
    if (normalized === norm(topic)) {
      return templates.tipResult(topic, tip);
    }
  }

  // ── 8. Saludo ─────────────────────────────────────────────────────────
  if (keywords.greeting.some((g) => normalized.includes(norm(g)))) {
    return templates.greetingResponse;
  }

  // ── 9. Detección de temas no relacionados con cocina ──────────────────
  const isOffTopic = keywords.nonCooking.some((kw) => normalized.includes(norm(kw)));

  if (isOffTopic) {
    return templates.offTopicResponse;
  }

  // ── 10. Respuesta genérica ────────────────────────────────────────────
  return templates.fallbackResponse;
}
