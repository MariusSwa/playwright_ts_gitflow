import { Page, Locator, expect } from "@playwright/test";
import { loginSel } from "../utils/selectors/login.selectors";
import { routes } from "../utils/routes";

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly authError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.email = loginSel.loginEmail(page);
    this.password = loginSel.loginPassword(page);
    this.submit = loginSel.loginSubmit(page);
    this.authError = loginSel.authError(page);
  }

  async goto() {
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
