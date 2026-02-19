import { Page, Locator, expect } from "@playwright/test";
import { dashboardSel } from "../utils/selectors/dashboard.selectors";
import { routes } from "../utils/routes";

export class DashboardPage {
  readonly page: Page;
  readonly easyShopLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.easyShopLink = dashboardSel.easyShopLink(page);
  }

  async confirmDashboard() {
    await expect(this.page).toHaveURL(routes.dashboard);
    await expect(this.easyShopLink).toBeVisible();
  }

  //Expand this to look for any SKU in the cart, not just jump rope
 
}