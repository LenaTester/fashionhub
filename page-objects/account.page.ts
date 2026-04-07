import { Locator, type Page } from "@playwright/test";

export class AccountPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('h2');
    this.logoutButton = page.locator('logout-button');
  }
}