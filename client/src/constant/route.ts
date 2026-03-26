export const ROUTES = {
    home: "/",
    admin: "/admin",
    products: "/products",
    categories: "/categories",
    cart: "/cart",
    checkout: "/checkout",
    orders: "/orders",
    ordersLookup: "/orders/lookup",
    profile: "/profile",
    wishlist: "/wishlist",
    about: "/about",
    contact: "/contact",
    terms: "/terms",
    privacy: "/privacy",
    help: "/help",
    shipping: "/shipping",
    return: "/return",
    guide: "/guide",
    blog: "/blog",
    customKeychain: "/custom-keychain",
  } as const;
  
  export type RouteKey = keyof typeof ROUTES;
  export type RouteValue = (typeof ROUTES)[RouteKey];
  
  export const buildProductDetailPath = (idOrSlug: string): string =>
    `/products/${encodeURIComponent(idOrSlug)}`;
  
  export const buildCategoryPath = (slugOrId: string): string =>
    `${ROUTES.categories}/${encodeURIComponent(slugOrId)}`;

  export const buildProductsByCategory = (categoryId: string): string =>
    `${ROUTES.products}?category=${encodeURIComponent(categoryId)}`;
  
  export const buildSearchPath = (q: string): string =>
    `${ROUTES.products}?q=${encodeURIComponent(q)}`;
  
  export const buildProductsWithParams = (params: Record<string, string | number | boolean | undefined>): string => {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) usp.set(k, String(v));
    });
    const qs = usp.toString();
    return qs ? `${ROUTES.products}?${qs}` : ROUTES.products;
  };