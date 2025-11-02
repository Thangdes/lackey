export type DashboardStats = {
  revenue: number;
  totalOrders: number;
  newCustomersCount: number;
  averageOrderValue: number;
};

export type RevenuePoint = { date: string; revenue: number };

export type TopProduct = {
  productName: string;
  thumbnailUrl: string;
  totalQuantity: number;
};

export type DashboardQuery = { startDate?: string; endDate?: string; groupBy?: 'day' | 'week' | 'month' };
