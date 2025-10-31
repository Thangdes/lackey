export const API = {
  siteContent: {
    banners: "/site-content/banners",
    testimonials: "/site-content/testimonials",
    adminAll: (type?: string) => (type ? `/site-content/admin/all?type=${encodeURIComponent(type)}` : "/site-content/admin/all"),
    adminById: (id: string) => `/site-content/admin/${id}`,
    create: "/site-content",
    thumbnail: (id: string) => `/site-content/admin/${id}/thumbnail`,
    reorder: "/site-content/admin/reorder",
  },
  admin: {
    suppliers: {
      root: "/admin/suppliers",
      byId: (id: string) => `/admin/suppliers/${id}`,
      activate: (id: string) => `/admin/suppliers/${id}/activate`,
      activateAlt: (id: string) => `/admin/suppliers/activate/${id}`,
      users: "/admin/suppliers/users",
      deactivateUser: (id: string) => `/admin/suppliers/deactivate/${id}`,
      reactivateUser: (id: string) => `/admin/suppliers/reactivate/${id}`,
      resetUserPassword: (id: string) => `/admin/suppliers/users/${id}/password`,
      deleteUser: (id: string) => `/admin/suppliers/users/${id}`,
    },
  },
  dashboard: {
    stats: "/dashboard/stats",
    revenueOverTime: "/dashboard/revenue-over-time",
    topProducts: "/dashboard/top-products",
  },
  supplierDashboard: {
    profile: "/supplier-dashboard/profile",
    summary: "/supplier-dashboard/summary",
    ordersCount: (days?: number) => `/supplier-dashboard/orders-count${days ? `?days=${encodeURIComponent(String(days))}` : ""}`,
    topSellingProducts: "/supplier-dashboard/top-selling-products",
    recentOrders: "/supplier-dashboard/recent-orders",
    inventoryReport: "/supplier-dashboard/inventory-report",
    revenueOverTime: (days?: number) => `/supplier-dashboard/revenue-over-time${days ? `?days=${encodeURIComponent(String(days))}` : ""}`,
    restockCandidates: (limit?: number, lowThreshold?: number) => {
      const q = new URLSearchParams();
      if (typeof limit !== "undefined") q.set("limit", String(limit));
      if (typeof lowThreshold !== "undefined") q.set("lowThreshold", String(lowThreshold));
      const qs = q.toString();
      return qs ? `/supplier-dashboard/restock-candidates?${qs}` : `/supplier-dashboard/restock-candidates`;
    },
    orders: (page?: number, limit?: number, status?: string, from?: string, to?: string) => {
      const q = new URLSearchParams();
      if (typeof page !== "undefined") q.set("page", String(page));
      if (typeof limit !== "undefined") q.set("limit", String(limit));
      if (status) q.set("status", status);
      if (from) q.set("from", from);
      if (to) q.set("to", to);
      const qs = q.toString();
      return qs ? `/supplier-dashboard/orders?${qs}` : `/supplier-dashboard/orders`;
    },
    orderById: (orderId: string) => `/supplier-dashboard/orders/${orderId}`,
  },
  auth: {
    profile: "/auth/profile",
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  product: {
    root: "/products",
    suppliers: "/products/suppliers",
    search: "/products/search",
    byId: (id: string) => `/products/${id}`,
    bySlug: (slug: string) => `/products/slug/${slug}`,
    thumbnail: (id: string) => `/products/${id}/thumbnail`,
    images: (id: string) => `/products/${id}/images`,
    deleteImage: (id: string) => `/products/${id}/images/delete`,
    variants: (productId: string) => `/products/${productId}/variants`,
    variantById: (productId: string, variantId: string) => `/products/${productId}/variants/${variantId}`,
  },
  category: {
    root: "/categories",
    byId: (id: string) => `/categories/${id}`,
    products: (id: string) => `/categories/${id}/products`,
    thumbnail: (id: string) => `/categories/${id}/thumbnail`,
    header: "/categories/header",
  },
  cart: {
    root: "/cart",
    items: "/cart/items",
    itemById: (itemId: string) => `/cart/items/${itemId}`,
    clear: "/cart/clear",
    bulkSet: "/cart/items/bulk-set",
    applyDiscount: "/cart/apply-discount",
    removeDiscount: "/cart/remove-discount",
  },
  order: {
    root: "/orders",
    byId: (id: string) => `/orders/${id}`,
    checkout: "/orders/checkout",
    myHistory: "/orders/my-history",
    lookup: (code: string) => `/orders/lookup?code=${encodeURIComponent(code)}`,
    lookupByPhone: (phone: string) => `/orders/lookup?phone=${encodeURIComponent(phone)}`,
    lookupByEmail: (email: string) => `/orders/lookup?email=${encodeURIComponent(email)}`,
    lookupGeneric: (params: { code?: string; email?: string; phone?: string }) => {
      const q = new URLSearchParams();
      if (params.code) q.set("code", params.code);
      if (params.email) q.set("email", params.email);
      if (params.phone) q.set("phone", params.phone);
      const qs = q.toString();
      return qs ? `/orders/lookup?${qs}` : `/orders/lookup`;
    },
    status: (id: string) => `/orders/${id}/status`,
    deliveryCode: (id: string) => `/orders/${id}/delivery-code`,
    cancel: (id: string) => `/orders/${id}/cancel`,
  },
  payment: {
    root: "/payments",
    createLink: "/payments/create-link",
    confirmManual: (orderId: string) => `/payments/${orderId}/confirm-manual`,
    pending: (page?: number, limit?: number) => {
      const q = new URLSearchParams();
      if (typeof page !== 'undefined') q.set('page', String(page));
      if (typeof limit !== 'undefined') q.set('limit', String(limit));
      const qs = q.toString();
      return qs ? `/payments/pending?${qs}` : `/payments/pending`;
    },
    reconcileCsv: `/payments/reconcile-csv`,
  },
  shipping: {
    calculateFee: "/shipping/calculate-fee",
    districtsInfo: "/shipping/districts-info",
    provinces: "/shipping/provinces",
    districts: "/shipping/districts",
    wards: "/shipping/wards",
  },
  user: {
    me: "/auth/profile",
    byId: (id: string) => `/users/${id}`,
    list: (page: number, pageSize: number) => `/users?page=${page}&pageSize=${pageSize}`,
  },
  ratings: {
    root: "/ratings",
    byProduct: (productId: string) => `/ratings/product/${productId}`,
    adminList: (page: number, limit: number, search?: string) => {
      const q = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) q.set("search", search);
      return `/ratings/admin?${q.toString()}`;
    },
    byId: (id: string) => `/ratings/${id}`,
  },
  discounts: {
    root: "/discounts",
    validate: (code: string, subtotal: number) => `/discounts/validate/${encodeURIComponent(code)}?subtotal=${encodeURIComponent(String(subtotal))}`,
    activeList: "/discounts/active-list",
    promoStrip: "/discounts/promo-strip",
  },
  blog: {
    root: "/posts",
    byId: (id: string) => `/posts/${id}`,
    bySlug: (slug: string) => `/posts/${slug}`,
    admin: "/posts/admin",
    adminById: (id: string) => `/posts/admin/${id}`,
    thumbnail: (id: string) => `/posts/${id}/thumbnail`,
  },
  customers: {
    root: "/customers",
    me: "/customers/me",
    byId: (id: string) => `/customers/${id}`,
    list: (page: number, limit: number, search?: string) => {
      const q = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) q.set("search", search);
      return `/customers?${q.toString()}`;
    },
    addresses: (customerId: string) => `/customers/${customerId}/addresses`,
    addressById: (customerId: string, addressId: string) => `/customers/${customerId}/addresses/${addressId}`,
  },
} as const;
