// This file defines custom fixtures for Playwright tests. 
// Fixtures are a way to set up and tear down test environments, 
// and to provide reusable components for tests. In this file, 
// we define fixtures for page objects such as LoginPage, ShopPage, 
// CartPage, and DashboardPage. These fixtures will be used in our 
// test cases to interact with the application under test.

import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ShopPage } from "../pages/ShopPage";
import { CartPage } from "../pages/CartPage";
import { DashboardPage } from "../pages/DashboardPage";

type Fixtures = {
  loginPage: LoginPage;
  shopPage: ShopPage;
  cartPage: CartPage;
  dashboardPage: DashboardPage;
};

// This section extends the base test with our custom fixtures. Each 
// fixture is defined as an asynchronous function that takes the Playwright 
// `page` object and a `use` function. The fixture creates an instance of 
// the corresponding page object (e.g., LoginPage) and passes it to the 
// `use` function, which makes it available in the test cases. This allows 
// us to easily access and interact with different pages of the application 
// in our tests by simply using the fixture names (e.g., `loginPage`, `shopPage`, etc.).
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect };
