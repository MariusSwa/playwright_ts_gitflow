// This file defines the CartPage class, which represents the cart page of the application. 
// It includes locators for elements on the cart page and methods to interact with those 
// elements and make assertions about the cart's state. The methods are designed to be used 
// in test cases to verify that items have been added to the cart correctly. The class is structured 
// to allow for easy expansion in the future, such as adding more methods to check for 
// different SKUs or cart functionalities.

import { Page, Locator, expect } from "@playwright/test";
import { cartSel } from "../utils/selectors/cart.selectors";

// The export allows this class to be imported and used in test files, such as cart.spec.ts, where 
// we can create an instance of CartPage and call its methods to verify the cart's contents after 
// adding items from the ShopPage.
export class CartPage {
  readonly page: Page;
  readonly cartItem: Locator;
  readonly cartJumpRopeItem: Locator;

  // The constructor initializes the page and locators for the cart items. The cartItem locator can be used
  // to check for any item in the cart, while cartJumpRopeItem is specific to the Jump Rope product. 
  // This structure allows for easy expansion to include more specific locators for different products as needed.
  constructor(page: Page) {
    this.page = page;
    this.cartItem = cartSel.cartItem(page);
    this.cartJumpRopeItem = cartSel.cartJumpRopeItem(page);
  }

  // Expand this to look for any SKU in the cart, not just jump rope
  async expectHasItems() {
    // This method checks if there are any items in the cart by verifying that the cartItem locator is visible.
    await expect(this.cartJumpRopeItem).toBeVisible();
  }

  // This method can be expanded to check for specific SKUs in the cart. It takes a SKU as an argument and uses 
  // a dynamic locator to find the corresponding cart item, then asserts that it is visible. This allows for 
  // more flexible and comprehensive testing of the cart's contents.
  async confirmCartItem(sku: string) {
    const cartItem = cartSel.cartItemBySKU(this.page, sku);
    await expect(cartItem).toBeVisible();
  }
}
  