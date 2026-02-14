import { test, expect } from "../src/fixtures/test";
import { sel } from "../src/utils/selectors";

test("smoke: site loads", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // Don’t make this too strict; it’s a starter.
  await expect(page).toHaveURL(/playground\.testduo\.co\.za/i);
  await expect(page.locator(sel.brand).first()).toBeVisible();
});
