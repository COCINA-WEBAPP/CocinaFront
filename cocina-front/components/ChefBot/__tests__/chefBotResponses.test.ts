import { describe, it, expect } from "vitest";
import {
  getChefBotResponse,
  INGREDIENT_SUBSTITUTIONS,
  CULINARY_TERMS,
  COOKING_TIPS,
  MEASUREMENT_CONVERSIONS,
  FOOD_SAFETY_TIPS,
} from "@/components/ChefBot/chefBotResponses";

describe("ChefBot data completeness", () => {
  it("has at least 30 ingredient substitutions", () => {
    expect(Object.keys(INGREDIENT_SUBSTITUTIONS).length).toBeGreaterThanOrEqual(30);
  });

  it("has at least 50 culinary terms", () => {
    expect(Object.keys(CULINARY_TERMS).length).toBeGreaterThanOrEqual(50);
  });

  it("has at least 15 cooking tips", () => {
    expect(Object.keys(COOKING_TIPS).length).toBeGreaterThanOrEqual(15);
  });

  it("has at least 8 measurement conversions", () => {
    expect(Object.keys(MEASUREMENT_CONVERSIONS).length).toBeGreaterThanOrEqual(8);
  });

  it("has at least 8 food safety tips", () => {
    expect(Object.keys(FOOD_SAFETY_TIPS).length).toBeGreaterThanOrEqual(8);
  });

  it("every substitution has substitute and note", () => {
    for (const [key, val] of Object.entries(INGREDIENT_SUBSTITUTIONS)) {
      expect(val.substitute, `${key} missing substitute`).toBeTruthy();
      expect(val.note, `${key} missing note`).toBeTruthy();
    }
  });

  it("every culinary term has a non-empty definition", () => {
    for (const [key, val] of Object.entries(CULINARY_TERMS)) {
      expect(val.length, `${key} definition is empty`).toBeGreaterThan(10);
    }
  });
});

describe("getChefBotResponse — ingredient substitution", () => {
  it("responds to substitution query for a known ingredient", () => {
    const response = getChefBotResponse("¿Con qué puedo reemplazar el huevo?");
    expect(response).toContain("huevo");
    expect(response).toContain("sustituir");
  });

  it("responds to 'no tengo mantequilla'", () => {
    const response = getChefBotResponse("No tengo mantequilla, ¿qué uso?");
    expect(response).toContain("mantequilla");
  });

  it("returns fallback for unknown ingredient substitution", () => {
    const response = getChefBotResponse("¿Con qué puedo sustituir la piedra volcánica?");
    expect(response).toContain("no pude identificar");
  });

  it("handles accented text correctly", () => {
    const response = getChefBotResponse("Alternativa al azúcar");
    expect(response).toContain("azucar");
  });
});

describe("getChefBotResponse — culinary terms", () => {
  it("explains a term when asked 'qué es'", () => {
    const response = getChefBotResponse("¿Qué es blanquear?");
    expect(response).toContain("Blanquear");
    expect(response).toContain("agua hirviendo");
  });

  it("explains a term when asked 'qué significa'", () => {
    const response = getChefBotResponse("¿Qué significa juliana?");
    expect(response).toContain("Juliana");
    expect(response).toContain("tiras");
  });

  it("matches term with underscore (mise en place)", () => {
    const response = getChefBotResponse("¿Qué es mise en place?");
    expect(response).toContain("Mise en place");
  });

  it("returns direct match when user just types the term", () => {
    const response = getChefBotResponse("brunoise");
    expect(response).toContain("Brunoise");
    expect(response).toContain("cubos");
  });

  it("returns fallback for unknown term", () => {
    const response = getChefBotResponse("¿Qué significa xyznoexiste?");
    expect(response).toContain("No encontré");
  });
});

describe("getChefBotResponse — cooking tips", () => {
  it("returns a tip when asked for cooking advice", () => {
    const response = getChefBotResponse("Dame un consejo para cocinar arroz");
    expect(response).toContain("arroz");
    expect(response).toContain("Tip de cocina");
  });

  it("matches 'cómo cocino' keyword", () => {
    const response = getChefBotResponse("¿Cómo cocino la pasta perfecta?");
    expect(response).toContain("pasta");
  });

  it("returns tip list when topic is not specific", () => {
    const response = getChefBotResponse("Dame un truco de cocina");
    expect(response).toContain("tips sobre");
  });
});

describe("getChefBotResponse — measurement conversions", () => {
  it("answers conversion query for taza", () => {
    const response = getChefBotResponse("¿Cuánto es una taza en gramos?");
    expect(response).toContain("240 ml");
  });

  it("answers cucharada query", () => {
    const response = getChefBotResponse("¿Cuántos gramos tiene una cucharada?");
    expect(response).toContain("15 ml");
  });

  it("handles temperature conversion", () => {
    const response = getChefBotResponse("Conversión de temperatura horno");
    expect(response).toContain("°F");
    expect(response).toContain("°C");
  });

  it("returns fallback for unknown measurement", () => {
    const response = getChefBotResponse("¿Cuánto equivale un bushel?");
    expect(response).toContain("conversiones");
  });
});

describe("getChefBotResponse — food safety", () => {
  it("answers safety question about chicken", () => {
    const response = getChefBotResponse("¿Es seguro comer pollo poco cocido?");
    expect(response).toContain("74°C");
  });

  it("answers about leftovers", () => {
    const response = getChefBotResponse("¿Cuánto duran las sobras?");
    expect(response).toContain("sobras");
  });

  it("answers about food contamination", () => {
    const response = getChefBotResponse("¿Cómo evitar la contaminación cruzada?");
    expect(response).toContain("tabla");
  });

  it("returns general safety info for vague safety question", () => {
    const response = getChefBotResponse("¿Qué es seguro comer?");
    expect(response).toContain("seguridad alimentaria");
  });
});

describe("getChefBotResponse — greetings", () => {
  it("responds to 'hola'", () => {
    const response = getChefBotResponse("Hola");
    expect(response).toContain("ChefBot");
    expect(response).toContain("ayudarte");
  });

  it("responds to 'buenas tardes'", () => {
    const response = getChefBotResponse("Buenas tardes");
    expect(response).toContain("ChefBot");
  });
});

describe("getChefBotResponse — off-topic", () => {
  it("rejects non-cooking topics", () => {
    const response = getChefBotResponse("¿Quién ganó el fútbol ayer?");
    expect(response).toContain("solo puedo ayudarte con temas de cocina");
  });

  it("rejects programming questions", () => {
    const response = getChefBotResponse("Ayúdame con programación de software");
    expect(response).toContain("cocina");
  });
});

describe("getChefBotResponse — generic fallback", () => {
  it("returns help message for unrecognized input", () => {
    const response = getChefBotResponse("asdfghjkl");
    expect(response).toContain("No estoy seguro");
    expect(response).toContain("Sustituir ingredientes");
  });
});
