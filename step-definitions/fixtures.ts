import { test as base, createBdd } from 'playwright-bdd';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';

// Records the message of any browser alert() the site shows. Demoblaze reports
// some errors (e.g. a wrong password) this way. The alert is accepted so the
// page does not stay blocked.
type AlertState = { message?: string };

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  alert: AlertState;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  alert: async ({ page }, use) => {
    const state: AlertState = {};
    page.on('dialog', (dialog) => {
      state.message = dialog.message();
      void dialog.accept();
    });
    await use(state);
  },
});

export const { Given, When, Then, Before, After } = createBdd(test);
