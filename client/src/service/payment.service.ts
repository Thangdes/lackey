import { http } from "@/utils/http";
import { API } from "@/constant/api";
import type { PaymentLinkResponse, PendingPaymentsResponse, ReconcileCsvResponse } from "@/type/payment";

export const paymentService = {
  
  createPaymentLink: (payload: { orderId: string }) =>
    http.post<PaymentLinkResponse>(API.payment.createLink, payload),
  
  confirmManual: (orderId: string) => http.post<unknown>(API.payment.confirmManual(orderId)),
  
  listPending: (page?: number, limit?: number) => http.get<PendingPaymentsResponse>(API.payment.pending(page, limit)),
  
  reconcileCsv: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return http.post<ReconcileCsvResponse>(API.payment.reconcileCsv, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
