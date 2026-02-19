import { Page, Locator, expect } from "@playwright/test";
import { cartSel } from "../utils/selectors/cart.selectors";
// import { routes } from "../utils/routes";

export class CartPage {
  readonly page: Page;
  readonly cartItem: Locator;
  readonly cartJumpRopeItem: Locator;



  constructor(page: Page) {
    this.page = page;
    this.cartItem = cartSel.cartItem(page);
    this.cartJumpRopeItem = cartSel.cartJumpRopeItem(page);
  }

  //Expand this to look for any SKU in the cart, not just jump rope
  async expectHasItems() {
    await expect(this.cartJumpRopeItem).toBeVisible();
  }

  async confirmCartItem(sku: string) {
    const cartItem = cartSel.cartItemBySKU(this.page, sku);
    await expect(cartItem).toBeVisible();
  }
}
  