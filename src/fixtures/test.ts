import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ShopPage } from "../pages/ShopPage";
import { CartPage } from "../pages/CartPage";

type Fixtures = {
  loginPage: LoginPage;
  shopPage: ShopPage;
  cartPage: CartPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  }
});

export { expect };
