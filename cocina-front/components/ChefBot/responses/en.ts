import type { ResponseData } from "./types";
import {
  INGREDIENT_SUBSTITUTIONS,
  CULINARY_TERMS,
  COOKING_TIPS,
  MEASUREMENT_CONVERSIONS,
  FOOD_SAFETY_TIPS,
} from "../data";

export const enData: ResponseData = {
  ingredientSubstitutions: INGREDIENT_SUBSTITUTIONS,
  culinaryTerms: CULINARY_TERMS,
  cookingTips: COOKING_TIPS,
  measurementConversions: MEASUREMENT_CONVERSIONS,
  foodSafetyTips: FOOD_SAFETY_TIPS,
  keywords: {
    substitution: [
      "substitute", "replace", "replacement", "swap", "alternative",
      "instead of", "in place of", "don't have", "without", "substitute for",
    ],
    conversion: [
      "how much is", "how many", "convert", "conversion",
      "equals", "equivalent", "measure", "measurements", "how much does it weigh",
      "grams to", "cups to", "ounces to",
    ],
    safety: [
      "safety", "safe", "danger", "dangerous", "food poisoning",
      "bacteria", "contamination", "expired", "spoiled", "safe temperature",
      "how long does it last", "can I eat", "is it bad", "is it good",
      "hygiene", "wash", "freeze", "defrost", "refreeze",
      "leftovers", "reheat",
    ],
    tip: [
      "tip", "tips", "advice", "trick", "tricks",
      "how do I cook", "how to cook", "how do I make", "how to prepare",
      "how to make", "how is it cooked", "how is it made", "how is it prepared",
      "secret", "secrets", "perfect", "best way",
    ],
    term: [
      "what is", "what does it mean", "what does that mean", "what does",
      "definition of", "means", "explain", "term",
    ],
    greeting: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings"],
    nonCooking: [
      "politics", "football", "soccer", "sport", "music", "movie",
      "weather", "news", "money", "bank",
      "programming", "code", "software", "computer",
      "math", "physics", "chemistry",
    ],
  },
  templates: {
    substituteResult: (ingredient, substitute, note) =>
      `To substitute **${ingredient}** you can use:\n\n${substitute}\n\n*${note}*`,
    substituteNotFound:
      "I understand you want to substitute an ingredient, but I couldn't identify which one. Try asking more specifically, for example: *\"What can I use instead of eggs?\"*",
    conversionResult: (unit, info) =>
      `**${unit.charAt(0).toUpperCase() + unit.slice(1)}**: ${info}`,
    conversionNotFound:
      "I can help with conversions. Ask about units like: *cup, tablespoon, teaspoon, ounce, pound, gram, liter, pinch or temperature*. Example: *\"How much is a cup in grams?\"*",
    safetyResult: (topic, tip) =>
      `**Food safety — ${topic}**: ${tip}`,
    safetyGeneral: (tip) =>
      `Here's a general food safety tip:\n\n${tip}\n\nYou can ask me about: *safe temperatures, cross-contamination, cold chain, leftovers, eggs, meats, seafood, fruits or canned food*.`,
    safetyNotFound: "",
    tipResult: (topic, tip) =>
      `**Cooking tip — ${topic}**: ${tip}`,
    tipNotFound:
      "I have tips on: *rice, pasta, meat, chicken, fish, vegetables, eggs, sauces, frying, oven, salt, spices, knives, onion, garlic, legumes, dough, baking, grill, griddle and steaming*. What would you like advice on?",
    termResult: (term, definition) =>
      `**${term.charAt(0).toUpperCase() + term.slice(1)}**: ${definition}`,
    termNotFound:
      "I couldn't find that culinary term in my database. I know over 50 terms like: *blanch, julienne, brunoise, reduce, marinate, deglaze, confit, roux, béchamel, mirepoix, en papillote, sous vide, tempura, ceviche* and many more. Which one interests you?",
    greetingResponse:
      "Hi! I'm **ChefBot**, your kitchen assistant. I can help you with:\n\n• **Substitute ingredients** — *\"What can I use instead of butter?\"*\n• **Explain culinary terms** — *\"What does deglaze mean?\"*\n• **Cooking tips** — *\"Give me a tip for cooking rice\"*\n• **Convert measurements** — *\"How much is a cup in grams?\"*\n• **Food safety** — *\"What temperature should chicken be cooked to?\"*\n\nHow can I help you?",
    offTopicResponse:
      "I'm **ChefBot** and I can only help you with cooking topics. My specialties are:\n\n• Ingredient substitutions\n• Culinary term explanations\n• Cooking tips and techniques\n• Measurement conversions\n• Food safety\n\nAsk me something cooking-related!",
    fallbackResponse:
      "I'm not sure how to help with that. I can assist you with:\n\n• **Ingredient substitutions** — *\"What can I use instead of eggs?\"*\n• **Culinary terms** — *\"What does julienne mean?\"*\n• **Cooking tips** — *\"How do I cook perfect rice?\"*\n• **Measurement conversions** — *\"How much is an ounce in grams?\"*\n• **Food safety** — *\"How long do leftovers last in the fridge?\"*\n\nTry asking me something like that.",
    recipeIngredients: (title, list) =>
      `**${title}** — Ingredients:\n\n${list}`,
    recipeSteps: (title, list) =>
      `**${title}** — Steps:\n\n${list}`,
    recipeContext: (title) =>
      `You're viewing **${title}**. I can help you with its ingredients, steps or substitutions. What do you need?`,
  },
};
