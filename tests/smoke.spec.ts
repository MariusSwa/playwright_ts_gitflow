import { test, expect } from "../src/fixtures/test";
import {routes} from "../src/utils/routes";


test("smoke: site loads", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // Don’t make this too strict; it’s a starter.
  await expect(page).toHaveURL(routes.home);
  // await expect(page).toHaveURL(/playground\.testduo\.co\.za/);

});
