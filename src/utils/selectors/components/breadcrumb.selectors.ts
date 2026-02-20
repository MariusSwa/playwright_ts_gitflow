// This file defines selectors for breadcrumb components in the application. 
// These selectors are used to locate and interact with breadcrumb elements 
// on the page during testing. The selectors are organized under the 
// `breadcrumbSel` object, which contains methods that return locators 
// for specific breadcrumb elements, such as the shopping breadcrumb 
// and the cart breadcrumb. By using these selectors in test cases, 
// we can easily access and verify the presence and functionality of 
// breadcrumb components in the user interface.

import { Page } from '@playwright/test';

// =========================
// Shop Breadcrumb
// =========================
export const breadcrumbSel = {

    breadcrumbsShop: (page: Page) =>
        page.getByTestId('shopping-breadcrumb'),

    breadcrumbsCart: (page: Page) =>
        page.getByTestId('breadcrumb-cart'),
};