import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import logger from '../logger/logger';
import { loginData } from '../test-data/login-data';

test.describe('Demoblaze login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }, testInfo) => {
    logger.info(`Running test: ${testInfo.title}`);
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.afterEach(async () => {
    // Only log out if the test got as far as logging in
    if (await loginPage.logoutNavLink.isVisible()) {
      await loginPage.logout();
      await expect(loginPage.loginNavLink).toBeVisible();
    }
  });

  test(
    'logs in with valid credentials',
    { tag: ['@smoke', '@login'] },
    async () => {
      await loginPage.openLoginForm();
      await expect(loginPage.loginModal).toBeVisible();

      await loginPage.login(loginData.username, loginData.password);

      await expect(loginPage.welcomeUser).toHaveText(loginData.welcomeText);
      await expect(loginPage.logoutNavLink).toBeVisible();
    },
  );

  test(
    'shows an error when the password is wrong',
    { tag: ['@login', '@negative'] },
    async ({ page }) => {
      await loginPage.openLoginForm();
      await expect(loginPage.loginModal).toBeVisible();

      // The site reports the failure with a browser alert dialog
      const dialogPromise = page.waitForEvent('dialog');
      await loginPage.login(loginData.username, loginData.invalidPassword);
      const dialog = await dialogPromise;
      expect(dialog.message()).toBe(loginData.wrongPasswordMessage);
      await dialog.accept();

      // And the user is not logged in
      await expect(loginPage.welcomeUser).toBeHidden();
      await expect(loginPage.logoutNavLink).toBeHidden();
    },
  );
});
