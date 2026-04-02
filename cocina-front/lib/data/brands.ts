export type Brand = {
  name: string;
  category: string;
  ingredientKeywords: string[];
  country?: string;
};

export const BRANDS: Brand[] = [
  // Chocolate & Cacao
  { name: "Hershey's", category: "chocolate", ingredientKeywords: ["chocolate", "cacao", "cocoa"], country: "US" },
  { name: "Nestlé", category: "chocolate", ingredientKeywords: ["chocolate", "cacao", "cocoa", "leche condensada", "condensed milk"], country: "CH" },
  { name: "Abuelita", category: "chocolate", ingredientKeywords: ["chocolate", "cacao"], country: "MX" },
  { name: "Ibarra", category: "chocolate", ingredientKeywords: ["chocolate", "cacao"], country: "MX" },
  { name: "Lindt", category: "chocolate", ingredientKeywords: ["chocolate", "cacao", "cocoa"], country: "CH" },
  { name: "Valrhona", category: "chocolate", ingredientKeywords: ["chocolate", "cacao", "cocoa"], country: "FR" },

  // Dairy
  { name: "Colanta", category: "dairy", ingredientKeywords: ["leche", "queso", "crema", "yogur", "milk", "cheese", "cream", "yogurt", "lait", "fromage"], country: "CO" },
  { name: "Alpina", category: "dairy", ingredientKeywords: ["leche", "yogur", "crema", "milk", "yogurt", "cream"], country: "CO" },
  { name: "Président", category: "dairy", ingredientKeywords: ["queso", "mantequilla", "crema", "cheese", "butter", "cream", "fromage", "beurre"], country: "FR" },
  { name: "Philadelphia", category: "dairy", ingredientKeywords: ["queso", "queso crema", "cream cheese", "fromage"], country: "US" },
  { name: "Lactaid", category: "dairy", ingredientKeywords: ["leche", "milk", "lait"], country: "US" },
  { name: "Anchor", category: "dairy", ingredientKeywords: ["mantequilla", "butter", "beurre", "crema", "cream"], country: "NZ" },
  { name: "Lurpak", category: "dairy", ingredientKeywords: ["mantequilla", "butter", "beurre"], country: "DK" },

  // Oils & Fats
  { name: "Olivetto", category: "oils", ingredientKeywords: ["aceite", "aceite de oliva", "olive oil", "huile d'olive"], country: "CO" },
  { name: "Carbonell", category: "oils", ingredientKeywords: ["aceite", "aceite de oliva", "olive oil", "huile d'olive"], country: "ES" },
  { name: "PAM", category: "oils", ingredientKeywords: ["aceite", "oil", "huile"], country: "US" },
  { name: "Mazola", category: "oils", ingredientKeywords: ["aceite", "maicena", "oil", "cornstarch"], country: "US" },

  // Flours & Baking
  { name: "Harina P.A.N.", category: "flour", ingredientKeywords: ["harina", "harina de maíz", "flour", "corn flour", "farine"], country: "VE" },
  { name: "Bob's Red Mill", category: "flour", ingredientKeywords: ["harina", "avena", "flour", "oats", "farine", "avoine"], country: "US" },
  { name: "Maizena", category: "flour", ingredientKeywords: ["maicena", "cornstarch", "fécule de maïs"], country: "MX" },
  { name: "Royal", category: "baking", ingredientKeywords: ["levadura", "baking powder", "gelatina", "gelatin", "levure"], country: "ES" },
  { name: "Dr. Oetker", category: "baking", ingredientKeywords: ["levadura", "gelatina", "baking powder", "gelatin", "levure"], country: "DE" },
  { name: "Fleischmann's", category: "baking", ingredientKeywords: ["levadura", "yeast", "levure"], country: "US" },

  // Sauces & Condiments
  { name: "Kikkoman", category: "sauces", ingredientKeywords: ["salsa de soja", "soy sauce", "sauce soja"], country: "JP" },
  { name: "Heinz", category: "sauces", ingredientKeywords: ["vinagre", "ketchup", "mostaza", "vinegar", "mustard", "vinaigre"], country: "US" },
  { name: "Fruco", category: "sauces", ingredientKeywords: ["salsa", "mayonesa", "ketchup", "mostaza", "sauce", "mayonnaise"], country: "CO" },
  { name: "Tabasco", category: "sauces", ingredientKeywords: ["salsa", "picante", "hot sauce", "sauce piquante"], country: "US" },
  { name: "Sriracha", category: "sauces", ingredientKeywords: ["salsa", "picante", "ají", "hot sauce", "sauce piquante"], country: "TH" },
  { name: "La Costeña", category: "sauces", ingredientKeywords: ["salsa", "chipotle", "jalapeño", "chile"], country: "MX" },

  // Spices & Seasonings
  { name: "McCormick", category: "spices", ingredientKeywords: ["especias", "pimienta", "canela", "comino", "spices", "pepper", "cinnamon", "cumin", "épices"], country: "US" },
  { name: "Ducros", category: "spices", ingredientKeywords: ["especias", "pimienta", "spices", "pepper", "épices", "poivre"], country: "FR" },
  { name: "Knorr", category: "seasonings", ingredientKeywords: ["caldo", "consomé", "broth", "bouillon"], country: "DE" },
  { name: "Maggi", category: "seasonings", ingredientKeywords: ["caldo", "consomé", "salsa", "broth", "bouillon", "sauce"], country: "CH" },

  // Pasta & Grains
  { name: "Barilla", category: "pasta", ingredientKeywords: ["pasta", "espagueti", "spaghetti", "pâtes"], country: "IT" },
  { name: "De Cecco", category: "pasta", ingredientKeywords: ["pasta", "espagueti", "spaghetti", "pâtes"], country: "IT" },
  { name: "Doria", category: "pasta", ingredientKeywords: ["pasta", "espagueti", "spaghetti"], country: "CO" },
  { name: "Goya", category: "grains", ingredientKeywords: ["arroz", "frijoles", "legumbres", "rice", "beans", "riz", "haricots"], country: "US" },
  { name: "Tío Pelón", category: "grains", ingredientKeywords: ["arroz", "rice", "riz"], country: "CR" },

  // Canned & Preserved
  { name: "Mutti", category: "canned", ingredientKeywords: ["tomate", "pasta de tomate", "tomato", "tomate"], country: "IT" },
  { name: "Hunt's", category: "canned", ingredientKeywords: ["tomate", "pasta de tomate", "tomato"], country: "US" },
  { name: "Campbells", category: "canned", ingredientKeywords: ["caldo", "sopa", "broth", "soup", "bouillon", "soupe"], country: "US" },
  { name: "Van Camp's", category: "canned", ingredientKeywords: ["atún", "sardina", "tuna", "thon"], country: "CO" },

  // Sugar & Sweeteners
  { name: "Incauca", category: "sugar", ingredientKeywords: ["azúcar", "panela", "sugar", "sucre"], country: "CO" },
  { name: "Splenda", category: "sweetener", ingredientKeywords: ["azúcar", "endulzante", "sugar", "sweetener", "sucre", "édulcorant"], country: "US" },
  { name: "Manuelita", category: "sugar", ingredientKeywords: ["azúcar", "sugar", "sucre"], country: "CO" },

  // Beverages & Extracts
  { name: "McCormick Vanilla", category: "extracts", ingredientKeywords: ["vainilla", "vanilla", "vanille"], country: "US" },
  { name: "Badia", category: "spices", ingredientKeywords: ["especias", "ajo", "pimienta", "spices", "garlic", "pepper", "épices", "ail"], country: "US" },

  // Nuts & Seeds
  { name: "Planters", category: "nuts", ingredientKeywords: ["nueces", "almendras", "maní", "nuts", "almonds", "peanuts", "noix", "amandes"], country: "US" },
  { name: "Blue Diamond", category: "nuts", ingredientKeywords: ["almendras", "leche de almendra", "almonds", "almond milk", "amandes", "lait d'amande"], country: "US" },

  // Plant-based
  { name: "Silk", category: "plant-based", ingredientKeywords: ["leche de soja", "leche de almendra", "soy milk", "almond milk", "lait de soja"], country: "US" },
  { name: "Oatly", category: "plant-based", ingredientKeywords: ["leche de avena", "avena", "oat milk", "oats", "lait d'avoine"], country: "SE" },
];

export function searchBrands(query: string): Brand[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return BRANDS.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.ingredientKeywords.some((kw) => kw.toLowerCase().includes(q))
  );
}

export function getRecipeKeywordsForBrand(brand: Brand): string[] {
  return brand.ingredientKeywords;
}
