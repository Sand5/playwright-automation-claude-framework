import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import logger from '../logger/logger';
import { homeData } from '../test-data/home.data';

test.describe('Demoblaze homepage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }, testInfo) => {
    logger.info(`Running test: ${testInfo.title}`);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('displays the core homepage elements', async ({ page }) => {
    await expect(page).toHaveTitle(homeData.title);

    // Navigation bar
    await expect(homePage.brand).toBeVisible();
    for (const link of Object.values(homePage.navLinks)) {
      await expect(link).toBeVisible();
    }

    // Carousel
    await expect(homePage.carousel).toBeVisible();

    // Categories
    await expect(homePage.categoriesHeading).toHaveText(
      homeData.categoriesHeading,
    );
    for (const link of Object.values(homePage.categoryLinks)) {
      await expect(link).toBeVisible();
    }

    // Product grid and pagination
    await expect(homePage.firstProductCard).toBeVisible();
    await expect(homePage.previousButton).toBeVisible();
    await expect(homePage.nextButton).toBeVisible();

    // Footer
    await expect(homePage.footer).toBeVisible();
  });

  test('filters the products when the Phones category is selected', async () => {
    await homePage.selectCategory('Phones');

    await expect(homePage.productTitles).toHaveText([
      ...homeData.phoneProducts,
    ]);
  });

  test('filters the products when the Laptops category is selected', async () => {
    await homePage.selectCategory('Laptops');

    await expect(homePage.productTitles).toHaveText([
      ...homeData.laptopProducts,
    ]);
  });

  test('filters the products when the Monitors category is selected', async () => {
    await homePage.selectCategory('Monitors');

    await expect(homePage.productTitles).toHaveText([
      ...homeData.monitorProducts,
    ]);
  });
});
