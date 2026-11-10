import type { Page } from '@playwright/test';
import logger from '../logger/logger';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
    logger.info(`Accessing URL: ${url}`);
  }
}
