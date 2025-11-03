/**
 * Supplier dashboard types
 */

export type LowStockRow = {
  product: string;
  name: string;
  sku: string;
  stockQuantity?: number;
};

export type RevenuePoint = {
  date: string;
  revenue: number;
};

export type RecentOrder = {
  createdAt: string;
};

export type InventoryItem = {
  name: string;
  variants: {
    name: string;
    sku: string;
    stockQuantity: number;
  }[];
};
