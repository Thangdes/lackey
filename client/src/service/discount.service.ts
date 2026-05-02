import { http, httpSuccess } from "@/utils/http";
import { API } from "@/constant/api";
import type { Discount, DiscountValidation } from "@/type/discount";

// Re-export for consumers
export type { Discount, DiscountValidation };

export const discountService = {
  validate: (code: string, subtotal: number) =>
    http.get<DiscountValidation>(API.discounts.validate(code, subtotal)),
  activeList: () =>
    http.get<Array<{
      id: string;
      code: string;
      description?: string | null;
      type: "FIXED_AMOUNT" | "PERCENTAGE" | string;
      value: number | string;
      minAmount?: number | string | null;
    }>>(API.discounts.activeList),
  promoStrip: () =>
    http.get<{
      active: boolean;
      code?: string;
      type?: "FIXED_AMOUNT" | "PERCENTAGE" | string;
      value?: number;
      message?: string;
      description?: string | null;
      expiresAt?: string | null;
      minAmount?: number | null;
      ctaHref?: string;
      ctaLabel?: string;
      variant?: string;
      dismissible?: boolean;
    }>(API.discounts.promoStrip),
  list: () => httpSuccess.getData<Discount[]>(API.discounts.root),
  getById: (id: string) => http.get<Discount>(`${API.discounts.root}/${id}`),
  create: (payload: Partial<Discount>) => http.post<Discount>(API.discounts.root, payload),
  update: (id: string, payload: Partial<Discount>) => http.patch<Discount>(`${API.discounts.root}/${id}`, payload),
  delete: (id: string) => http.delete<void>(`${API.discounts.root}/${id}`),
};
