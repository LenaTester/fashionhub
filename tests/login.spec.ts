import { test, expect } from '@playwright/test'
import { LoginPage } from '../page-objects/login.page';
import { AccountPage } from '../page-objects/account.page';
import { env } from 'process';

test.beforeEach(async ({ page }) => {
  await page.goto('/fashionhub/login.html')
})

test.describe('Login scenarios', () => {
  test('Successful login', async ({ page }) => {
    test.info().annotations.push({ type: "GIVEN", description: "a valid user provides the right username & password" });
    const loginPage = new LoginPage(page)
    const accountPage = new AccountPage(page)
    await test.step('WHEN the user tries to login', async () => {
      await loginPage.login(env.USER_NAME!, env.PASSWORD!);
    });
    await test.step("THEN user should see a welcome message with his username", async () => {
      await expect(accountPage.welcomeMessage).toHaveText(`Welcome, ${env.USER_NAME}!`);
    });
  })
})