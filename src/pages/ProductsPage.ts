import { Page, Locator, expect } from "@playwright/test";
import { productsSel } from "../utils/selectors/products.selectors";
import { breadcrumbSel } from "../utils/selectors/components/breadcrumb.selectors";
import { routes } from "../utils/routes";

export class ProductsPage {
  readonly page: Page;

  // readonly cartLink: Locator;
  readonly filterInput: Locator;
  readonly filterCategory: Locator;
  readonly filterSort: Locator;
  readonly filterApplyBtn: Locator;
  readonly filterResetLnk: Locator;
  readonly breadcrumbsCart: Locator;
  readonly addJumpRope: Locator;
  readonly productImageBySku: (sku: string) => Locator;

  // Product Specific for beginners
  readonly jumpRopeCard: Locator;

  constructor(page: Page) {
    this.page = page;

    // this.cartLink = productsSel.cartLink(page);
    this.filterInput = productsSel.filterInput(page);
    this.filterCategory = productsSel.filterCategory(page);
    this.filterSort = productsSel.filterSort(page);
    this.filterApplyBtn = productsSel.filterApplyBtn(page);
    this.filterResetLnk = productsSel.filterResetLnk(page);
    this.breadcrumbsCart = breadcrumbSel.breadcrumbsCart(page);
    this.addJumpRope = productsSel.addJumpRope(page);
    this.productImageBySku = (sku: string) => productsSel.productImageBySku(this.page, sku);

    // Product Specific for beginners
    this.jumpRopeCard = productsSel.jumpRopeCard(page);
  }

  async goto() {
    await this.page.goto(routes.products, { waitUntil: "domcontentloaded" });
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
