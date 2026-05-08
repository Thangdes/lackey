"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { sepayService } from "@/service/sepay.service";

export function useSepayStatus(orderCode?: string, enabled = true) {
  const code = String(orderCode || "").trim();
  return useQuery({
    queryKey: ["sepay", "status", code || null],
    queryFn: () => sepayService.getStatusByOrderCode(code),
    enabled: Boolean(enabled && code),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}

export function useCreateSepayCheckout() {
  return useMutation({
    mutationFn: (payload: { orderId: string; returnUrl: string }) =>
      sepayService.createCheckout(payload),
  });
}
