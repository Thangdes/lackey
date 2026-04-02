export type DiscountValidation = {
  code: string;
  type: "FIXED_AMOUNT" | "PERCENTAGE" | string;
  value: number | string;
  discountAmount: number;
};

export type Discount = {
  id: string;
  code: string;
  description?: string | null;
  type: "FIXED_AMOUNT" | "PERCENTAGE" | string;
  value: number | string;
  isActive: boolean;
  startDate: string;
  endDate?: string | null;
  minAmount?: number | string | null;
  usageLimit?: number | string | null;
  usedCount?: number | null;
  perUserLimit?: number | string | null;
  maxDiscountAmount?: number | string | null;
  stackable?: boolean;
};
