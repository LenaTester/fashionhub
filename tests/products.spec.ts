import { test, expect } from '@playwright/test'
import { ProductsPage } from '../page-objects/products.page';
import { TopNavigationPanel } from '../page-objects/topNavigation.panel';
import { ShoppingCartPage } from '../page-objects/shoppingCart.page';

type EnvKey = 'local' | 'staging' | 'production';
const envMap = {
  local: 'playwright/.auth/user-local.json',
  staging: 'playwright/.auth/user-staging.json',
  production: 'playwright/.auth/user-production.json',
};
const currentEnv = (process.env.PLAYWRIGHT_ENV || 'local') as EnvKey;
const storageStateFile = envMap[currentEnv] || envMap.local;

test.use({ storageState: storageStateFile });

test.describe("Products tests", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL?.replace('/login.html', '/products.html')}`);
  });
  test("user should be able to add a product to the cart", async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: "GIVEN", description: "user is on Products page" });
    const productsPage = new ProductsPage(page);
    const topNavigationPanel = new TopNavigationPanel(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    await test.step(`WHEN: I add ${await productsPage.productItems.first().textContent()} to the cart`, async () => {
      await productsPage.addToCartByName('Peacock Coat');
    });
    await test.step(`AND: I navigate to Shopping Bag`, async () => {
      await topNavigationPanel.clickLink('Shopping Bag');
    });
    await test.step(`THEN: I should see the product in the Shopping Bag`, async () => {
      await expect(shoppingCartPage.cartItems).toContainText('Peacock Coat');
    });
  });
});