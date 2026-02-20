// This file defines selectors for the navigation bar (navbar) components of the application. 
// These selectors are used to locate and interact with navbar elements 
// on the page during testing. The selectors are organized under the 
// `navbarSel` object, which contains methods that return locators for 
// specific navbar elements, such as the brand link, dashboard link, 
// and logout link. By using these selectors in test cases, we can 
// easily access and verify the presence and functionality of navbar 
// components in the user interface.

import { Page } from '@playwright/test';
// =========================
// Nav Bar
// =========================

export const navbarSel = {

    brand: (page: Page) =>
    page.getByRole('link', { name: 'playground' }),

    dashboardLink: (page: Page) =>
    page.getByTestId('nav-dashboard'),

    logoutLink: (page: Page) =>
    page.getByTestId('nav-logout'),

};