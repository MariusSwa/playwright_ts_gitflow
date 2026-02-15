import { Page, Locator, expect } from "@playwright/test";
import { sel } from "../utils/selectors";

export class DashboardPage {
  readonly page: Page;
  readonly easyShopLink: Locator;




  constructor(page: Page) {
    this.page = page;
    this.easyShopLink = page.locator(sel.easyShopLink);
  
  }

  async confirmDashboard() {
    await expect(this.easyShopLink).toBeVisible();
  }

  //Expand this to look for any SKU in the cart, not just jump rope
 
}