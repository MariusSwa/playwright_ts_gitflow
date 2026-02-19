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
