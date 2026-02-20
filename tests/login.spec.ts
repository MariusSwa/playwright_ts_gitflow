import { test, expect } from "../src/fixtures/test";
import { users } from "../src/data/users";

// This line removes any existing authentication state before running the tests in this file. 
// This ensures that the tests start with a clean slate and are not affected by any previous login 
// sessions.
test.use({ storageState: { cookies: [], origins: [] } });

// This test is expected to fail until you implement the login functionality and error handling in your app.
test("login: invalid credentials shows an error", async ({ loginPage }) => {
  // Go to the login page
  await loginPage.goto();
  // Attempt to login with invalid credentials
  await loginPage.login("invalid@example.com", "wrong-password");
  // Expect an error message to be visible
  await expect(loginPage.authError).toBeVisible();
});

// This test requires valid credentials, so it will be skipped if env vars are not set.
test("login: valid credentials (only runs if env vars are provided)", async ({ loginPage, page }) => {
  // Fetch the user credentials from the users data
  const u = users.primary();
  // Skip the test if the user credentials are not set
  test.skip(!u.email || !u.password, "Set E2E_EMAIL and E2E_PASSWORD in .env to run this test.");

  // Go to the login page
  await loginPage.goto();

  // Perform login with valid credentials (specify in your .env file)
  await loginPage.login(u.email, u.password);

  // Keep this flexible.
  await expect(page).not.toHaveURL(/login.php/);
});
