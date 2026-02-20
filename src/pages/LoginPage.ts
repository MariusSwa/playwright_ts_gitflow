// This file defines the LoginPage class, which represents the login page of the application. 
// It includes locators for the email and password input fields, the submit button, and any 
// authentication error messages. The class also contains methods to navigate to the login page 
// and perform a login action by filling in the email and password fields and clicking the 
// submit button. This structure allows for easy reuse of the login functionality across 
// different test cases that require user authentication.

import { Page, Locator, expect } from "@playwright/test";
import { loginSel } from "../utils/selectors/login.selectors";
import { routes } from "../utils/routes";

// The export allows this class to be imported and used in test files, such as auth.setup.ts, 
// where we can create an instance of LoginPage and call its methods to perform login actions 
// in our tests.
export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly authError: Locator;

  // The constructor initializes the page and locators for the login elements. This includes 
  // the email and password input fields, the submit button, and any authentication error messages. 
  // These locators are used in the login method to interact with the page elements.
  constructor(page: Page) {
    this.page = page;

    this.email = loginSel.loginEmail(page);
    this.password = loginSel.loginPassword(page);
    this.submit = loginSel.loginSubmit(page);
    this.authError = loginSel.authError(page);
  }

  // The goto method navigates to the login page using the URL defined in the routes. This can be called
  // in test cases to ensure that the test starts on the correct page before performing any login actions.
  async goto() {
    await this.page.goto(routes.login, { waitUntil: "domcontentloaded" });
  }

  // The login method fills in the email and password fields and clicks the submit button. This method can be
  // called in test cases to perform a login action with the specified credentials. It also includes assertions 
  // to ensure that the email and password fields are visible before interacting with them, which helps to 
  // prevent errors in case the page has not loaded correctly.
  async login(email: string, password: string) {
    // Confirm the email field is visible and fill it in
    await expect(this.email).toBeVisible();
    await this.email.fill(email);
    // Confirm the password field is visible and fill it in
    await expect(this.password).toBeVisible();
    await this.password.fill(password);
    // Click the Submit button
    await this.submit.click();
  }
}
