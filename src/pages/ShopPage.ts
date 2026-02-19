import { Page, Locator, expect } from "@playwright/test";
import { sel } from "../utils/selectors/selectors";
import { routes } from "../utils/routes";

export class ShopPage {
  readonly page: Page;
  // readonly productCard: Locator;
  // readonly addToCartBtn: Locator;
  readonly cartLink: Locator;
  readonly filterInput: Locator;
  readonly filterCategory: Locator;
  readonly filterSort: Locator;
  readonly filterApplyBtn: Locator;
  readonly filterResetLnk: Locator;
  readonly breadcrumbsCart: Locator;
  readonly addJumpRope: Locator;

  // Product Specific for beginners
  readonly jumpRopeCard: Locator;

  constructor(page: Page) {
    this.page = page;
    // this.productCard = page.locator(sel.productCard);
    // this.addToCartBtn = page.locator(sel.addToCartBtn);
    this.cartLink = page.locator(sel.cartLink); // no .first() here
    this.filterInput = page.locator(sel.filterInput);
    this.filterCategory = page.locator(sel.filterCategory);
    this.filterSort = page.locator(sel.filterSort);
    this.filterApplyBtn = page.locator(sel.filterApplyBtn);
    this.filterResetLnk = page.locator(sel.filterResetLnk);
    this.breadcrumbsCart = page.locator(sel.breadcrumbsCart);
    this.addJumpRope = page.locator(sel.addJumpRope);

    // Product Specific for beginners
    this.jumpRopeCard = page.locator(sel.jumpRopeCard);

  }

  async goto() {
    await this.page.goto(routes.shopping, { waitUntil: "domcontentloaded" });
  }

  async openBreadcrumbCart() {
    // await expect(this.breadcrumbsCart).toBeVisible();
    await this.breadcrumbsCart.click();
  }

  async waitForFiltersToLoad() {
    await expect(this.filterInput).toBeVisible();
    await expect(this.filterCategory).toBeVisible();
    await expect(this.filterSort).toBeVisible();
    await expect(this.filterApplyBtn).toBeVisible();
  }

  

}
