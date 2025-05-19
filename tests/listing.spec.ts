import { test, expect } from "@playwright/test";
import { POKEMON_TYPES } from "../src/data/pokemonTypes";
import { setupApiMocks } from "./utils/setupMocks";

test.beforeEach(async ({ page }) => {
  await setupApiMocks(page);
  await page.goto("");
});


test("Should present header, footer and title tag", async ({ page }) => {
  await expect(page).toHaveTitle(
    /Poke\-API \- React project for practicing test automation/
  );
  await expect(page.getByTestId("main_heading")).toBeVisible();
  await expect(page.getByTestId("logo")).toBeVisible();
  await expect(page.getByTestId("footer")).toBeVisible();
});

test("Should present main components", async ({ page }) => {
  await expect(page.getByTestId("type_filters")).toBeVisible();
  await expect(page.getByTestId("pokemon_list")).toBeVisible();
  await expect(page.getByTestId("pokemon_card").nth(0)).toBeVisible();
  await expect(page.getByTestId("pagination_controls")).toBeVisible();
  await expect(page.getByText("PREV")).toBeVisible();
  await expect(page.getByText("NEXT")).toBeVisible();
});

test("Should Render Mock Response Pokemon", async ({ page }) => {
  await expect(page.getByText("Mock bulbasaur")).toBeVisible();
  await expect(page.getByText("Mock charmeleon")).toBeVisible();
});

test("Should allow the user to navigate between pages", async ({ page }) => {
  await expect(page.getByText("PREV")).toBeDisabled();
  await expect(page.getByText("NEXT")).toBeEnabled();
  await page.getByText("NEXT").click();

  await expect(page.getByText("Mock wartortle")).toBeVisible();
  await expect(page.getByText("Mock pikachu")).toBeVisible();

  // Can't validate that "NEXT" is disabled, cause I'm mocking the response
  await expect(page.getByText("PREV")).toBeEnabled();
});

test("Should render all type filters", async ({ page }) => {
  await expect(page.getByTestId("type_filters")).toBeVisible();

  // Normal forEach loops aren't compatible with promises so using forEach would not work as expected with async await and it will just create confusion. for...of seems like the way to go.
  for (const type of POKEMON_TYPES) {
    const img = page.getByRole("img", { name: type.name });
    await expect(img).toBeVisible();
  }
});
