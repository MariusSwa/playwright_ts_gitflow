import { Page } from '@playwright/test';
export const breadcrumbSel = {

// =========================
// Shop Breadcrumb
// =========================
    breadcrumbsShop: (page: Page) =>
        page.getByTestId('shopping-breadcrumb'),

    breadcrumbsCart: (page: Page) =>
        page.getByTestId('breadcrumb-cart'),
};