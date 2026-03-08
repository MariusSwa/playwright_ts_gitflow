import { test, expect } from "../src/fixtures/test";


// This test is a simple example of how to add a product to the cart and verify that the cart has items.
test("cart: add first product to cart and verify cart has items", async ({ productsPage, cartPage }) => {
  // Navigate to the shop page.
  await productsPage.goto();
  // Fill the filter input with the product name "Jump Rope".
  await productsPage.filterInput.fill("Jump Rope");
  // Apply the filter to show only Jump Rope products.
  await productsPage.filterApplyBtn.click();
  // Verify that the Jump Rope product card is visible after filtering.
  await productsPage.jumpRopeCard.isVisible();
  // Click Jump Rope product's add to cart button
  await productsPage.addJumpRope.click();
  // Open cart via breadcrumbs
  await productsPage.openBreadcrumbCart();
  // Verify that the cart page shows that it has items in it.
  await cartPage.expectHasItems();
});
