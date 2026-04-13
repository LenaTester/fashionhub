import { Page, Locator } from '@playwright/test';

export class ShoppingCartPage {
  readonly page: Page;
  readonly cartSection: Locator;
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartSection = page.locator('.cart-section');
    this.cartItems = page.locator('#cart-items .cart-item');
    this.totalPrice = page.locator('#total-price');
    this.checkoutButton = page.locator('button', { hasText: 'Checkout' });
  }

  async getCartItemNames(): Promise<string[]> {
    return this.cartItems.locator('.cart-item-info h3').allTextContents();
  }

  async getCartItemPrices(): Promise<string[]> {
    return this.cartItems.locator('.cart-item-info p').allTextContents();
  }

  async removeItemByName(productName: string) {
    const item = this.cartItems.filter({ has: this.page.locator(`.cart-item-info h3`, { hasText: productName }) });
    await item.locator('button', { hasText: 'Remove' }).click();
  }

  async getTotalPrice(): Promise<string> {
    return await this.totalPrice.textContent() || '';
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
