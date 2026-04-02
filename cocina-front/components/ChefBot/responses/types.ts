export type ResponseData = {
  ingredientSubstitutions: Record<string, { substitute: string; note: string }>;
  culinaryTerms: Record<string, string>;
  cookingTips: Record<string, string>;
  measurementConversions: Record<string, string>;
  foodSafetyTips: Record<string, string>;
  keywords: {
    substitution: string[];
    conversion: string[];
    safety: string[];
    tip: string[];
    term: string[];
    greeting: string[];
    nonCooking: string[];
  };
  templates: {
    substituteResult: (ingredient: string, substitute: string, note: string) => string;
    substituteNotFound: string;
    conversionResult: (unit: string, info: string) => string;
    conversionNotFound: string;
    safetyResult: (topic: string, tip: string) => string;
    safetyGeneral: (tip: string) => string;
    safetyNotFound: string;
    tipResult: (topic: string, tip: string) => string;
    tipNotFound: string;
    termResult: (term: string, definition: string) => string;
    termNotFound: string;
    greetingResponse: string;
    offTopicResponse: string;
    fallbackResponse: string;
    recipeIngredients: (title: string, list: string) => string;
    recipeSteps: (title: string, list: string) => string;
    recipeContext: (title: string) => string;
  };
};
