import { Page, Locator, expect } from "@playwright/test";
import { shopSel } from "../utils/selectors/shop.selectors";
import { breadcrumbSel } from "../utils/selectors/components/breadcrumb.selectors";
import { routes } from "../utils/routes";

export class ShopPage {
  readonly page: Page;

  // readonly cartLink: Locator;
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

    // this.cartLink = shopSel.cartLink(page);
    this.filterInput = shopSel.filterInput(page);
    this.filterCategory = shopSel.filterCategory(page);
    this.filterSort = shopSel.filterSort(page);
    this.filterApplyBtn = shopSel.filterApplyBtn(page);
    this.filterResetLnk = shopSel.filterResetLnk(page);
    this.breadcrumbsCart = breadcrumbSel.breadcrumbsCart(page);
    this.addJumpRope = shopSel.addJumpRope(page);

    // Product Specific for beginners
    this.jumpRopeCard = shopSel.jumpRopeCard(page);
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
