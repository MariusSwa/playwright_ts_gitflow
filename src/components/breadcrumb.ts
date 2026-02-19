import { Page, Locator, expect } from '@playwright/test';
import { breadcrumbSel } from '../utils/selectors/components/breadcrumb.selectors';

export class Navbar {
    readonly page: Page;

    readonly breadcrumbsShop: Locator;
    readonly breadcrumbsCart: Locator;



  constructor(page: Page) {
    this.page = page;

    this.breadcrumbsShop = breadcrumbSel.breadcrumbsShop(page);
    this.breadcrumbsCart = breadcrumbSel.breadcrumbsCart(page);
  }

}