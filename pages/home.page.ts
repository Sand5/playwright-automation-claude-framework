import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import logger from '../logger/logger';

export class HomePage extends BasePage {
  // Navigation bar
  readonly navBar: Locator;
  readonly brand: Locator;
  readonly navLinks: Record<
    'Home' | 'Contact' | 'About us' | 'Cart' | 'Log in' | 'Sign up',
    Locator
  >;

  // Carousel
  readonly carousel: Locator;

  // Categories
  readonly categoriesHeading: Locator;
  readonly categoryLinks: Record<'Phones' | 'Laptops' | 'Monitors', Locator>;

  // Products and pagination
  readonly firstProductCard: Locator;
  readonly productTitles: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;

  // Footer
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);

    this.navBar = page.locator('#narvbarx');
    this.brand = page.locator('#nava');
    this.navLinks = {
      Home: this.navBar.getByRole('link', { name: 'Home' }),
      Contact: this.navBar.getByRole('link', { name: 'Contact' }),
      'About us': this.navBar.getByRole('link', { name: 'About us' }),
      Cart: this.navBar.getByRole('link', { name: 'Cart' }),
      'Log in': this.navBar.getByRole('link', { name: 'Log in' }),
      'Sign up': this.navBar.getByRole('link', { name: 'Sign up' }),
    };

    this.carousel = page.locator('#carouselExampleIndicators');

    this.categoriesHeading = page.locator('#cat');
    this.categoryLinks = {
      Phones: page.getByRole('link', { name: 'Phones', exact: true }),
      Laptops: page.getByRole('link', { name: 'Laptops', exact: true }),
      Monitors: page.getByRole('link', { name: 'Monitors', exact: true }),
    };

    this.firstProductCard = page.locator('#tbodyid .card').first();
    this.productTitles = page.locator('#tbodyid .card-title');
    this.previousButton = page.locator('#prev2');
    this.nextButton = page.locator('#next2');

    this.footer = page.locator('#footc');
  }

  async goto(): Promise<void> {
    logger.info('Opening the Home page');
    await this.navigate('/index.html');
  }

  async selectCategory(name: keyof HomePage['categoryLinks']): Promise<void> {
    logger.info(`Selecting category: ${name}`);
    await this.categoryLinks[name].click();
  }
}
