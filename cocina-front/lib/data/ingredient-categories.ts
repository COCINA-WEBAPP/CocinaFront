export type IngredientCategory = {
  key: string;
  keywords: string[];
};

/**
 * Categorías de ingredientes para agrupar la lista de compras
 * por sección de supermercado.
 *
 * Las keywords se buscan dentro del string normalizado del ingrediente.
 * El orden importa: la primera coincidencia gana.
 */
export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  {
    key: "dairy",
    keywords: [
      "leche", "queso", "yogur", "yogurt", "crema", "mantequilla", "nata",
      "feta", "mozzarella", "parmesano", "cheddar", "ricotta", "mascarpone",
      "requesón", "suero", "buttermilk",
    ],
  },
  {
    key: "meat",
    keywords: [
      "pollo", "carne", "res", "cerdo", "tocino", "panceta", "jamón",
      "chorizo", "salchicha", "ternera", "cordero", "pavo", "costilla",
      "lomo", "filete", "pechuga", "muslo", "bacon",
    ],
  },
  {
    key: "seafood",
    keywords: [
      "camarón", "camarones", "pescado", "salmón", "atún", "mariscos",
      "langostino", "pulpo", "calamar", "mejillón", "almeja", "bacalao",
      "trucha", "merluza", "gambas",
    ],
  },
  {
    key: "vegetables",
    keywords: [
      "lechuga", "tomate", "cebolla", "ajo", "pepino", "zanahoria",
      "pimiento", "espinaca", "brócoli", "brocoli", "papa", "patata",
      "aguacate", "champiñón", "calabacín", "berenjena", "apio",
      "rábano", "col", "repollo", "alcachofa", "espárrago", "judía",
      "guisante", "chícharo", "elote", "maíz dulce", "remolacha",
      "nabo", "puerro", "calabaza",
    ],
  },
  {
    key: "fruits",
    keywords: [
      "manzana", "plátano", "banana", "limón", "lima", "naranja",
      "fresa", "arándano", "mango", "piña", "uva", "cereza", "durazno",
      "melocotón", "pera", "kiwi", "sandía", "melón", "papaya",
      "frambuesa", "mora", "coco", "granada",
    ],
  },
  {
    key: "grains",
    keywords: [
      "harina", "arroz", "pasta", "spaghetti", "espagueti", "pan",
      "avena", "tortilla", "fideos", "cuscús", "quinoa", "quinua",
      "macarrones", "tallarines", "lasaña", "penne", "linguine",
      "fusilli", "cereal",
    ],
  },
  {
    key: "spices",
    keywords: [
      "sal", "pimienta", "orégano", "oregano", "comino", "canela",
      "paprika", "páprika", "curry", "cilantro", "perejil", "albahaca",
      "romero", "tomillo", "laurel", "nuez moscada", "jengibre",
      "cúrcuma", "pimentón", "clavo", "anís", "eneldo", "menta",
      "hierbabuena", "azafrán", "cardamomo",
    ],
  },
  {
    key: "oils",
    keywords: [
      "aceite", "vinagre", "salsa", "soja", "mostaza", "mayonesa",
      "ketchup", "aderezo", "tahini", "sriracha",
    ],
  },
  {
    key: "eggs",
    keywords: ["huevo", "huevos"],
  },
  {
    key: "bakery",
    keywords: [
      "azúcar", "azucar", "polvo de hornear", "levadura", "vainilla",
      "cacao", "chocolate", "miel", "mermelada", "dulce de leche",
      "gelatina", "maicena", "almidón",
    ],
  },
];

/**
 * Clasifica un ingrediente en una categoría de supermercado.
 * Busca keywords dentro del string normalizado (sin tildes, minúsculas).
 * Devuelve la key de la categoría o "other" si no coincide ninguna.
 */
export function categorizeIngredient(ingredient: string): string {
  const normalized = ingredient
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  for (const category of INGREDIENT_CATEGORIES) {
    for (const keyword of category.keywords) {
      const normalizedKeyword = keyword
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(normalizedKeyword)) {
        return category.key;
      }
    }
  }

  return "other";
}

/**
 * Agrupa un array de ingredientes por categoría de supermercado.
 * Devuelve un Map ordenado: las categorías con ingredientes primero,
 * "other" al final.
 */
export function groupIngredientsByCategory(
  ingredients: string[]
): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  for (const ingredient of ingredients) {
    const category = categorizeIngredient(ingredient);
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(ingredient);
  }

  // Ordenar: categorías conocidas primero (en orden de INGREDIENT_CATEGORIES), "other" al final
  const ordered = new Map<string, string[]>();
  for (const cat of INGREDIENT_CATEGORIES) {
    if (groups.has(cat.key)) {
      ordered.set(cat.key, groups.get(cat.key)!);
    }
  }
  if (groups.has("other")) {
    ordered.set("other", groups.get("other")!);
  }

  return ordered;
}
