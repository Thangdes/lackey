import { http } from "@/utils/http";
import { API } from "@/constant/api";
import type { PaymentLinkResponse, PendingPaymentsResponse, ReconcileCsvResponse } from "@/type/payment";

export const paymentService = {
  // POST /payments/create-link (auth)
  createPaymentLink: (payload: { orderId: string }) =>
    http.post<PaymentLinkResponse>(API.payment.createLink, payload),
  // POST /payments/:orderId/confirm-manual (admin auth)
  confirmManual: (orderId: string) => http.post<unknown>(API.payment.confirmManual(orderId)),
  // GET /payments/pending?page=&limit= (admin auth)
  listPending: (page?: number, limit?: number) => http.get<PendingPaymentsResponse>(API.payment.pending(page, limit)),
  // POST /payments/reconcile-csv (multipart/form-data, admin auth)
  reconcileCsv: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return http.post<ReconcileCsvResponse>(API.payment.reconcileCsv, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
