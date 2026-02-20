// This file defines selectors for the dashboard page of the application. 
// These selectors are used to locate and interact with elements on 
// the dashboard page during testing. The selectors are organized under 
// the `dashboardSel` object, which contains methods that return locators 
// for specific dashboard elements, such as the easyShopLink. By using 
// these selectors in test cases, we can easily access and verify the 
// presence and functionality of dashboard components in the user interface.


import { Page } from '@playwright/test';
// =========================
// Dashboard
// =========================

export const dashboardSel = {

  easyShopLink: (page: Page) =>
    page.getByTestId('easy-shop-link'),

}