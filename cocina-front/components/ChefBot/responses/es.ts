import type { ResponseData } from "./types";
import {
  INGREDIENT_SUBSTITUTIONS,
  CULINARY_TERMS,
  COOKING_TIPS,
  MEASUREMENT_CONVERSIONS,
  FOOD_SAFETY_TIPS,
} from "../data";

export const esData: ResponseData = {
  ingredientSubstitutions: INGREDIENT_SUBSTITUTIONS,
  culinaryTerms: CULINARY_TERMS,
  cookingTips: COOKING_TIPS,
  measurementConversions: MEASUREMENT_CONVERSIONS,
  foodSafetyTips: FOOD_SAFETY_TIPS,
  keywords: {
    substitution: [
      "sustituir", "reemplazar", "reemplazo", "cambiar", "alternativa",
      "en vez de", "en lugar de", "no tengo", "sin", "sustituto",
    ],
    conversion: [
      "cuanto es", "cuantos", "cuantas", "convertir", "conversion",
      "equivale", "equivalencia", "medida", "medidas", "cuanto pesa",
      "cuanto mide", "gramos a", "tazas a", "onzas a",
    ],
    safety: [
      "seguridad", "seguro", "peligro", "peligroso", "intoxicacion",
      "bacteria", "contamina", "caduca", "vencido", "temperatura segura",
      "cuanto dura", "se puede comer", "esta malo", "esta bueno",
      "higiene", "lavar", "congelar", "descongelar", "recongelar",
      "sobras", "recalentar",
    ],
    tip: [
      "tip", "tips", "consejo", "consejos", "truco", "trucos",
      "como cocino", "como cocinar", "como hago", "como preparo",
      "como preparar", "como se cocina", "como se hace", "como se prepara",
      "secreto", "secretos", "punto exacto", "punto justo", "queda mejor",
    ],
    term: [
      "que es", "que significa", "que quiere decir", "a que se refiere",
      "definicion de", "significa", "explicame", "explicar", "termino",
    ],
    greeting: ["hola", "buenas", "hey", "buenos dias", "buenas tardes", "buenas noches", "saludos"],
    nonCooking: [
      "politica", "futbol", "deporte", "musica", "pelicula",
      "clima", "tiempo", "noticias", "dinero", "banco",
      "programacion", "codigo", "software", "computadora",
      "matematica", "fisica", "quimica",
    ],
  },
  templates: {
    substituteResult: (ingredient, substitute, note) =>
      `Para sustituir **${ingredient}** puedes usar:\n\n${substitute}\n\n*${note}*`,
    substituteNotFound:
      "Entiendo que quieres sustituir un ingrediente, pero no pude identificar cuál. Intenta preguntarme de forma más específica, por ejemplo: *\"¿Con qué puedo reemplazar el huevo?\"*",
    conversionResult: (unit, info) =>
      `**${unit.charAt(0).toUpperCase() + unit.slice(1)}**: ${info}`,
    conversionNotFound:
      "Puedo ayudarte con conversiones. Pregunta por unidades como: *taza, cucharada, cucharadita, onza, libra, gramo, litro, pizca o temperatura*. Ejemplo: *\"¿Cuánto es una taza en gramos?\"*",
    safetyResult: (topic, tip) =>
      `**Seguridad alimentaria — ${topic}**: ${tip}`,
    safetyGeneral: (tip) =>
      `Aquí tienes un consejo general de seguridad alimentaria:\n\n${tip}\n\nPuede preguntarme sobre: *temperaturas seguras, contaminación cruzada, cadena de frío, sobras, huevos, carnes, mariscos, frutas o conservas*.`,
    safetyNotFound: "",
    tipResult: (topic, tip) =>
      `**Tip de cocina — ${topic}**: ${tip}`,
    tipNotFound:
      "Tengo tips sobre: *arroz, pasta, carne, pollo, pescado, verduras, huevos, salsas, fritura, horno, sal, especias, cuchillos, cebolla, ajo, legumbres, masa, repostería, parrilla, plancha y vapor*. ¿Sobre qué tema quieres un consejo?",
    termResult: (term, definition) =>
      `**${term.charAt(0).toUpperCase() + term.slice(1)}**: ${definition}`,
    termNotFound:
      "No encontré ese término culinario en mi base de datos. Conozco más de 50 términos como: *blanquear, juliana, brunoise, reducir, marinar, desglasar, confitar, roux, bechamel, mirepoix, papillote, sous vide, tempura, ceviche* y muchos más. ¿Cuál te interesa?",
    greetingResponse:
      "Hola, soy **ChefBot**, tu asistente de cocina. Puedo ayudarte con:\n\n• **Sustituir ingredientes** — *\"¿Con qué reemplazo la mantequilla?\"*\n• **Explicar términos culinarios** — *\"¿Qué significa desglasar?\"*\n• **Tips de cocción** — *\"Dame un consejo para cocinar arroz\"*\n• **Convertir medidas** — *\"¿Cuánto es una taza en gramos?\"*\n• **Seguridad alimentaria** — *\"¿A qué temperatura se cocina el pollo?\"*\n\n¿En qué puedo ayudarte?",
    offTopicResponse:
      "Soy **ChefBot** y solo puedo ayudarte con temas de cocina. Mi especialidad es:\n\n• Sustituir ingredientes\n• Explicar términos culinarios\n• Tips y técnicas de cocción\n• Conversiones de medidas\n• Seguridad alimentaria\n\n¡Pregúntame algo relacionado con cocina!",
    fallbackResponse:
      "No estoy seguro de cómo ayudarte con eso. Puedo asistirte con:\n\n• **Sustituir ingredientes** — *\"¿Con qué puedo reemplazar el huevo?\"*\n• **Explicar términos culinarios** — *\"¿Qué significa juliana?\"*\n• **Tips de cocción** — *\"¿Cómo cocino el arroz perfecto?\"*\n• **Conversiones de medidas** — *\"¿Cuánto es una onza en gramos?\"*\n• **Seguridad alimentaria** — *\"¿Cuánto duran las sobras en el refrigerador?\"*\n\nPrueba a preguntarme algo de ese estilo.",
    recipeIngredients: (title, list) =>
      `**${title}** — Ingredientes:\n\n${list}`,
    recipeSteps: (title, list) =>
      `**${title}** — Pasos:\n\n${list}`,
    recipeContext: (title) =>
      `Estás viendo **${title}**. Puedo ayudarte con sus ingredientes, pasos o sustituciones. ¿Qué necesitas?`,
  },
};
