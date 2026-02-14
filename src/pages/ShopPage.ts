import { Page, Locator, expect } from "@playwright/test";
import { sel } from "../utils/selectors";

export class ShopPage {
  readonly page: Page;
  readonly productCard: Locator;
  readonly addToCartBtn: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCard = page.locator(sel.productCard);
    this.addToCartBtn = page.locator(sel.addToCartBtn);
    this.cartLink = page.locator(sel.cartLink).first();
  }

  async goto() {
    // Update if your shopping page route differs
    await this.page.goto("/shopping/index.php", { waitUntil: "domcontentloaded" });
  }

  async addFirstProductToCart() {
    await expect(this.productCard.first()).toBeVisible();

    // Prefer scoping add-to-cart inside the first card if possible.
    const firstCard = this.productCard.first();
    const scopedBtn = firstCard.locator(sel.addToCartBtn);

    if (await scopedBtn.count()) {
      await scopedBtn.first().click();
      return;
    }

    // Fallback: click first add button on the page.
    await expect(this.addToCartBtn.first()).toBeVisible();
    await this.addToCartBtn.first().click();
  }

  async openCart() {
    await expect(this.cartLink).toBeVisible();
    await this.cartLink.click();
  }
}
