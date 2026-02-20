import { users } from '../src/data/users';
import { routes } from '../src/utils/routes';
import { test as setup } from "../src/fixtures/test";

const authFile = 'playwright/.auth/user.json';

// Authenticate before all tests and save the storage state to a file
setup('authenticate', async ({ loginPage, page, dashboardPage }) => {
  // Fetch the user credentials from the users data
  const u = users.primary();
  // Go to the login page
  await page.goto(routes.login);
  // Perform the login action using the login page object
  await loginPage.login(u.email, u.password);
  // Confirm that the dashboard page is loaded after login
  await dashboardPage.confirmDashboard();
  // Save the authenticated state to a file for reuse in other tests
  await page.context().storageState({ path: authFile });
});
