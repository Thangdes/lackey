import { http } from "@/utils/http";
import { API } from "@/constant/api";
import type {
  SupplierSummary,
  TopSellingProduct,
  SupplierRecentOrder,
  SupplierOrdersQuery,
  SupplierOrderListItem,
  SupplierOrderDetail,
  SupplierInventoryProduct,
  SupplierRevenuePoint,
  RestockCandidate,
  SupplierProfile,
} from "@/type/supplier-dashboard";
import type { Paginated as ServerPaginated } from "@/type/supplier-dashboard";


export type {
  SupplierSummary,
  TopSellingProduct,
  SupplierRecentOrder,
  SupplierOrdersQuery,
  SupplierOrderListItem,
  SupplierOrderDetail,
  SupplierInventoryProduct,
  SupplierRevenuePoint,
  RestockCandidate,
};

export const supplierDashboardService = {
  profile: () => http.get<SupplierProfile | null>(API.supplierDashboard.profile),
  summary: () => http.get<SupplierSummary>(API.supplierDashboard.summary),
  ordersCount: (days?: number) => http.get<{ count: number }>(API.supplierDashboard.ordersCount(days)),
  topSellingProducts: () => http.get<TopSellingProduct[]>(API.supplierDashboard.topSellingProducts),
  recentOrders: () => http.get<SupplierRecentOrder[]>(API.supplierDashboard.recentOrders),
  inventoryReport: () => http.get<SupplierInventoryProduct[]>(API.supplierDashboard.inventoryReport),
  revenueOverTime: (days?: number) => http.get<SupplierRevenuePoint[]>(API.supplierDashboard.revenueOverTime(days)),
  restockCandidates: (limit?: number, lowThreshold?: number) =>
    http.get<RestockCandidate[]>(API.supplierDashboard.restockCandidates(limit, lowThreshold)),
  orders: (query?: SupplierOrdersQuery) =>
    http.get<ServerPaginated<SupplierOrderListItem>>(
      API.supplierDashboard.orders(query?.page, query?.limit, query?.status, query?.from, query?.to)
    ),
  orderById: (orderId: string) => http.get<SupplierOrderDetail>(API.supplierDashboard.orderById(orderId)),
};
