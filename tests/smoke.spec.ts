import { test, expect } from "../src/fixtures/test";
import {routes} from "../src/utils/routes";

// A simple smoke test to verify the site loads. This is a sanity check and can be expanded with more assertions as needed.
test("smoke: site loads", async ({ page }) => {
  // Navigate to the home page of the application. Adjust the URL if your app uses a different base path.
  await page.goto("/", { waitUntil: "domcontentloaded" });
  // Don’t make this too strict; it’s a starter.
  await expect(page).toHaveURL(routes.home);
  // TODO: Update cmment to include new age locators and assertions.
  // Optionally, check for a common element that should be present on the home page to confirm it loaded correctly.
  // For example, if your home page has a header with the text "Welcome", you could check for that:
  // await expect(page.locator('h1')).toHaveText('Welcome');
  // Or check for a specific element that indicates the page has loaded, like a main content area:
  // await expect(page.locator('#main-content')).toBeVisible();
  // The above assertions are just examples. Adjust them based on the actual content of your home page.
  // The key here is to keep it simple and not too brittle, as the main goal is just to confirm that the site loads without errors.
  // await expect(page).toHaveURL(/playground\.testduo\.co\.za/);
  // If your app redirects to a specific URL after loading, you can check for that as well. Adjust the regex as needed.
  // await expect(page).toHaveURL(/playground\.testduo\.co\.za/);

});
