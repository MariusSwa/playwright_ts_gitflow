![CI](https://github.com/YOURUSER/playwright_ts_gitflow/actions/workflows/tests.yml/badge.svg)
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
