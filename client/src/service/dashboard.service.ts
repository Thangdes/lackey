import { http } from "@/utils/http";
import { API } from "@/constant/api";
import type { DashboardQuery, DashboardStats, RevenuePoint, TopProduct } from "@/type/dashboard";

export const dashboardService = {
  stats: (query?: DashboardQuery) => {
    const qs = new URLSearchParams();
    if (query?.startDate) qs.set("startDate", query.startDate);
    if (query?.endDate) qs.set("endDate", query.endDate);
    if (query?.groupBy) qs.set("groupBy", query.groupBy);
    const s = qs.toString();
    return http.get<DashboardStats>(`${API.dashboard.stats}${s ? `?${s}` : ""}`);
  },
  revenueOverTime: (query?: DashboardQuery) => {
    const qs = new URLSearchParams();
    if (query?.startDate) qs.set("startDate", query.startDate);
    if (query?.endDate) qs.set("endDate", query.endDate);
    if (query?.groupBy) qs.set("groupBy", query.groupBy);
    const s = qs.toString();
    return http.get<RevenuePoint[]>(`${API.dashboard.revenueOverTime}${s ? `?${s}` : ""}`);
  },
  topProducts: (query?: DashboardQuery) => {
    const qs = new URLSearchParams();
    if (query?.startDate) qs.set("startDate", query.startDate);
    if (query?.endDate) qs.set("endDate", query.endDate);
    if (query?.groupBy) qs.set("groupBy", query.groupBy);
    const s = qs.toString();
    return http.get<TopProduct[]>(`${API.dashboard.topProducts}${s ? `?${s}` : ""}`);
  },
};
