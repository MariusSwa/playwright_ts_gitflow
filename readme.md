![CI](https://github.com/MariusSwa/playwright_ts_gitflow/actions/workflows/tests.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-Framework-45ba63)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![GitFlow](https://img.shields.io/badge/GitFlow-Enabled-orange)

# Playwright + TypeScript GitFlow Starter

A Playwright + TypeScript starter framework structured for real-world teams using GitFlow.

Maintained by **Test Duo**  
➡ https://testduo.co.za  
➡ https://playground.testduo.co.za  

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

Check versions:

```bash
node -v
npm -v
```

Install dependencies:

```bash
npm install
npm install -D @playwright/test
```

Install Playwright browsers:

Windows / macOS:

```bash
npx playwright install
```

Linux (recommended):

```bash
npx playwright install --with-deps
```

---

## Configure Environment

Copy the example file:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
BASE_URL=https://playground.testduo.co.za
E2E_EMAIL=REDACTED
E2E_PASSWORD=REDACTED
```

If login requires an account, register one manually first.

---


# How to Create Your Own Tests  
*(Beginner → Structured Framework Flow)*

This project follows a simple development loop when adding new functionality.

## Step 1 – Add Selectors

Add your new selectors in:

```
src/utils/selectors.ts
```

Prefer `data-testid` selectors where possible.

Example:

```ts
export const sel = {
  checkoutButton: '[data-testid="checkout-button"]'
};
```

---

## Step 2 – Add Page Actions

Create (or update) the relevant page object in:

```
src/pages/<Something>Page.ts
```

Add reusable methods there (your “functions”), and use selectors from `selectors.ts`.

Example:

```ts
async clickCheckout() {
  await this.page.locator(sel.checkoutButton).click();
}
```

Keep tests clean — page objects should handle interaction logic.

---

## Step 3 – Register the Page in Fixtures

If you created a new page object, register it in:

```
src/fixtures/test.ts
```

This allows tests to use dependency injection:

```ts
test("example", async ({ newPage }) => {
  await newPage.doSomething();
});
```

This keeps tests clean and avoids manually instantiating page classes.

---

## Step 4 – Write a Test

Add or extend a spec file in:

```
tests/*.spec.ts
```

Use the fixture-injected page objects and **do not place selectors directly inside tests**.

Example:

```ts
test("checkout flow", async ({ shopPage }) => {
  await shopPage.goto();
  await shopPage.clickCheckout();
});
```

---

## Step 5 – Run Only That Test While Developing

```bash
npx playwright test tests/<file>.spec.ts --headed
```

This speeds up development and debugging.

---

### Development Loop Summary

1. Add selector  
2. Add page method  
3. Register page (if new)  
4. Write test  
5. Run focused test  

Repeat.


# Running Tests

Run all tests:

```bash
npm test
```

Run in headed mode:

```bash
npm run test:headed
```

Run in UI mode:

```bash
npm run test:ui
```

Run visual tests

```bash
npx playwright test --project=chromium-visual
```

Debug mode:

```bash
npm run test:debug
```

View HTML report:

```bash
npm run report
```

---

# Run a Single Test File

```bash
npx playwright test tests/login.spec.ts --headed
```

Run by test name:

```bash
npx playwright test -g "cart:" --headed
```

Run with trace enabled:

```bash
npx playwright test --trace on --headed
```

Open trace:

```bash
npx playwright show-trace test-results/**/trace.zip
```

---

# Debug Interactively

Add this temporarily:

```ts
await this.page.pause();
```

Then run:

```bash
npm run test:headed
```

---

# Skipping and Known Failures

Skip a test:

```ts
test.skip("login: valid credentials", async ({ loginPage }) => {
  // ...
});
```

Conditional skip:

```ts
test("login: valid credentials", async ({ loginPage }) => {
  test.skip(!process.env.E2E_EMAIL, "No credentials provided");
});
```

Skip entire file:

```ts
test.skip(true, "Feature under maintenance");
```

Known failure:

```ts
test.fail("cart: discount code", async ({ page }) => {
  // ...
});
```

Work in progress:

```ts
test.fixme("checkout flow incomplete", async ({ page }) => {
  // ...
});
```

Skip in CI only:

```ts
test("slow test", async ({ page }) => {
  test.skip(process.env.CI, "Skipping in CI");
});
```

Reference issue number:

```ts
test.fail(true, "Known issue: #42 - cart badge not updating");
```

---

# Big Picture Architecture

- Tests describe what you want to verify.
- Pages describe how to interact with a specific page.
- Selectors store the “where” (locators).
- Fixtures wire everything together so tests stay clean.

---

# Project Structure

## tests/

- smoke.spec.ts → basic site load test
- login.spec.ts → login flow tests
- cart.spec.ts → add product to cart

## tests/visual
- all visual tests are in this folder alongs with their default screenshots
- products.visual.spec.ts → include visual in the test file name

## src/pages/

LoginPage.ts  
ShopPage.ts  
CartPage.ts  

## src/utils/

selectors.ts → central selectors  
env.ts → environment loader  

## src/fixtures/

test.ts → injects page objects  

## playwright.config.ts

Controls:
- Global timeout (25s)
- Base URL
- Retries/workers
- Trace/video/screenshot
- Reporter

---

# Example Flow

cart.spec.ts does:

1. shopPage.goto()
2. shopPage.addFirstProductToCart()
3. shopPage.openCart()
4. cartPage.expectHasItems()

---

# Target Application

➡ https://playground.testduo.co.za  
➡ Built and maintained by https://testduo.co.za

---

## Codebase Tour (Newcomer Quick Map)

### Folder structure at a glance

- `tests/` → executable Playwright specs (`*.spec.ts`) plus setup (`auth.setup.ts`)
- `src/pages/` → page objects (Login, Products, Cart, Dashboard)
- `src/utils/selectors/` → locator factories grouped by page/component
- `src/fixtures/test.ts` → custom fixture injection for page objects
- `src/utils/env.ts` + `src/data/users.ts` → test configuration + credential sourcing
- `playwright.config.ts` → global runtime behavior + projects (setup/auth/public/visual)

### Mental model

1. **Selectors** are centralized in `src/utils/selectors/**`.
2. **Page objects** wrap UI actions/assertions.
3. **Fixtures** inject page objects into tests.
4. **Specs** orchestrate end-to-end flows.
5. **Projects** in Playwright config decide test scope (auth/public/visual).

### Extension workflow

When adding a new flow, follow this order:

1. Add selectors.
2. Add/update page object methods.
3. Register fixture (if introducing a new page object).
4. Write focused spec(s).
5. Run targeted project/spec first, then full suite.

### What to learn next

- Dynamic selector patterns (`BySKU`, `ByName`) for maintainable tests.
- Playwright `storageState` reuse for fast authenticated suites.
- Visual regression assertions and baseline lifecycle.
- CI strategy (parallelization, retries, artifact triage).
