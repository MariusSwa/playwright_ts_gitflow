import { test, expect } from "../src/fixtures/test";
import { users } from "../src/data/users";

test.fail("login: invalid credentials shows an error", async ({ loginPage, page }) => {
  await loginPage.goto();

  // Intentionally invalid - this should work on most apps.
  await loginPage.login("invalid@example.com", "wrong-password");

  // Fallback checks: adjust selectors/text to your UI.
  // We’re keeping it general so forks can adapt fast.
  const possibleError = page.locator(
    '[data-testid="login-error"], .alert-danger, .alert:has-text("invalid"), text=/invalid|incorrect|failed/i'
  ).first();

  await expect(possibleError).toBeVisible();
});

test("login: valid credentials (only runs if env vars are provided)", async ({ loginPage, page }) => {
  const u = users.primary();
  test.skip(!u.email || !u.password, "Set E2E_EMAIL and E2E_PASSWORD in .env to run this test.");

  await loginPage.goto();
  await loginPage.login(u.email, u.password);

  // After login, many sites redirect to dashboard/account.
  // Keep this flexible.
  await expect(page).not.toHaveURL(/\/login.php/i);
});
