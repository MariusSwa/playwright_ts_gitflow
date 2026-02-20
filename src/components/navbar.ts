// This file defines a page object model for the navigation bar (navbar) component of the application. 
// The `Navbar` class encapsulates the locators for navbar elements, 
// such as the dashboard link and the logout link. By using this 
// page object model in our tests, we can easily access and verify the 
// presence and functionality of navbar components in the user interface.

import { Page, Locator, expect } from '@playwright/test';
import { navbarSel } from '../utils/selectors/components/navbar.selectors';

export class Navbar {
  readonly page: Page;
  readonly dashboardLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dashboardLink = navbarSel.dashboardLink(page);
    this.logoutLink = navbarSel.logoutLink(page);
  }

  // This method performs the logout action by clicking the logout link and verifying 
  // that the user is redirected to the home page with the expected title. It first 
  // checks if the logout link is visible, then clicks it, and finally asserts that 
  // the page title matches the expected title for the home page.
  async logout() {
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
    await expect(this.page).toHaveTitle('Automation Testing Playground | Practice Real-World Test Automation');
  };
}