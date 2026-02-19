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

  async logout() {
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
    await expect(this.page).toHaveTitle('Automation Testing Playground | Practice Real-World Test Automation');
  }

}