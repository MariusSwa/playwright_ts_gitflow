import { test } from "../src/fixtures/test";

test("cart: add first product to cart and verify cart has items", async ({ shopPage, cartPage }) => {
  await shopPage.goto();
  await shopPage.filterInput.fill("Jump Rope");
  await shopPage.filterApplyBtn.click();
  
  await shopPage.jumpRopeCard.isVisible();

  //click Jump Rope product's add to cart button
  await shopPage.addJumpRope.click();

  // Open cart via breadcrumbs
  await shopPage.openBreadcrumbCart();

  await cartPage.expectHasItems();
});
