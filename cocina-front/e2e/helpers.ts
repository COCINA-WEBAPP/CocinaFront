import { Page } from "@playwright/test";

/**
 * Logs in as the example user (maria@example.com) via localStorage,
 * then reloads the page so the app picks up the session.
 */
export async function loginAsExampleUser(page: Page) {
  await page.goto("/es/login");
  // Click the "Usar ejemplo" button to fill credentials
  await page.getByRole("button", { name: /ejemplo/i }).click();
  // Submit the login form
  await page.getByRole("button", { name: /iniciar sesión/i }).click();
  // Wait for navigation to home
  await page.waitForURL("**/es", { timeout: 10000 });
}

/**
 * Sets up a logged-in session via localStorage injection (faster, no UI).
 * Uses maria@example.com mock user data.
 */
export async function injectSession(page: Page) {
  await page.goto("/es");
  await page.evaluate(() => {
    // Replicate the mock user stored by the app's login service
    const mockUser = {
      id: "1",
      username: "maria_cocina",
      email: "maria@example.com",
      fullName: "María García",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      bio: "Apasionada de la cocina mediterránea",
      followers: ["2", "3", "5"],
      following: ["2", "4"],
      savedRecipes: ["1", "3"],
      cookingHistory: [],
      createdAt: "2024-01-15",
    };
    localStorage.setItem("recipeshare_session", JSON.stringify(mockUser));
  });
  await page.reload();
}
