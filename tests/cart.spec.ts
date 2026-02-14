import { test } from "../src/fixtures/test";

test("cart: add first product to cart and verify cart has items", async ({ shopPage, cartPage }) => {
  await shopPage.goto();
  await shopPage.addFirstProductToCart();
  await shopPage.openCart();

  await cartPage.expectHasItems();
});
