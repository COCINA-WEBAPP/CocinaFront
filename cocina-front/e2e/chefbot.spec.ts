import { test, expect } from "@playwright/test";

// ── HU 23 — Sustitución de ingredientes con ChefBot ──

test.describe("HU 23 — ChefBot ingredient substitution", () => {
  test("floating chat button is visible on the page", async ({ page }) => {
    await page.goto("/es");
    await page.waitForTimeout(2000);

    const chatBtn = page.locator("button[aria-label='Abrir ChefBot']");
    await expect(chatBtn).toBeVisible({ timeout: 10000 });
  });

  test("clicking the chat button opens the chat window", async ({ page }) => {
    await page.goto("/es");
    await page.waitForTimeout(2000);

    await page.locator("button[aria-label='Abrir ChefBot']").click();

    const chatWindow = page.locator("section[role='dialog']");
    await expect(chatWindow).toBeVisible({ timeout: 5000 });
    await expect(chatWindow.locator("h3").filter({ hasText: "ChefBot" })).toBeVisible();
  });

  test("chat shows a welcome message", async ({ page }) => {
    await page.goto("/es");
    await page.waitForTimeout(2000);

    await page.locator("button[aria-label='Abrir ChefBot']").click();

    const chatDialog = page.locator("section[role='dialog']");
    await expect(chatDialog.getByText(/ChefBot/).first()).toBeVisible({ timeout: 5000 });
  });

  test("can send a message about ingredient substitution", async ({ page }) => {
    await page.goto("/es");
    await page.waitForTimeout(2000);

    await page.locator("button[aria-label='Abrir ChefBot']").click();

    const chatDialog = page.locator("section[role='dialog']");
    await expect(chatDialog).toBeVisible({ timeout: 5000 });

    const input = chatDialog.locator("input[type='text']");
    await input.fill("¿Con qué puedo reemplazar el huevo?");
    await input.press("Enter");

    await page.waitForTimeout(2000);

    await expect(
      chatDialog.getByText(/sustituir|semillas|chía|lino/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("bot rejects non-cooking topics", async ({ page }) => {
    await page.goto("/es");
    await page.waitForTimeout(2000);

    await page.locator("button[aria-label='Abrir ChefBot']").click();

    const chatDialog = page.locator("section[role='dialog']");
    const input = chatDialog.locator("input[type='text']");
    await input.fill("Háblame de futbol");
    await input.press("Enter");

    await page.waitForTimeout(2000);

    await expect(
      chatDialog.getByText(/solo puedo ayudarte con temas de cocina/i).first()
    ).toBeVisible({ timeout: 5000 });
  });
});

// ── HU 24 — Explicación de términos culinarios ──

test.describe("HU 24 — ChefBot culinary terms", () => {
  test("bot explains a culinary term", async ({ page }) => {
    await page.goto("/es");
    await page.waitForTimeout(2000);

    await page.locator("button[aria-label='Abrir ChefBot']").click();

    const chatDialog = page.locator("section[role='dialog']");
    const input = chatDialog.locator("input[type='text']");
    await input.fill("¿Qué es blanquear?");
    await input.press("Enter");

    await page.waitForTimeout(2000);

    await expect(
      chatDialog.getByText(/blanquear|agua hirviendo|agua con hielo/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("shows suggestion chips on open", async ({ page }) => {
    await page.goto("/es");
    await page.waitForTimeout(2000);

    await page.locator("button[aria-label='Abrir ChefBot']").click();

    const chatDialog = page.locator("section[role='dialog']");
    const chips = chatDialog.locator("button.rounded-full");
    await expect(chips.first()).toBeVisible({ timeout: 5000 });
  });

  test("clicking a suggestion chip sends a message", async ({ page }) => {
    await page.goto("/es");
    await page.waitForTimeout(2000);

    await page.locator("button[aria-label='Abrir ChefBot']").click();

    const chatDialog = page.locator("section[role='dialog']");
    const chip = chatDialog.locator("button.rounded-full").first();
    await expect(chip).toBeVisible({ timeout: 5000 });
    await chip.click();

    await page.waitForTimeout(2000);
    const messages = chatDialog.locator("[role='log'] > div > div");
    const count = await messages.count();
    expect(count).toBeGreaterThan(1);
  });

  test("can close the chat", async ({ page }) => {
    await page.goto("/es");
    await page.waitForTimeout(2000);

    await page.locator("button[aria-label='Abrir ChefBot']").click();

    const chatDialog = page.locator("section[role='dialog']");
    await expect(chatDialog).toBeVisible({ timeout: 5000 });

    await chatDialog.locator("button[aria-label='Cerrar chat']").click();

    await expect(chatDialog).not.toBeVisible({ timeout: 3000 });
  });
});
