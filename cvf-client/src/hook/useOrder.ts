"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/service/order.service";
import { orderKeys as keys } from "@/constant/key/order";
import type { Paginated } from "@/type/common";
import type { CheckoutPayload, OrderDetail, OrderSummary } from "@/type/order";
import { toast } from "sonner";

export function useOrderList(
  params?: { page?: number; limit?: number; status?: string; search?: string; code?: string; email?: string; deliveryCode?: string; customerType?: "guest" | "registered" },
  initial?: Paginated<OrderSummary>,
) {
  const { page, limit, status, search, code, email, deliveryCode, customerType } = params || {};
  return useQuery<Paginated<OrderSummary>>({
    queryKey: keys.list(page, limit, status ?? null, search ?? null, code ?? null, email ?? null, deliveryCode ?? null),
    queryFn: () => orderService.list({ page, limit, status, search, code, email, deliveryCode, customerType }),
    initialData: initial,
    placeholderData: initial ?? keepPreviousData,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useOrderById(id: string) {
  return useQuery<OrderDetail>({
    queryKey: keys.byId(id),
    queryFn: () => orderService.getById(id),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useMyOrderHistory(initial?: OrderSummary[]) {
  return useQuery<OrderSummary[]>({
    queryKey: keys.myHistory(),
    queryFn: async () => {
      const data = await orderService.myHistory();
      return Array.isArray(data) ? data : [];
    },
    initialData: initial ?? [],
    placeholderData: initial ?? [],
  });
}

export function useMyOrdersPaginated(params: { page?: number; limit?: number; status?: string; search?: string; fromDate?: string; toDate?: string }) {
  const { page, limit, status, search, fromDate, toDate } = params || {};
  return useQuery<Paginated<OrderSummary>>({
    queryKey: keys.myList(page, limit, status ?? null),
    queryFn: () => orderService.myHistoryPaginated({ page, limit, status, search, fromDate, toDate }),
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation<OrderDetail, Error, CheckoutPayload>({
    mutationFn: (payload: CheckoutPayload) => orderService.checkout(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.list(undefined, undefined, null, null) });
      qc.invalidateQueries({ queryKey: keys.myHistory() });
    },
  });
}

export function useUpdateOrderStatus(id: string) {
  const qc = useQueryClient();
  return useMutation<OrderDetail, Error, { status: string }>({
    mutationFn: (payload: { status: string }) => orderService.updateStatus(id, payload),
    onSuccess: (updated: OrderDetail) => {
      qc.setQueryData(keys.byId(id), updated);
      qc.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "orders" && q.queryKey[1] === "list" });
    },
    onError: (err) => {
      if (typeof window !== "undefined") toast.error(err.message || "Cập nhật trạng thái thất bại");
    }
  });
}

export function useUpdateDeliveryCode(id: string) {
  const qc = useQueryClient();
  return useMutation<OrderDetail, Error, string>({
    mutationFn: (deliveryCode: string) => orderService.updateDeliveryCode(id, deliveryCode),
    onSuccess: (updated: OrderDetail) => {
      qc.setQueryData(keys.byId(id), updated);
      qc.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "orders" && q.queryKey[1] === "list" });
    },
    onError: (err) => {
      if (typeof window !== "undefined") toast.error(err.message || "Cập nhật mã vận chuyển thất bại");
    }
  });
}

export function useCancelOrder(id: string) {
  const qc = useQueryClient();
  return useMutation<OrderDetail, Error, { orderCode?: string }>({
    mutationFn: (payload: { orderCode?: string }) => orderService.cancel(id, payload.orderCode),
    onSuccess: (updated: OrderDetail) => {
      qc.setQueryData(keys.byId(id), updated);
      qc.invalidateQueries({ queryKey: keys.myHistory() });
      qc.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "orders" && q.queryKey[1] === "list" });
      if (typeof window !== "undefined") toast.success("Đơn hàng đã được hủy thành công");
    },
    onError: (err) => {
      if (typeof window !== "undefined") toast.error(err.message || "Hủy đơn hàng thất bại");
    }
  });
}
