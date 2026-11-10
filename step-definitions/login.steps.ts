import { expect } from '@playwright/test';
import { loginData } from '../test-data/login-data';
import { Then, When } from './fixtures';

When('I open the login form', async ({ loginPage }) => {
  await loginPage.openLoginForm();
  await expect(loginPage.loginModal).toBeVisible();
});

When('I log in with valid credentials', async ({ loginPage }) => {
  await loginPage.login(loginData.username, loginData.password);
});

When('I log in with a wrong password', async ({ loginPage }) => {
  await loginPage.login(loginData.username, loginData.invalidPassword);
});

Then('I see the welcome message for my user', async ({ loginPage }) => {
  await expect(loginPage.welcomeUser).toHaveText(loginData.welcomeText);
});

Then('I see the log out link', async ({ loginPage }) => {
  await expect(loginPage.logoutNavLink).toBeVisible();
});

Then('I see the wrong password alert', async ({ alert }) => {
  // The alert appears shortly after the click, so poll until it is recorded
  await expect.poll(() => alert.message).toBe(loginData.wrongPasswordMessage);
});

Then('I am not logged in', async ({ loginPage }) => {
  await expect(loginPage.welcomeUser).toBeHidden();
  await expect(loginPage.logoutNavLink).toBeHidden();
});
