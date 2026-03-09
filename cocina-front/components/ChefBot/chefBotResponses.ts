/**
 * Respuestas predeterminadas del ChefBot.
 *
 * En el futuro este módulo será reemplazado por llamadas a una API de IA.
 * Por ahora ofrece respuestas basadas en palabras clave para dos funciones:
 *   1. Sustitución de ingredientes
 *   2. Explicación de términos culinarios
 */

// ─── Sustituciones de ingredientes ────────────────────────────────────────────

export const INGREDIENT_SUBSTITUTIONS: Record<
  string,
  { substitute: string; note: string }
> = {
  huevo: {
    substitute: "1 cucharada de semillas de chía o lino remojadas en 3 cucharadas de agua (por cada huevo)",
    note: "Funciona muy bien en repostería. También puedes usar 1/4 de taza de puré de manzana o medio plátano maduro machacado.",
  },
  mantequilla: {
    substitute: "La misma cantidad de aceite de coco o aceite de oliva",
    note: "Para repostería, el aceite de coco aporta textura similar. En platillos salados, el aceite de oliva es ideal.",
  },
  leche: {
    substitute: "Leche de avena, almendra, soja o coco en la misma cantidad",
    note: "La leche de avena es la más neutra en sabor. La de coco aporta cremosidad extra.",
  },
  harina: {
    substitute: "Harina de almendra, avena molida o harina de arroz",
    note: "La harina de almendra funciona bien en repostería. La de arroz es ideal para rebozados crujientes.",
  },
  azucar: {
    substitute: "Miel, jarabe de arce o stevia",
    note: "Usa 3/4 de la cantidad si usas miel o jarabe de arce, ya que son más dulces. Reduce también los líquidos de la receta ligeramente.",
  },
  crema: {
    substitute: "Leche de coco (la parte espesa de la lata) o yogur griego",
    note: "La crema de coco es perfecta para salsas y postres. El yogur griego funciona bien en aderezos.",
  },
  "crema de leche": {
    substitute: "Leche de coco espesa o anacardos remojados y licuados",
    note: "La leche de coco da una textura muy cremosa. Los anacardos licuados son ideales para salsas veganas.",
  },
  queso: {
    substitute: "Levadura nutricional para sabor a queso, o tofu firme rallado",
    note: "La levadura nutricional aporta un sabor umami similar al parmesano. Para fundir, existen quesos veganos comerciales.",
  },
  "pan rallado": {
    substitute: "Avena molida, harina de almendra o copos de maíz triturados",
    note: "Los copos de maíz triturados dan un rebozado extra crujiente.",
  },
  ajo: {
    substitute: "1/8 de cucharadita de ajo en polvo por cada diente de ajo",
    note: "El ajo en polvo es más suave. Si buscas más intensidad, usa ajo granulado.",
  },
  cebolla: {
    substitute: "1 cucharadita de cebolla en polvo o puerro picado",
    note: "El puerro ofrece un sabor más suave. Los chalotes son otra buena alternativa.",
  },
  limon: {
    substitute: "Vinagre de manzana o lima en la misma cantidad",
    note: "El vinagre de manzana funciona bien en aderezos. La lima es casi intercambiable con el limón.",
  },
  vino: {
    substitute: "Caldo de pollo o verduras con un chorrito de vinagre",
    note: "Usa la misma cantidad de caldo. El vinagre aporta la acidez que normalmente da el vino.",
  },
  "salsa de soja": {
    substitute: "Aminos de coco o salsa tamari (sin gluten)",
    note: "Los aminos de coco son más suaves y ligeramente dulces. El tamari tiene un sabor muy similar a la soja.",
  },
  maicena: {
    substitute: "Harina de arrurruz o harina común (usa el doble de cantidad)",
    note: "El arrurruz da un acabado más brillante a las salsas. La harina común necesita más cocción.",
  },
};

// ─── Términos culinarios ──────────────────────────────────────────────────────

export const CULINARY_TERMS: Record<string, string> = {
  blanquear:
    "Sumergir brevemente un alimento en agua hirviendo y luego pasarlo a agua con hielo para detener la cocción. Se usa para pelar tomates, fijar el color de vegetales verdes o precocinar antes de congelar.",
  glasear:
    "Cubrir un alimento con una capa brillante, ya sea de azúcar, chocolate, jugo reducido o una salsa. En repostería se refiere a la cobertura dulce de pasteles; en cocina salada, a bañar carnes o vegetales con su propio jugo.",
  sofreir:
    "Cocinar alimentos cortados en trozos pequeños en una sartén con poco aceite a fuego medio-alto, removiendo frecuentemente. Es la base de muchos guisos y salsas.",
  saltear:
    "Cocinar rápidamente alimentos cortados pequeños en una sartén muy caliente con poco aceite, moviéndolos constantemente. Similar a sofreír pero a mayor temperatura y por menos tiempo.",
  juliana:
    "Técnica de corte que consiste en cortar alimentos en tiras finas y alargadas de unos 5 cm de largo y 2-3 mm de grosor. Muy usada para vegetales en ensaladas y salteados.",
  brunoise:
    "Corte en cubos muy pequeños y uniformes de aproximadamente 2-3 mm por lado. Se usa frecuentemente para vegetales en salsas, guarniciones y rellenos.",
  reducir:
    "Hervir un líquido (caldo, salsa, vino) a fuego medio-alto sin tapar para que se evapore parte del agua, concentrando su sabor y espesando la consistencia.",
  marinar:
    "Sumergir un alimento (generalmente carne, pollo o pescado) en una mezcla líquida con especias, aceite y un ácido (limón, vinagre) durante un tiempo para ablandarlo y darle sabor.",
  emulsionar:
    "Mezclar dos líquidos que normalmente no se combinan (como aceite y agua/vinagre) hasta obtener una mezcla homogénea. Ejemplos: mayonesa, vinagreta. Se logra batiendo vigorosamente o con un emulsionante como la yema de huevo.",
  escalfar:
    "Cocinar un alimento sumergiéndolo en un líquido (agua, caldo, leche) a temperatura baja, justo por debajo del punto de ebullición (70-80°C). Muy usado para huevos y pescado.",
  flamear:
    "Rociar un alimento con un licor y prenderle fuego para quemar el alcohol. Aporta sabor y un toque de espectacularidad al plato. Común con crêpes, carnes y postres.",
  desglasar:
    "Añadir un líquido (vino, caldo, agua) a una sartén caliente después de cocinar carne para disolver los jugos caramelizados del fondo. Es la base de muchas salsas deliciosas.",
  confitar:
    "Cocinar un alimento lentamente sumergido en grasa (aceite de oliva o grasa de pato) a baja temperatura (60-90°C) durante un tiempo prolongado. El resultado es muy tierno y jugoso.",
  temperar:
    "Elevar o bajar gradualmente la temperatura de un ingrediente para evitar un cambio brusco. En chocolate, se refiere al proceso de fundir y enfriar controladamente para lograr un acabado brillante y crujiente.",
  mise_en_place:
    "Expresión francesa que significa 'todo en su lugar'. Se refiere a tener todos los ingredientes medidos, cortados y preparados antes de empezar a cocinar. Es una práctica fundamental en cocina profesional.",
  napar:
    "Cubrir un alimento con una salsa espesa de manera uniforme, de modo que la salsa se adhiera y lo envuelva por completo.",
  chiffonade:
    "Técnica de corte para hierbas y hojas verdes: se apilan, se enrollan firmemente y se cortan en tiras muy finas. Ideal para albahaca, espinaca y menta como decoración.",
};

// ─── Función principal de respuesta ───────────────────────────────────────────

/**
 * Genera una respuesta del ChefBot basándose en el mensaje del usuario.
 * Usa búsqueda por palabras clave para decidir el tipo de respuesta.
 *
 * En el futuro esta función será reemplazada por una llamada a la API de IA.
 */
export function getChefBotResponse(message: string): string {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos para matching
    .trim();

  // ── 1. Sustitución de ingredientes ──────────────────────────────────────
  const substitutionKeywords = [
    "sustituir",
    "reemplazar",
    "reemplazo",
    "cambiar",
    "alternativa",
    "en vez de",
    "en lugar de",
    "no tengo",
    "sin",
    "sustituto",
  ];

  const isSubstitutionQuery = substitutionKeywords.some((kw) =>
    normalized.includes(kw)
  );

  if (isSubstitutionQuery) {
    for (const [ingredient, data] of Object.entries(INGREDIENT_SUBSTITUTIONS)) {
      const ingredientNorm = ingredient
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(ingredientNorm)) {
        return `Para sustituir **${ingredient}** puedes usar:\n\n${data.substitute}\n\n*${data.note}*`;
      }
    }
    return "Entiendo que quieres sustituir un ingrediente, pero no pude identificar cuál. Intenta preguntarme de forma más específica, por ejemplo: *\"¿Con qué puedo reemplazar el huevo?\"*";
  }

  // ── 2. Términos culinarios ──────────────────────────────────────────────
  const termKeywords = [
    "que es",
    "que significa",
    "que quiere decir",
    "como se hace",
    "a que se refiere",
    "definicion de",
    "significa",
    "explicame",
    "explicar",
  ];

  const isTermQuery = termKeywords.some((kw) => normalized.includes(kw));

  if (isTermQuery) {
    for (const [term, definition] of Object.entries(CULINARY_TERMS)) {
      const termNorm = term
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/_/g, " ");
      if (normalized.includes(termNorm)) {
        const displayTerm = term.replace(/_/g, " ");
        return `**${displayTerm.charAt(0).toUpperCase() + displayTerm.slice(1)}**: ${definition}`;
      }
    }
    return "No encontré ese término culinario en mi base de datos. Intenta preguntar por términos como *blanquear*, *juliana*, *reducir*, *marinar*, *desglasar* y muchos más.";
  }

  // ── 3. Coincidencia directa con un término (sin keyword de pregunta) ────
  for (const [term, definition] of Object.entries(CULINARY_TERMS)) {
    const termNorm = term
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/_/g, " ");
    if (normalized === termNorm) {
      const displayTerm = term.replace(/_/g, " ");
      return `**${displayTerm.charAt(0).toUpperCase() + displayTerm.slice(1)}**: ${definition}`;
    }
  }

  // ── 4. Saludo ───────────────────────────────────────────────────────────
  const greetings = ["hola", "buenas", "hey", "buenos dias", "buenas tardes", "buenas noches", "saludos"];
  if (greetings.some((g) => normalized.includes(g))) {
    return "Hola, soy **ChefBot**, tu asistente de cocina. Puedo ayudarte con:\n\n• **Sustituir ingredientes** — Pregunta, por ejemplo: *\"¿Con qué reemplazo la mantequilla?\"*\n• **Explicar términos culinarios** — Pregunta, por ejemplo: *\"¿Qué significa blanquear?\"*\n\n¿En qué puedo ayudarte?";
  }

  // ── 5. Respuesta genérica ───────────────────────────────────────────────
  return "No estoy seguro de cómo ayudarte con eso. Por ahora puedo asistirte con:\n\n• **Sustituir ingredientes** — *\"¿Con qué puedo reemplazar el huevo?\"*\n• **Explicar términos culinarios** — *\"¿Qué significa juliana?\"*\n\nPrueba a preguntarme algo de ese estilo.";
}
