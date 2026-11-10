import logger from '../logger/logger';
import { After, Before } from './fixtures';

// Runs before every scenario (replaces the old beforeEach in each spec).
Before(({ $testInfo }) => {
  logger.info(`Running test: ${$testInfo.title}`);
});

// Scenarios tagged @login must log out if they got as far as logging in
// (replaces the old afterEach in login.spec.ts).
After({ tags: '@login' }, async ({ loginPage }) => {
  if (await loginPage.logoutNavLink.isVisible()) {
    await loginPage.logout();
  }
});
