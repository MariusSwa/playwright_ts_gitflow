import { Page, Locator, expect } from "@playwright/test";
import { sel } from "../utils/selectors";
import { routes } from "../utils/routes";

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly authError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.locator(sel.loginEmail);
    this.password = page.locator(sel.loginPassword);
    this.submit = page.locator(sel.loginSubmit);
    this.authError = page.locator(sel.authError);
  }

  async goto() {
    // Common routes: /login, /auth/login, /account/login.
    // We try /login first; if your site differs, update here.
    await this.page.goto(routes.login, { waitUntil: "domcontentloaded" });
  }

  async login(email: string, password: string) {
    await expect(this.email).toBeVisible();
    await this.email.fill(email);

    await expect(this.password).toBeVisible();
    await this.password.fill(password);

    await this.submit.click();
  }
}
