// =========================
// Nav Bar
// =========================

import { Page } from '@playwright/test';

export const navbarSel = {

    brand: (page: Page) =>
    page.getByRole('link', { name: 'playground' }),

};