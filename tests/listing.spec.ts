import { test, expect } from "@playwright/test";
import { getMockFilePath } from "./utils/getMockFilePath";
import { POKEMON_TYPES } from "../src/data/pokemonTypes";

import fs from "fs";

test.beforeEach(async ({ page }) => {
  // Intercepts all actual API calls
  await page.route("**/api/v2/**", async (route) => {
    const url = route.request().url();
    const filePath = getMockFilePath(url);

    // This will print the files requested, important when interacting with pagination buttons
    console.log("This is the filePath:", filePath);

    if (filePath && fs.existsSync(filePath)) {
      // Read mock JSON file from disc
      const body = fs.readFileSync(filePath, "utf8");
      // Respond with the previously stored JSON response
      route.fulfill({ body, contentType: "application/json" });
    } else {
      console.warn(`⚠️ No mock data for: ${url}`);
      route.abort();
    }
  });

  // Visit page on each test
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
  await expect(page.getByText("bulbasaur")).toBeVisible();
  await expect(page.getByText("charmeleon")).toBeVisible();
});

test("Should allow the user to navigate between pages", async ({ page }) => {
  await expect(page.getByText("PREV")).toBeDisabled();
  await expect(page.getByText("NEXT")).toBeEnabled();
  await page.getByText("NEXT").click();

  await expect(page.getByText("wartortle")).toBeVisible();
  await expect(page.getByText("pikachu")).toBeVisible();

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
