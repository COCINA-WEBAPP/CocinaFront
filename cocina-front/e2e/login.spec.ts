import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/es/login");
  });

  test("shows login form by default", async ({ page }) => {
    // Target the form card header specifically
    await expect(page.locator("h1").filter({ hasText: "Iniciar Sesión" })).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
  });

  test("can switch to register tab", async ({ page }) => {
    // The tab text is "Registrarse"
    await page.locator("button").filter({ hasText: "Registrarse" }).click();
    await expect(page.locator("h1").filter({ hasText: "Crear Cuenta" })).toBeVisible();
    await expect(page.locator("#fullName")).toBeVisible();
    await expect(page.locator("#username")).toBeVisible();
  });

  test("can switch back to login tab", async ({ page }) => {
    // Switch to register first
    await page.locator("button").filter({ hasText: "Registrarse" }).click();
    // Switch back to login
    await page.locator("button").filter({ hasText: "Iniciar Sesión" }).first().click();
    await expect(page.locator("#email")).toBeVisible();
  });

  test("fills example user credentials and logs in successfully", async ({ page }) => {
    // Click "Usar ejemplo" to fill credentials
    await page.getByRole("button", { name: /ejemplo/i }).click();
    // Verify fields are filled
    await expect(page.locator("#email")).toHaveValue("maria@example.com");
    await expect(page.locator("#password")).toHaveValue("cualquiera");
    // Submit form - target the submit button specifically
    await page.locator("form button[type='submit']").click();
    // Should redirect to home
    await page.waitForURL("**/es", { timeout: 10000 });
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.locator("#email").fill("nonexistent@test.com");
    await page.locator("#password").fill("wrongpassword");
    await page.locator("form button[type='submit']").click();
    // Should show an error alert
    await expect(page.locator("[role='alert']").first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Register flow", () => {
  test("can register a new user", async ({ page }) => {
    await page.goto("/es/login?tab=register");
    await expect(page.locator("h1").filter({ hasText: "Crear Cuenta" })).toBeVisible();

    // Fill registration form
    await page.locator("#fullName").fill("Test User");
    await page.locator("#username").fill("testuser_e2e");
    await page.locator("#register-email").fill("testuser_e2e@test.com");
    await page.locator("#register-password").fill("password123");
    await page.locator("#confirmPassword").fill("password123");

    // Submit
    await page.locator("form button[type='submit']").click();

    // Should show success message
    await expect(page.getByText(/éxito|exitosamente|cuenta creada/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("shows error when passwords do not match", async ({ page }) => {
    await page.goto("/es/login?tab=register");

    await page.locator("#fullName").fill("Test User");
    await page.locator("#username").fill("testuser2");
    await page.locator("#register-email").fill("testuser2@test.com");
    await page.locator("#register-password").fill("password123");
    await page.locator("#confirmPassword").fill("differentpassword");

    await page.locator("form button[type='submit']").click();

    // Should show password mismatch error
    await expect(page.locator("[role='alert']").first()).toBeVisible({ timeout: 5000 });
  });

  test("shows error when password is too short", async ({ page }) => {
    await page.goto("/es/login?tab=register");

    await page.locator("#fullName").fill("Test User");
    await page.locator("#username").fill("testuser3");
    await page.locator("#register-email").fill("testuser3@test.com");
    await page.locator("#register-password").fill("12345");
    await page.locator("#confirmPassword").fill("12345");

    await page.locator("form button[type='submit']").click();

    await expect(page.locator("[role='alert']").first()).toBeVisible({ timeout: 5000 });
  });

  test("password field is type password (hidden input)", async ({ page }) => {
    await page.goto("/es/login?tab=register");

    const pwdInput = page.locator("#register-password");
    await expect(pwdInput).toHaveAttribute("type", "password");
  });
});
