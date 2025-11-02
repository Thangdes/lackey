import { http } from "@/utils/http";
import { API } from "@/constant/api";

export type SupplierSummary = {
  totalRevenue: number;
  revenueThisMonth: number;
  totalProducts: number;
  pendingOrdersCount: number;
};

export type TopSellingProduct = {
  productName: string;
  variantName: string;
  totalSold: number;
  thumbnailUrl?: string | null;
};

export type SupplierRecentOrderItem = {
  quantity: number;
  priceAtPurchase: number | string;
  productVariant: {
    name: string;
    product: { name: string };
  };
};

export type SupplierRecentOrder = {
  id: string;
  orderCode: string;
  status: string;
  createdAt: string;
  supplierRevenue?: number;
  supplierItemCount?: number;
  totalAmount?: number | string;
  orderItems?: SupplierRecentOrderItem[];
};

export type SupplierOrdersQuery = {
  page?: number;
  limit?: number;
  status?: string;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
};

export type SupplierOrderListItem = {
  id: string;
  orderCode: string;
  status: string;
  createdAt: string;
  supplierRevenue: number;
  supplierItemCount: number;
};

export type Paginated<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; lastPage: number };
};

export type SupplierOrderDetail = {
  id: string;
  orderCode: string;
  status: string;
  notes?: string | null;
  createdAt: string;
  confirmedAt?: string | null;
  shippedAt?: string | null;
  completedAt?: string | null;
  canceledAt?: string | null;
  shippingAddress?: { city: string; district: string; ward: string };
  payments?: { status: string; method: string }[];
  orderItems: Array<{
    quantity: number;
    priceAtPurchase: number | string;
    productVariant: {
      name: string;
      sku: string;
      product: { name: string; thumbnailUrl?: string | null };
    };
  }>;
};

export type SupplierInventoryProduct = { id: string; name: string; variants: { id: string; name: string; sku: string; stockQuantity: number }[] };

export type SupplierRevenuePoint = { date: string; revenue: number };

export type RestockCandidate = {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  stockQuantity: number;
  totalSold30d: number;
};

export const supplierDashboardService = {
  profile: () => http.get<{ id: string; name: string; contactName?: string | null; email: string; phone?: string | null; address?: string | null; description?: string | null; isActive: boolean; createdAt: string; updatedAt: string } | null>(API.supplierDashboard.profile),
  summary: () => http.get<SupplierSummary>(API.supplierDashboard.summary),
  ordersCount: (days?: number) => http.get<{ count: number }>(API.supplierDashboard.ordersCount(days)),
  topSellingProducts: () => http.get<TopSellingProduct[]>(API.supplierDashboard.topSellingProducts),
  recentOrders: () => http.get<SupplierRecentOrder[]>(API.supplierDashboard.recentOrders),
  inventoryReport: () => http.get<SupplierInventoryProduct[]>(API.supplierDashboard.inventoryReport),
  revenueOverTime: (days?: number) => http.get<SupplierRevenuePoint[]>(API.supplierDashboard.revenueOverTime(days)),
  restockCandidates: (limit?: number, lowThreshold?: number) => http.get<RestockCandidate[]>(API.supplierDashboard.restockCandidates(limit, lowThreshold)),
  orders: (query?: SupplierOrdersQuery) => {
    const page = query?.page;
    const limit = query?.limit;
    const status = query?.status;
    const from = query?.from;
    const to = query?.to;
    return http.get<Paginated<SupplierOrderListItem>>(API.supplierDashboard.orders(page, limit, status, from, to));
  },
  orderById: (orderId: string) => http.get<SupplierOrderDetail>(API.supplierDashboard.orderById(orderId)),
};
