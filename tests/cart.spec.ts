import { test } from "../src/fixtures/test";

// This test is a simple example of how to add a product to the cart and verify that the cart has items.
test("cart: add first product to cart and verify cart has items", async ({ shopPage, cartPage }) => {
  // Navigate to the shop page.
  await shopPage.goto();
  // Fill the filter input with the product name "Jump Rope".
  await shopPage.filterInput.fill("Jump Rope");
  // Apply the filter to show only Jump Rope products.
  await shopPage.filterApplyBtn.click();
  // Verify that the Jump Rope product card is visible after filtering.
  await shopPage.jumpRopeCard.isVisible();
  // Click Jump Rope product's add to cart button
  await shopPage.addJumpRope.click();
  // Open cart via breadcrumbs
  await shopPage.openBreadcrumbCart();
  // Verify that the cart page shows that it has items in it.
  await cartPage.expectHasItems();
});
