// =========================
// Login Page
// =========================

import { Page } from '@playwright/test';

export const loginSel = {
  loginEmail: (page: Page) =>
    page.getByLabel('Email'),

  loginPassword: (page: Page) =>
    page.getByLabel('Password'),

  loginSubmit: (page: Page) =>
    page.getByRole('button', { name: 'Log in' }),

  authError: (page: Page) =>
  page.getByTestId('login-error').or(page.locator('#authError')),

};
