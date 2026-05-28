"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentService } from "@/service/payment.service";
import { paymentKeys } from "@/constant/key/payment";
import type { PendingPaymentsResponse, ReconcileCsvResponse } from "@/type/payment";

export function useCreatePaymentLink() {
  return useMutation({
    mutationFn: (payload: { orderId: string }) => paymentService.createPaymentLink(payload),
  });
}

export function useConfirmManualPayment() {
  return useMutation({
    mutationFn: (orderId: string) => paymentService.confirmManual(orderId),
  });
}

export function usePendingPayments(page?: number, limit?: number) {
  return useQuery<PendingPaymentsResponse>({
    queryKey: paymentKeys.pending(page, limit),
    queryFn: () => paymentService.listPending(page, limit),
    
    staleTime: 10_000,
  });
}

export function useReconcileCsv() {
  return useMutation<ReconcileCsvResponse, Error, File>({
    mutationFn: (file: File) => paymentService.reconcileCsv(file),
  });
}
