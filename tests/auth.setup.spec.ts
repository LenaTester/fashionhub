import { test, expect } from '../fixtures/login.fixture';
import { env } from 'process';
import path from 'path';
import fs from 'fs';

type EnvKey = 'local' | 'staging' | 'production';
const envMap: Record<EnvKey, string> = {
  local: 'user-local.json',
  staging: 'user-staging.json',
  production: 'user-production.json',
};
const playwrightAuthDir = path.join(__dirname, '../playwright/.auth');
if (!fs.existsSync(playwrightAuthDir)) {
  fs.mkdirSync(playwrightAuthDir, { recursive: true });
}

const currentEnv = (process.env.PLAYWRIGHT_ENV || 'local') as EnvKey;
const authFile = path.join(playwrightAuthDir, envMap[currentEnv] || 'user-local.json');

test.describe('Login scenarios', () => {
  test('Successful login', async ({ loggedInPage, page }, testInfo) => {
    testInfo.annotations.push({ type: "GIVEN", description: "a valid user provides the right username & password" });
    await test.step('WHEN the user tries to login', async () => {});
    const { accountPage } = loggedInPage;
    await test.step("THEN user should see a welcome message with his username", async () => {
      await expect(accountPage.welcomeMessage).toHaveText(`Welcome, ${env.USER_NAME}!`);
    });
    await page.context().storageState({ path: authFile });
    console.log(`[auth.setup] Storage state written to: ${authFile}`);
  });
});