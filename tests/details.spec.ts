import { test, expect } from "@playwright/test";
import { setupApiMocks } from "./utils/setupMocks";


test.beforeEach(async ({ page }) => {
  await setupApiMocks(page);
  await page.goto("/pokemon/pikachu");
});

test("Should present header, footer and title tag", async ({ page }) => {
  await expect(page).toHaveTitle(
    /Poke\-API \- React project for practicing test automation/
  );
  await expect(page.getByTestId("main_heading")).toBeVisible();
  await expect(page.getByTestId("footer")).toBeVisible();
});

test("Should render pokemon card elements", async ({ page }) => {
  await expect(page.getByTestId("pokeball_watermark")).toBeVisible();
  await expect(page.getByTestId("pokemon_heading")).toBeVisible();
  await expect(page.locator("css=.pokemon_img")).toBeVisible();
  await expect(page.getByTestId("pokemon_type_badge-electric")).toBeVisible();
  await expect(page.getByText("Height:")).toHaveText("Height: 4");
  await expect(page.getByText("Weight:")).toHaveText("Weight: 60");
});

test("Should render multiple type badges", async ({ page }) => {
  await page.goto("/pokemon/beedrill")
  await expect(page.getByTestId('pokemon_type_badge-poison')).toBeVisible();
  await expect(page.getByTestId('pokemon_type_badge-bug')).toBeVisible();
});

test("Should navigate back to listing page", async ({ page }) => {
  await expect(page).toHaveURL(/\/pokemon\/pikachu/);
  await expect(page.getByTestId("back_button")).toBeVisible();
  await page.getByTestId("back_button").click();
  await expect(page).toHaveURL("/");
});
