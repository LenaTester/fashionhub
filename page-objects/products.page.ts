import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productsSection: Locator;
  readonly productList: Locator;
  readonly productItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsSection = page.locator('.products-section');
    this.productList = page.locator('.product-list');
    this.productItems = page.locator('.product');
  }

  async getProductCount(): Promise<number> {
    return this.productItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return this.productItems.locator('.product-info h3').allTextContents();
  }

  async getProductDescriptions(): Promise<string[]> {
    return this.productItems.locator('.product-description').allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return this.productItems.locator('.product-info p:not(.product-description)').allTextContents();
  }

  async addToCartByName(productName: string) {
    const product = this.productItems.filter({ has: this.page.locator(`.product-info h3:text-is("${productName}")`) });
    await product.locator('button', { hasText: 'Add to Cart' }).click();
  }

  async getProductImageSrcByName(productName: string): Promise<string | null> {
    const product = this.productItems.filter({ has: this.page.locator(`.product-info h3:text-is("${productName}")`) });
    return product.locator('.image-container img').first().getAttribute('src');
  }
}
