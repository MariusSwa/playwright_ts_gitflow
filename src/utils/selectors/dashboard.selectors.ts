// =========================
// Dashboard
// =========================

import { Page } from '@playwright/test';

export const dashboardSel = {

  easyShopLink: (page: Page) =>
    page.getByTestId('easy-shop-link'),

}