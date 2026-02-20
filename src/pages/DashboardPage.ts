// This file defines the DashboardPage class, which represents the dashboard page of the application. 
// It includes locators for elements on the dashboard page and methods to interact with those elements 
// and make assertions about the dashboard's state. The confirmDashboard method checks that the URL is 
// correct and that a specific element (easyShopLink) is visible, confirming that the dashboard has 
// loaded successfully. This class can be expanded in the future to include more methods for interacting 
// with different elements on the dashboard or verifying other aspects of the page.

import { Page, Locator, expect } from "@playwright/test";
import { dashboardSel } from "../utils/selectors/dashboard.selectors";
import { routes } from "../utils/routes";

// The export allows this class to be imported and used in test files, such as auth.setup.ts, where we 
// can create an instance of DashboardPage and call its methods to confirm that the dashboard page has 
// loaded correctly after login.
export class DashboardPage {
  readonly page: Page;
  readonly easyShopLink: Locator;

  // The constructor initializes the page and locators for the dashboard elements. In this case, we have 
  // a locator for the easyShopLink, which is used in the confirmDashboard method to verify that the dashboard 
  // has loaded successfully.
  constructor(page: Page) {
    this.page = page;

    this.easyShopLink = dashboardSel.easyShopLink(page);
  }

  // This method checks that the current URL is the dashboard URL and that the easyShopLink element is visible. 
  // This confirms that the dashboard page has loaded successfully. This method can be called in test cases 
  // after performing a login action to ensure that the user is taken to the correct page and that the 
  // expected elements are present.
  async confirmDashboard() {
    await expect(this.page).toHaveURL(routes.dashboard);
    await expect(this.easyShopLink).toBeVisible();
  }

  //TODO: Expand this to look for any SKU in the cart, not just jump rope
 
}