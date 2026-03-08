// tests/visual/products.visual.spec.ts
import { test } from "../../src/fixtures/test";
import { expect } from "@playwright/test";

test.describe('Visual: products pages', () => {
  test('product image', async ({ productsPage }) => {
    await productsPage.goto();

    await productsPage.filterInput.fill("Monitor");

    await productsPage.filterApplyBtn.click();

    await expect(productsPage.productImageBySku("SKU-MON-003")).toBeVisible();

    await expect(productsPage.productImageBySku("SKU-MON-003"))
      .toHaveScreenshot("monitor-27-inch.png");
  });

 
});