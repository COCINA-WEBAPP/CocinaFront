/**
 * Parses ingredient strings and scales quantities for portion adjustment.
 */

type ParsedIngredient = {
  quantity: number | null;
  unit: string;
  item: string;
};

const QUANTITY_RE = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.?\d*)\s*(.*)/;

function parseFraction(str: string): number {
  str = str.trim();
  // Mixed number: "1 1/2"
  const mixed = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  // Simple fraction: "1/2"
  const frac = str.match(/^(\d+)\/(\d+)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  // Decimal or integer
  return Number(str);
}

export function parseIngredient(str: string): ParsedIngredient {
  const trimmed = str.trim();
  const match = trimmed.match(QUANTITY_RE);
  if (!match) {
    return { quantity: null, unit: "", item: trimmed };
  }

  const quantity = parseFraction(match[1]);
  const rest = match[2].trim();

  // Try to extract unit from the rest
  const unitMatch = rest.match(
    /^(tazas?|cucharadas?|cucharaditas?|cdas?\.?|cdtas?\.?|tbsp|tsp|cups?|oz|onzas?|libras?|lb|lbs?|gramos?|g|kg|ml|litros?|l|piezas?|rebanadas?|dientes?|manojos?|pizcas?|ramas?|hojas?|lonchas?|rodajas?|slices?|cloves?|pinch|bunch|sprigs?|leaves?|pounds?|ounces?|grams?|tablespoons?|teaspoons?|pieces?)\b\s*(.*)/i
  );

  if (unitMatch) {
    return { quantity, unit: unitMatch[1], item: unitMatch[2] || "" };
  }

  return { quantity, unit: "", item: rest };
}

function formatQuantity(n: number): string {
  // Common fractions for readability
  const fractions: [number, string][] = [
    [0.25, "1/4"], [0.333, "1/3"], [0.5, "1/2"],
    [0.667, "2/3"], [0.75, "3/4"],
  ];

  const whole = Math.floor(n);
  const decimal = n - whole;

  if (decimal < 0.05) return String(whole || n);

  for (const [val, str] of fractions) {
    if (Math.abs(decimal - val) < 0.05) {
      return whole > 0 ? `${whole} ${str}` : str;
    }
  }

  // Round to one decimal
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

export function scaleIngredient(str: string, ratio: number): string {
  const parsed = parseIngredient(str);
  if (parsed.quantity === null || ratio === 1) return str;
  const scaled = parsed.quantity * ratio;
  const parts = [formatQuantity(scaled)];
  if (parsed.unit) parts.push(parsed.unit);
  if (parsed.item) parts.push(parsed.item);
  return parts.join(" ");
}

export function scaleIngredients(
  ingredients: string[],
  originalServings: number,
  targetServings: number
): string[] {
  const ratio = targetServings / originalServings;
  return ingredients.map((i) => scaleIngredient(i, ratio));
}
