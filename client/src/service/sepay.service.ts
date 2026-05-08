import { http } from "@/utils/http";
import { API } from "@/constant/api";

export type SepayOrderStatusResp = {
  found: boolean;
  orderId?: string;
  orderCode?: string;
  orderStatus?: string | null;
  paymentStatus?: string | null;
  paidAt?: string | null;
  amount?: number | string | null;
  message?: string;
};

export const sepayService = {
  getStatusByOrderCode: (orderCode: string) =>
    http.get<SepayOrderStatusResp>(API.sepay.status(orderCode)),
  createCheckout: (payload: { orderId: string; returnUrl: string }) =>
    http.post<{
      checkoutUrl: string;
      fields: Record<string, string>;
      orderId: string;
      orderCode: string;
      amount: number;
      invoiceNumber: string;
    }>(API.sepay.createCheckout, payload),
};
