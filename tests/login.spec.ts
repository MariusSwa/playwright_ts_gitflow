import { test, expect } from "../src/fixtures/test";
import { users } from "../src/data/users";


// This test is expected to fail until you implement the login functionality and error handling in your app.
test("login: invalid credentials shows an error", async ({ loginPage, page }) => {
  await loginPage.goto();

  // Intentionally invalid - this should work on most apps.
  await loginPage.login("invalid@example.com", "wrong-password");

  // Confirm we show an error message. This selector is intentionally broad to work on most apps, but you may need to customize it for your app.
  
  await expect(loginPage.authError).toBeVisible();
});

// This test requires valid credentials, so it will be skipped if env vars are not set.
test("login: valid credentials (only runs if env vars are provided)", async ({ loginPage, page }) => {
  const u = users.primary();
  test.skip(!u.email || !u.password, "Set E2E_EMAIL and E2E_PASSWORD in .env to run this test.");

  // Go to the login page
  await loginPage.goto();

  // Perform login with valid credentials (specify in your .env file)
  await loginPage.login(u.email, u.password);

  // After login, many sites redirect to dashboard/account.
  // Keep this flexible.
  await expect(page).not.toHaveURL(/\/login.php/i);
});
