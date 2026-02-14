/**
 * Central place for selectors.
 * Prefer data-testid first, then fall back to accessible roles/labels.
 */
export const sel = {
  // Navbar / global
  brand: '[data-testid="brand"], a[aria-label*="Home" i], a:has-text("Playground")',

  // Login page
  loginEmail: '[data-testid="login-email"], input[name="email"], input#email',
  loginPassword: '[data-testid="login-password"], input[name="password"], input#password',
  loginSubmit: '[data-testid="login-submit"], button[type="submit"]:has-text("Login"), button[type="submit"]',

  // Shop/catalog
  productCard: '[data-testid="product-card"], .card:has(button)',
  addToCartBtn: '[data-testid="add-to-cart"], button:has-text("Add to cart"), button:has-text("Add to Cart")',

  // Cart
  cartLink: '[data-testid="nav-cart"], a:has-text("Cart"), a[href*="cart" i]',
  cartItem: '[data-testid="cart-item"], .cart-item, tr:has-text("SKU")',
  cartCount: '[data-testid="cart-count"], [data-testid="cart-badge"], .badge:has-text(/\\d+/)'
};
