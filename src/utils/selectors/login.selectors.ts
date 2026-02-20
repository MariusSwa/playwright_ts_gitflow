// This file defines selectors for the login page of the application. 
// These selectors are used to locate and interact with elements on 
// the login page during testing. The selectors are organized under 
// the `loginSel` object, which contains methods that return locators 
// for specific elements such as the email and password input fields, 
// the submit button, and any authentication error messages. By using 
// these selectors in test cases, we can easily access and verify the 
// presence and functionality of the login page elements in the user interface.

import { Page } from '@playwright/test';
// =========================
// Login Page
// =========================

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
