import type { ResponseData } from "./types";
import {
  INGREDIENT_SUBSTITUTIONS,
  CULINARY_TERMS,
  COOKING_TIPS,
  MEASUREMENT_CONVERSIONS,
  FOOD_SAFETY_TIPS,
} from "../data";

export const frData: ResponseData = {
  ingredientSubstitutions: INGREDIENT_SUBSTITUTIONS,
  culinaryTerms: CULINARY_TERMS,
  cookingTips: COOKING_TIPS,
  measurementConversions: MEASUREMENT_CONVERSIONS,
  foodSafetyTips: FOOD_SAFETY_TIPS,
  keywords: {
    substitution: [
      "substituer", "remplacer", "remplacement", "changer", "alternative",
      "au lieu de", "a la place de", "je n'ai pas", "sans", "substitut",
    ],
    conversion: [
      "combien fait", "combien", "convertir", "conversion",
      "equivaut", "equivalence", "mesure", "mesures", "combien pese",
      "grammes en", "tasses en", "onces en",
    ],
    safety: [
      "securite", "sur", "danger", "dangereux", "intoxication",
      "bacterie", "contamination", "perime", "expire", "temperature sure",
      "combien de temps", "peut-on manger", "c'est mauvais", "c'est bon",
      "hygiene", "laver", "congeler", "decongeler", "recongeler",
      "restes", "rechauffer",
    ],
    tip: [
      "astuce", "astuces", "conseil", "conseils", "truc", "trucs",
      "comment cuisiner", "comment cuire", "comment faire", "comment preparer",
      "comment on cuisine", "comment on fait", "comment on prepare",
      "secret", "secrets", "point parfait", "meilleure facon",
    ],
    term: [
      "qu'est-ce que", "que signifie", "que veut dire", "c'est quoi",
      "definition de", "signifie", "explique", "expliquer", "terme",
    ],
    greeting: ["bonjour", "salut", "coucou", "bonsoir", "hey"],
    nonCooking: [
      "politique", "football", "sport", "musique", "film",
      "meteo", "temps", "actualites", "argent", "banque",
      "programmation", "code", "logiciel", "ordinateur",
      "mathematique", "physique", "chimie",
    ],
  },
  templates: {
    substituteResult: (ingredient, substitute, note) =>
      `Pour remplacer **${ingredient}** vous pouvez utiliser :\n\n${substitute}\n\n*${note}*`,
    substituteNotFound:
      "Je comprends que vous voulez substituer un ingrédient, mais je n'ai pas pu identifier lequel. Essayez de me demander plus précisément, par exemple : *\"Par quoi remplacer les œufs ?\"*",
    conversionResult: (unit, info) =>
      `**${unit.charAt(0).toUpperCase() + unit.slice(1)}** : ${info}`,
    conversionNotFound:
      "Je peux vous aider avec les conversions. Demandez-moi des unités comme : *tasse, cuillère à soupe, cuillère à café, once, livre, gramme, litre, pincée ou température*. Exemple : *\"Combien fait une tasse en grammes ?\"*",
    safetyResult: (topic, tip) =>
      `**Sécurité alimentaire — ${topic}** : ${tip}`,
    safetyGeneral: (tip) =>
      `Voici un conseil général de sécurité alimentaire :\n\n${tip}\n\nVous pouvez me poser des questions sur : *les températures sûres, la contamination croisée, la chaîne du froid, les restes, les œufs, les viandes, les fruits de mer, les fruits ou les conserves*.`,
    safetyNotFound: "",
    tipResult: (topic, tip) =>
      `**Astuce cuisine — ${topic}** : ${tip}`,
    tipNotFound:
      "J'ai des astuces sur : *le riz, les pâtes, la viande, le poulet, le poisson, les légumes, les œufs, les sauces, la friture, le four, le sel, les épices, les couteaux, l'oignon, l'ail, les légumineuses, la pâte, la pâtisserie, le gril, la plancha et la cuisson vapeur*. Sur quel sujet voulez-vous un conseil ?",
    termResult: (term, definition) =>
      `**${term.charAt(0).toUpperCase() + term.slice(1)}** : ${definition}`,
    termNotFound:
      "Je n'ai pas trouvé ce terme culinaire dans ma base de données. Je connais plus de 50 termes comme : *blanchir, julienne, brunoise, réduire, mariner, déglacer, confire, roux, béchamel, mirepoix, papillote, sous vide, tempura, ceviche* et bien d'autres. Lequel vous intéresse ?",
    greetingResponse:
      "Bonjour ! Je suis **ChefBot**, votre assistant cuisine. Je peux vous aider avec :\n\n• **Substituer des ingrédients** — *\"Par quoi remplacer le beurre ?\"*\n• **Expliquer des termes culinaires** — *\"Que signifie déglacer ?\"*\n• **Astuces de cuisson** — *\"Donnez-moi un conseil pour cuire le riz\"*\n• **Convertir des mesures** — *\"Combien fait une tasse en grammes ?\"*\n• **Sécurité alimentaire** — *\"À quelle température cuire le poulet ?\"*\n\nComment puis-je vous aider ?",
    offTopicResponse:
      "Je suis **ChefBot** et je ne peux vous aider qu'avec des sujets de cuisine. Mes spécialités sont :\n\n• Substitution d'ingrédients\n• Explication de termes culinaires\n• Astuces et techniques de cuisson\n• Conversions de mesures\n• Sécurité alimentaire\n\nPosez-moi une question sur la cuisine !",
    fallbackResponse:
      "Je ne suis pas sûr de pouvoir vous aider avec ça. Je peux vous assister avec :\n\n• **Substitution d'ingrédients** — *\"Par quoi remplacer les œufs ?\"*\n• **Termes culinaires** — *\"Que signifie julienne ?\"*\n• **Astuces de cuisson** — *\"Comment cuire le riz parfaitement ?\"*\n• **Conversions de mesures** — *\"Combien fait une once en grammes ?\"*\n• **Sécurité alimentaire** — *\"Combien de temps durent les restes au réfrigérateur ?\"*\n\nEssayez de me poser ce genre de question.",
    recipeIngredients: (title, list) =>
      `**${title}** — Ingrédients :\n\n${list}`,
    recipeSteps: (title, list) =>
      `**${title}** — Étapes :\n\n${list}`,
    recipeContext: (title) =>
      `Vous consultez **${title}**. Je peux vous aider avec ses ingrédients, étapes ou substitutions. De quoi avez-vous besoin ?`,
  },
};
