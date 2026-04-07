import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads the home page with header and footer", async ({ page }) => {
    await page.goto("/es");
    // Header should show the brand name (use first() since mobile nav also exists)
    await expect(page.getByText("RecipeShare").first()).toBeVisible();
    // Footer should be present
    await expect(page.locator("footer")).toBeVisible();
  });

  test("has correct page title", async ({ page }) => {
    await page.goto("/es");
    await expect(page).toHaveTitle(/RecipeShare/);
  });

  test("header navigation links are present", async ({ page }) => {
    await page.goto("/es");
    // Target the desktop header nav
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Inicio" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Explorar" })).toBeVisible();
  });

  test("search form is present in header", async ({ page }) => {
    await page.goto("/es");
    await expect(page.locator("header").getByPlaceholder("Buscar recetas...")).toBeVisible();
  });

  test("skip-to-content link exists for accessibility", async ({ page }) => {
    await page.goto("/es");
    const skipLink = page.locator("a.skip-link");
    await expect(skipLink).toBeAttached();
  });
});
