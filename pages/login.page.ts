import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'
import logger from '../logger/logger'

export class LoginPage extends BasePage {
  // Navigation bar
  readonly loginNavLink: Locator
  readonly logoutNavLink: Locator
  readonly welcomeUser: Locator

  // Login modal
  readonly loginModal: Locator
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    super(page)

    this.loginNavLink = page.locator('#login2')
    this.logoutNavLink = page.locator('#logout2')
    this.welcomeUser = page.locator('#nameofuser')

    this.loginModal = page.locator('#logInModal')
    this.usernameInput = page.locator('#loginusername')
    this.passwordInput = page.locator('#loginpassword')
    this.submitButton = this.loginModal.getByRole('button', { name: 'Log in' })
  }

  async goto(): Promise<void> {
    logger.info('Opening the Home page')
    await this.navigate('/index.html')
  }

  async openLoginForm(): Promise<void> {
    logger.info('Clicking the Log in button')
    await this.loginNavLink.click()
  }

  async login(username: string, password: string): Promise<void> {
    logger.info(`Logging in as: ${username}`)
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async logout(): Promise<void> {
    logger.info('Logging out')
    await this.logoutNavLink.click()
  }
}
