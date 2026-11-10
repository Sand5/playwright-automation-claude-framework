import { expect } from '@playwright/test';
import { homeData, productsByCategory } from '../test-data/home.data';
import { Given, Then, When } from './fixtures';

const categoryNames = Object.keys(productsByCategory);

// Turns the text from the feature file into a valid category name, so a typo
// in a scenario fails with a clear message.
function toCategory(name: string): keyof typeof productsByCategory {
  if (!(name in productsByCategory)) {
    throw new Error(
      `Unknown category "${name}". Use one of: ${categoryNames.join(', ')}`,
    );
  }
  return name as keyof typeof productsByCategory;
}

Given('I am on the home page', async ({ homePage }) => {
  await homePage.goto();
});

Then('the page title is correct', async ({ page }) => {
  await expect(page).toHaveTitle(homeData.title);
});

Then('the navigation bar is displayed', async ({ homePage }) => {
  await expect(homePage.brand).toBeVisible();
  for (const link of Object.values(homePage.navLinks)) {
    await expect(link).toBeVisible();
  }
});

Then('the carousel is displayed', async ({ homePage }) => {
  await expect(homePage.carousel).toBeVisible();
});

Then('the categories heading and links are displayed', async ({ homePage }) => {
  await expect(homePage.categoriesHeading).toHaveText(
    homeData.categoriesHeading,
  );
  for (const link of Object.values(homePage.categoryLinks)) {
    await expect(link).toBeVisible();
  }
});

Then('the product grid and pagination are displayed', async ({ homePage }) => {
  await expect(homePage.firstProductCard).toBeVisible();
  await expect(homePage.previousButton).toBeVisible();
  await expect(homePage.nextButton).toBeVisible();
});

Then('the footer is displayed', async ({ homePage }) => {
  await expect(homePage.footer).toBeVisible();
});

When('I select the {string} category', async ({ homePage }, name: string) => {
  await homePage.selectCategory(toCategory(name));
});

Then(
  'only the {string} products are listed',
  async ({ homePage }, name: string) => {
    await expect(homePage.productTitles).toHaveText([
      ...productsByCategory[toCategory(name)],
    ]);
  },
);
