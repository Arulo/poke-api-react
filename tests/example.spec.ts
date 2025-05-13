import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Poke\-API \- React project for practicing test automation/);
});

test('has main components', async ({ page }) => {
  await page.goto('');


  await expect(page.getByTestId('type_filters')).toBeVisible();
  await expect(page.getByTestId('pokemon_list')).toBeVisible();
  await expect(page.getByTestId('pokemon_card').nth(0)).toBeVisible();

});
