// This file defines a page object model for the breadcrumb component of the application. 
// The `Navbar` class encapsulates the locators for breadcrumb elements, 
// such as the shopping breadcrumb and the cart breadcrumb. By using this 
// page object model in our tests, we can easily access and verify the 
// presence and functionality of breadcrumb components in the user interface.

import { Page, Locator} from '@playwright/test';
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