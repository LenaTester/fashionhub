import { test as base } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import { AccountPage } from '../page-objects/account.page';

export const test = base.extend<{ loggedInPage: { page: any, accountPage: AccountPage } }>({
  async loggedInPage({ baseURL, page }, use) {
    await page.goto(baseURL!);
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);
    await loginPage.login(process.env.USER_NAME!, process.env.PASSWORD!);
    await use({ page, accountPage });
  },
});

export { expect } from '@playwright/test';
