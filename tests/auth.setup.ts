import { users } from '../src/data/users';
import { routes } from '../src/utils/routes';
import { test as setup, expect } from "../src/fixtures/test";

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ loginPage, page }) => {
  const u = users.primary();
  await page.goto(routes.login);

  await loginPage.login(u.email, u.password);

  await page.waitForURL(routes.dashboard);

  await page.context().storageState({ path: authFile });
});
