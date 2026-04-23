import { Page, Route, Request } from "@playwright/test";

// ───────── Fixtures ─────────

const MARIA = {
  id: "1",
  username: "maria_cocina",
  email: "maria@example.com",
  fullName: "María García",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  bio: "Apasionada de la cocina mediterránea",
  role: "user",
  createdAt: "2024-01-15T00:00:00.000Z",
  stats: {
    recipesCount: 1,
    followersCount: 3,
    followingCount: 2,
    savedRecipesCount: 2,
  },
  savedRecipes: ["1", "3"],
  recipes: ["1"],
  cookingHistory: [],
  tagInventory: [] as string[],
  following: ["2", "4"],
  followers: ["2", "3", "5"],
  location: "",
  website: "",
};

const RECIPE_1 = {
  id: "1",
  slug: "1",
  title: "Pancakes Esponjosos con Miel",
  description: "Deliciosos pancakes esponjosos para el desayuno.",
  images: [
    "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
  ],
  author: { username: "maria_cocina", fullName: "María García" },
  category: "Desayuno",
  cookTime: 25,
  protein: 12,
  calories: 350,
  servings: 2,
  difficulty: "Fácil",
  rating: 4.8,
  tags: ["Italiana", "Desayuno"],
  ingredients: [
    "200g Harina",
    "2 Huevos",
    "250ml Leche entera",
    "Miel al gusto",
  ],
  steps: [
    { text: "Mezclar los ingredientes secos.", images: [] },
    { text: "Agregar los huevos y la leche.", images: [] },
    { text: "Cocinar en sartén caliente.", images: [] },
  ],
  reviews: [],
  comments: [],
  isNew: true,
  isFeatured: false,
};

const RECIPE_2 = {
  id: "2",
  slug: "2",
  title: "Pollo al Limón",
  description: "Jugoso pollo al limón.",
  images: ["https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800"],
  author: { username: "chef_carlos", fullName: "Carlos Ruiz" },
  category: "Almuerzo",
  cookTime: 45,
  protein: 35,
  calories: 520,
  servings: 4,
  difficulty: "Intermedio",
  rating: 4.5,
  tags: ["Saludable"],
  ingredients: ["500g Pechuga de pollo", "2 Limones", "Sal", "Pimienta"],
  steps: [{ text: "Sazonar el pollo.", images: [] }],
  reviews: [],
  comments: [],
  isNew: false,
  isFeatured: true,
};

const RECIPE_3 = {
  id: "3",
  slug: "3",
  title: "Pasta Carbonara",
  description: "Pasta italiana clásica.",
  images: ["https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800"],
  author: { username: "maria_cocina", fullName: "María García" },
  category: "Cena",
  cookTime: 30,
  protein: 20,
  calories: 600,
  servings: 2,
  difficulty: "Fácil",
  rating: 4.7,
  tags: ["Italiana", "Cena"],
  ingredients: ["200g Pasta", "100g Tocino", "2 Huevos", "Queso parmesano"],
  steps: [{ text: "Hervir la pasta.", images: [] }],
  reviews: [],
  comments: [],
  isNew: false,
  isFeatured: false,
};

const RECIPES = [RECIPE_1, RECIPE_2, RECIPE_3];

const AUTH_RESPONSE = { accessToken: "fake-jwt-token", user: MARIA };

// ───────── Helpers ─────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(body: unknown, status = 200) {
  return {
    status,
    contentType: "application/json",
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
}

type ShoppingEntry = { recipeId: string; recipeTitle: string; ingredients: string[]; addedAt: string };
type ShoppingState = { entries: ShoppingEntry[]; ownedItems: string[] };
const shoppingByPage = new WeakMap<object, ShoppingState>();

function getShoppingState(page: Page): ShoppingState {
  let s = shoppingByPage.get(page);
  if (!s) {
    s = { entries: [], ownedItems: [] };
    shoppingByPage.set(page, s);
  }
  return s;
}

export function seedShoppingList(page: Page, state: ShoppingState) {
  shoppingByPage.set(page, state);
}

/**
 * Intercepts all `/api/**` requests and returns mocked responses.
 */
const mockedPages = new WeakSet<object>();

export async function mockApi(page: Page) {
  if (mockedPages.has(page)) return;
  mockedPages.add(page);
  await page.route(/\/api\//, async (route: Route, req: Request) => {
    const url = new URL(req.url());
    const path = url.pathname.replace(/^.*\/api/, "");
    const method = req.method();
    if (process.env.DEBUG_MOCKS) console.log("[mockApi]", method, path);

    // CORS preflight
    if (method === "OPTIONS") {
      return await route.fulfill({ status: 204, headers: CORS_HEADERS, body: "" });
    }

    try {
      // ── Auth ──
      if (path === "/auth/login" && method === "POST") {
        return await route.fulfill(json(AUTH_RESPONSE));
      }
      if (path === "/auth/register" && method === "POST") {
        const body = req.postDataJSON?.() ?? {};
        return await route.fulfill(
          json({
            accessToken: "fake-jwt-token",
            user: { ...MARIA, ...body, id: "999" },
          })
        );
      }
      if (path === "/auth/logout" && method === "POST") {
        return await route.fulfill({ status: 204, headers: CORS_HEADERS, body: "" });
      }
      if (path === "/auth/me" && method === "GET") {
        return await route.fulfill(json(MARIA));
      }

      // ── Users ──
      if (path === "/users" && method === "GET") {
        return await route.fulfill(json({ data: [MARIA], meta: { total: 1, page: 1, limit: 200, totalPages: 1 } }));
      }
      const userByIdMatch = path.match(/^\/users\/([^/]+)$/);
      if (userByIdMatch && method === "GET") {
        return await route.fulfill(json(MARIA));
      }
      if (/^\/users\/username\//.test(path) && method === "GET") {
        return await route.fulfill(json(MARIA));
      }
      if (/^\/users\/[^/]+\/(followers|following)$/.test(path) && method === "GET") {
        return await route.fulfill(json([]));
      }
      if (/^\/users\/[^/]+\/follow$/.test(path)) {
        return await route.fulfill({ status: 204, headers: CORS_HEADERS, body: "" });
      }
      if (/^\/users\/[^/]+\/saved-recipes/.test(path)) {
        if (method === "GET") return await route.fulfill(json(["1", "3"]));
        return await route.fulfill({ status: 204, headers: CORS_HEADERS, body: "" });
      }
      if (/^\/users\/[^/]+\/cooking-history/.test(path)) {
        if (method === "POST") {
          const body = req.postDataJSON?.() ?? {};
          return await route.fulfill(json({
            recipeId: body.recipeId ?? "",
            recipeTitle: body.recipeTitle ?? "",
            recipeImage: body.recipeImage,
            cookedAt: new Date().toISOString(),
          }));
        }
        return await route.fulfill({ status: 204, headers: CORS_HEADERS, body: "" });
      }

      // ── Recipes ──
      if (path === "/recipes" && method === "GET") {
        return await route.fulfill(
          json({ data: RECIPES, meta: { total: RECIPES.length, page: 1, limit: 200, totalPages: 1 } })
        );
      }
      if (path === "/recipes" && method === "POST") {
        const body = req.postDataJSON?.() ?? {};
        const newRecipe = {
          ...RECIPE_1,
          id: "new-recipe-1",
          slug: "new-recipe-1",
          title: body.title || "Nueva",
          description: body.description || "",
          images: body.images || [],
          ingredients: body.ingredients || [],
          steps: body.steps || [],
          tags: body.tags || [],
          category: body.category || "General",
          cookTime: body.cookTime || 0,
          calories: body.calories || 0,
          protein: body.protein || 0,
          servings: body.servings || 1,
          difficulty: body.difficulty || "Fácil",
          author: { username: "maria_cocina", fullName: "María García" },
        };
        // Add to in-memory list so the detail page can find it afterwards
        if (!RECIPES.find((r) => r.id === newRecipe.id)) RECIPES.push(newRecipe);
        return await route.fulfill(json(newRecipe));
      }
      if (path === "/recipes/tags" && method === "GET") {
        return await route.fulfill(json(["Italiana", "Mexicana", "Desayuno", "Cena", "Saludable", "Postre"]));
      }
      if (path === "/recipes/user-tags" && method === "GET") {
        return await route.fulfill(json([]));
      }
      // Reviews
      const reviewMatch = path.match(/^\/recipes\/([^/]+)\/reviews$/);
      if (reviewMatch) {
        if (method === "GET") return await route.fulfill(json([]));
        if (method === "POST") return await route.fulfill(json({ success: true }));
      }
      // Tags add/remove on recipe
      const tagMatch = path.match(/^\/recipes\/([^/]+)\/tags(?:\/(.+))?$/);
      if (tagMatch) {
        const recipe = RECIPES.find((r) => r.id === tagMatch[1]) ?? RECIPE_1;
        return await route.fulfill(json(recipe));
      }
      // /recipes/id/:id
      const recipeByIdMatch = path.match(/^\/recipes\/id\/([^/]+)$/);
      if (recipeByIdMatch && method === "GET") {
        const recipe = RECIPES.find((r) => r.id === recipeByIdMatch[1]);
        if (!recipe) return await route.fulfill(json({ message: "No encontrada" }, 404));
        return await route.fulfill(json(recipe));
      }
      // /recipes/:slug  (GET = get; PATCH = update; DELETE = delete)
      const recipeSlugMatch = path.match(/^\/recipes\/([^/]+)$/);
      if (recipeSlugMatch) {
        const key = recipeSlugMatch[1];
        if (method === "DELETE") return await route.fulfill({ status: 204, headers: CORS_HEADERS, body: "" });
        const recipe = RECIPES.find((r) => r.id === key || r.slug === key);
        if (method === "PATCH") return await route.fulfill(json(recipe ?? RECIPE_1));
        if (!recipe) return await route.fulfill(json({ message: "No encontrada" }, 404));
        return await route.fulfill(json(recipe));
      }

      // ── Shopping list (in-memory per page) ──
      if (path === "/shopping-list" && method === "GET") {
        return await route.fulfill(json(getShoppingState(page)));
      }
      if (path === "/shopping-list" && method === "DELETE") {
        const s = getShoppingState(page);
        s.entries = [];
        s.ownedItems = [];
        return await route.fulfill(json(s));
      }
      if (path === "/shopping-list/recipes" && method === "POST") {
        const body = req.postDataJSON?.() ?? {};
        const s = getShoppingState(page);
        s.entries = s.entries.filter((e) => e.recipeId !== body.recipeId);
        s.entries.push({
          recipeId: body.recipeId,
          recipeTitle: body.recipeTitle,
          ingredients: body.ingredients || [],
          addedAt: new Date().toISOString(),
        });
        return await route.fulfill(json(s));
      }
      const removeRecipeMatch = path.match(/^\/shopping-list\/recipes\/([^/]+)$/);
      if (removeRecipeMatch && method === "DELETE") {
        const s = getShoppingState(page);
        s.entries = s.entries.filter((e) => e.recipeId !== removeRecipeMatch[1]);
        return await route.fulfill(json(s));
      }
      if (path === "/shopping-list/owned-items" && method === "PUT") {
        const body = req.postDataJSON?.() ?? {};
        const ing = String(body.ingredient || "").toLowerCase().trim();
        const s = getShoppingState(page);
        s.ownedItems = s.ownedItems.includes(ing)
          ? s.ownedItems.filter((x) => x !== ing)
          : [...s.ownedItems, ing];
        return await route.fulfill(json(s));
      }

      // Default: empty success
      if (method === "GET") return await route.fulfill(json([]));
      return await route.fulfill({ status: 204, headers: CORS_HEADERS, body: "" });
    } catch (err) {
      return await route.fulfill(json({ message: "mock-error" }, 500));
    }
  });
}

/**
 * Logs in as the example user (maria@example.com) via localStorage,
 * then reloads the page so the app picks up the session.
 */
export async function loginAsExampleUser(page: Page) {
  await mockApi(page);
  await page.goto("/es/login");
  await page.getByRole("button", { name: /ejemplo/i }).click();
  await page.getByRole("button", { name: /iniciar sesión/i }).click();
  await page.waitForURL("**/es", { timeout: 10000 });
}

/**
 * Sets up a logged-in session by injecting user + token into localStorage
 * before any page script runs, and installs the API mock.
 */
export async function injectSession(page: Page) {
  await mockApi(page);
  await page.addInitScript(
    ({ user, token }) => {
      try {
        localStorage.setItem("auth_user", JSON.stringify(user));
        localStorage.setItem("auth_token", token);
      } catch {}
    },
    { user: MARIA, token: "fake-jwt-token" }
  );
}

/** Convenience for specs that don't need auth, just mocks. */
export async function setupMocks(page: Page) {
  await mockApi(page);
}
