import { Page, Locator, expect } from "@playwright/test";
import { sel } from "../utils/selectors";
// import { routes } from "../utils/routes";

export class CartPage {
  readonly page: Page;
  readonly cartItem: Locator;
  readonly cartJumpRopeItem: Locator;



  constructor(page: Page) {
    this.page = page;
    this.cartItem = page.locator(sel.cartItem);
    this.cartJumpRopeItem = page.locator(sel.cartJumpRopeItem);
  }

  //Expand this to look for any SKU in the cart, not just jump rope
  async expectHasItems() {
    await expect(this.cartJumpRopeItem).toBeVisible();
  }

  async confirmCartItem(sku: string) {
    const cartItem = this.page.locator(sel.cartItemBySKU(sku));
    await expect(cartItem).toBeVisible();
  }
}
  