// This file defines selectors for the cart page of the application. 
// These selectors are used to locate and interact with elements on 
// the cart page during testing. The selectors are organized under 
// the `cartSel` object, which contains methods that return locators 
// for specific cart elements, such as cart items, cart count, and 
// specific items like the jump rope. By using these selectors in 
// test cases, we can easily access and verify the presence and 
// functionality of cart components in the user interface.

import { Page } from '@playwright/test';

export const cartSel = {

// =========================
// Cart
// =========================
    cartItem: (page: Page) =>
        page.getByTestId('cart-item'),

    cartCount: (page: Page) =>
        page.getByTestId('cart-count'),

    cartJumpRopeItem: (page: Page) =>
        page.locator('[data-sku="SKU-ROPE-019"]'),

    // Advanced: dynamic SKU lookup
    cartItemBySKU: (page: Page, sku: string) =>
        page.locator(`[data-sku="${sku}"]`),
};
