// This file defines centralized route definitions for the application. 
// By centralizing the route definitions in this file, we can easily 
// manage and update the URLs used throughout the application. If any URLs 
// change (e.g., removing .php, adding /public/, versioning), 
// we can update them here once instead of across multiple page files. 
// This approach promotes maintainability and reduces the risk of 
// inconsistencies in route definitions across the codebase.

export const routes = {
  home: "/",
  login: "/login.php",
  shopping: "/shopping/products.php",
  cart: "/shopping/cart.php",
  dashboard: "/dashboard.php",
};
