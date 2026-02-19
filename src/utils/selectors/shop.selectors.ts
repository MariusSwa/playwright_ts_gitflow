import { Page } from '@playwright/test';
export const shopSel = {

// =========================
// Shop Main Page
// =========================
	browseProductsLink: (page: Page) =>
		page.getByRole('link', { name: 'browse products' }),

// =========================
// Shop / Products - Filters
// =========================
	filterInput: (page: Page) =>
		page.getByPlaceholder('search name or sku'),

	filterCategory: (page: Page) =>
		page.getByLabel('category'),

	filterSort: (page: Page) =>
		page.getByLabel('sort'),

	filterApplyBtn: (page: Page) =>
		page.getByRole('button', { name: 'apply' }),

	filterResetLnk: (page: Page) =>
		page.getByRole('link', { name: 'reset' }),

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

	cartLink: (page: Page) =>
		page.getByRole('link', { name: 'cart' }),

};