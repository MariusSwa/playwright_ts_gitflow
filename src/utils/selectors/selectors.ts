/**
 * Central place for selectors.
 * Prefer getByRole / getByLabel.
 * Fall back to data-testid when needed.
 */

import { Page } from '@playwright/test';

export const sel = {
  // =========================
  // Navbar / Global
  // =========================
  

  // =========================
  // Breadcrumbs
  // =========================
  breadcrumbs: (page: Page) =>
    page.getByTestId('shopping-breadcrumb'),

  breadcrumbsCart: (page: Page) =>
    page.getByTestId('breadcrumb-cart'),

 

  

  // =========================
  // Shop Main Page
  // =========================
  browseProductsLink: (page: Page) =>
    page.getByRole('link', { name: /browse products/i }),

  // =========================
  // Shop / Products - Filters
  // =========================
  filterInput: (page: Page) =>
    page.getByPlaceholder(/search name or sku/i),

  filterCategory: (page: Page) =>
    page.getByLabel(/category/i),

  filterSort: (page: Page) =>
    page.getByLabel(/sort/i),

  filterApplyBtn: (page: Page) =>
    page.getByRole('button', { name: /apply/i }),

  filterResetLnk: (page: Page) =>
    page.getByRole('link', { name: /reset/i }),

  // =========================
  // Product Specific
  // =========================
  jumpRopeCard: (page: Page) =>
    page.getByTestId('product-card-Jump Rope'),

  addJumpRope: (page: Page) =>
    page.getByTestId('product-add-SKU-ROPE-019'),

  // Dynamic product selectors (Recommended going forward)
  productCardByName: (page: Page, name: string) =>
    page.getByRole('heading', { name }).locator('..'),

  addToCartBySKU: (page: Page, sku: string) =>
    page.getByTestId(`product-add-${sku}`),

  // =========================
  // Cart
  // =========================
  cartLink: (page: Page) =>
    page.getByRole('link', { name: /cart/i }),

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
