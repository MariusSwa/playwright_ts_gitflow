import { Page, Locator, expect } from "@playwright/test";
import { sel } from "../utils/selectors";

export class CartPage {
  readonly page: Page;
  readonly cartItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItem = page.locator(sel.cartItem);
  }

  async expectHasItems() {
    await expect(this.cartItem.first()).toBeVisible();
  }
}
