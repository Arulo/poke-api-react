import { test, expect } from '@playwright/test';
import { getMockFilePath } from './utils/getMockFilePath';
import fs from 'fs';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v2/**', async (route) => {
    const url = route.request().url();
    const filePath = getMockFilePath(url);

    if (filePath && fs.existsSync(filePath)) {
      const body = fs.readFileSync(filePath, 'utf8');
      route.fulfill({
        body,
        contentType: 'application/json',
        status: 200
      });
    } else {
      console.warn(`🟡 No mock data for: ${url}`);
      route.abort();
    }
  });
});

// Skip until I have the API calls mocked
test('Should have title', async ({ page }) => {
  await page.goto('');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Poke\-API \- React project for practicing test automation/);
});

test('Should present main components', async ({ page }) => {
  await page.goto('');

  await expect(page.getByTestId('type_filters')).toBeVisible();
  await expect(page.getByTestId('pokemon_list')).toBeVisible();
  await expect(page.getByTestId('pokemon_card').nth(0)).toBeVisible();

});


test('Should Render Mock Response Pokemon', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Asegurate de que un nombre de Pokémon del mock 0–20 esté visible
  await expect(page.locator('text=bulbasaur')).toBeVisible();
});

test('Should dynamically disable prev and next buttons' , async ({ page }) => {
  await page.goto('http://localhost:3000');


  await expect(page.locator('text=PREV')).toBeDisabled();
  await expect(page.locator('text=NEXT')).toBeEnabled();
});