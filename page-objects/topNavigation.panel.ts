import { Page, Locator } from '@playwright/test';

export class TopNavigationPanel {
  readonly page: Page;
  readonly nav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.locator('nav');
  }

  getLinkByText(linkText: string): Locator {
    return this.nav.locator(`a:has-text("${linkText}")`);
  }

  async clickLink(linkText: string) {
    await this.getLinkByText(linkText).click();
  }

  async isLinkActive(linkText: string): Promise<boolean> {
    const link = this.getLinkByText(linkText);
    return (await link.getAttribute('class'))?.includes('current') ?? false;
  }

  async getAllLinks(): Promise<{ text: string; href: string; active: boolean }[]> {
    const links = this.nav.locator('a');
    const count = await links.count();
    const result = [];
    for (let i = 0; i < count; i++) {
      const el = links.nth(i);
      result.push({
        text: await el.textContent() || '',
        href: await el.getAttribute('href') || '',
        active: (await el.getAttribute('class'))?.includes('current') ?? false,
      });
    }
    return result;
  }
}
