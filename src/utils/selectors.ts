/**
 * Central place for selectors.
 * Prefer data-testid first, then fall back to accessible roles/labels.
 */
export const sel = {
  // Navbar / global
  brand: '[data-testid="brand"], a[aria-label*="Home" i], a:has-text("Playground")',

  //Breadcrumbs
  breadcrumbs: '[data-testid="shopping-breadcrumb"]',
  breadcrumbsCart: '[data-testid="breadcrumb-cart"]',

  // Login page
  loginEmail: '[data-testid="login-email"], input[name="email"], input#email',
  loginPassword: '[data-testid="login-password"], input[name="password"], input#password',
  loginSubmit: '[data-testid="login-button"], button[type="submit"]:has-text("Log in")',
  authError: '[data-testid="login-error"], #authError',

  //Dashboard
  shopLink: '[data-testid="nav-shop"], a:has-text("Shop"), a[href*="shopping.php"]',

  // Shop Main Page
  browseProductsLink: '[data-testid="shopping-go-products"], a:has-text("Browse products"), a[href*="products.php"]',

  // Shop/Products
  filterInput: '[data-testid="filter-q"], input[placeholder*="Search name or SKU"], input#q, [name="q"]',
  filterCategory: '[data-testid="filter-category"], select[name="category"], select#category',
  filterSort: '[data-testid="filter-sort"], select[name="sort"], select#sort',
  filterApplyBtn: '[data-testid="filter-apply"], button:has-text("Apply")',
  filterResetLnk: '[data-testid="filter-reset"], a[href*="/shopping/products.php"]',

  // Product Specific locators
  // For beginners, we can start with just the jump rope product
  jumpRopeCard: '[data-testid="product-card-Jump Rope"]',
  addJumpRope: '[data-testid="product-add-SKU-ROPE-019"]',


  // Cart
  // Expand this to look for any SKU in the cart, not just jump rope
  cartLink: '[data-testid="nav-cart"], a:has-text("Cart"), a[href*="cart"]',
  cartItem: '[data-testid="cart-item"], .cart-item, tr:has-text("SKU")',
  cartCount: '[data-testid="cart-count"], [data-testid="cart-badge"], .badge:has-text(/\\d+/)',
  cartJumpRopeItem: '[data-sku="SKU-ROPE-019"]',

  // Advanced: Add more specific product locators, e.g. by SKU or name
  cartItemBySKU: (sku: string) =>
    `[data-sku="${sku}"]`,

};
