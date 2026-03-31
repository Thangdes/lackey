import { http } from "@/utils/http";
import { unwrapData, unwrapDataArray, buildQueryString } from "@/utils/response";
import { API } from "@/constant/api";
import type { Paginated } from "@/type/common";
import type { CheckoutPayload, OrderDetail, OrderSummary, UpdateOrderStatusPayload } from "@/type/order";

export const orderService = {
  // POST /orders/checkout
  checkout: async (payload: CheckoutPayload) => {
    const body = await http.post<unknown>(API.order.checkout, payload);
    return unwrapData<OrderDetail>(body);
  },

  // GET /orders/my-history?status=&page=&limit= (auth)
  myHistoryPaginated: async (params?: { status?: string; page?: number; limit?: number; search?: string; fromDate?: string; toDate?: string }) => {
    const qs = buildQueryString({
      status: params?.status,
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      fromDate: params?.fromDate,
      toDate: params?.toDate,
    });
    try {
      const body = await http.get<unknown>(`${API.order.myHistory}${qs ? `?${qs}` : ""}`);
      const items = unwrapDataArray<OrderSummary>(body);
      if (items !== (body as unknown)) {
        // was wrapped in { data: [] }
        return { items, total: items.length, page: params?.page ?? 1, pageSize: params?.limit ?? items.length } as Paginated<OrderSummary>;
      }
      // Check if it's already a Paginated shape
      if (body && typeof body === "object" && "items" in (body as object)) {
        return body as Paginated<OrderSummary>;
      }
      return { items, total: items.length, page: params?.page ?? 1, pageSize: params?.limit ?? items.length } as Paginated<OrderSummary>;
    } catch {
      return { items: [], total: 0, page: params?.page ?? 1, pageSize: params?.limit ?? 10 } as Paginated<OrderSummary>;
    }
  },

  // GET /orders (admin)
  list: async (params?: { page?: number; limit?: number; status?: string; search?: string; code?: string; email?: string; deliveryCode?: string; customerType?: "guest" | "registered" }) => {
    const isGuestParam =
      params?.customerType === "guest" ? true :
      params?.customerType === "registered" ? false :
      undefined;

    const status = (params?.status ?? "").trim() || undefined;
    const search = (params?.search ?? "").trim() || undefined;
    const code = (params?.code ?? "").trim() || undefined;
    const email = (params?.email ?? "").trim() || undefined;
    const deliveryCode = (params?.deliveryCode ?? "").trim() || undefined;

    const qs = buildQueryString({
      page: params?.page,
      limit: params?.limit,
      status,
      search,
      code,
      email,
      deliveryCode,
      isGuest: isGuestParam,
    });

    const body = await http.get<unknown>(`${API.order.root}${qs ? `?${qs}` : ""}`);

    const payload = unwrapData<unknown>(body);

    // Check if it's a Paginated<OrderSummary> shape with `items`
    if (payload && typeof payload === "object" && "items" in (payload as object)) {
      return payload as Paginated<OrderSummary>;
    }

    const items = unwrapDataArray<OrderSummary>(payload);
    return {
      items,
      total: items.length,
      page: params?.page ?? 1,
      pageSize: params?.limit ?? items.length,
    } satisfies Paginated<OrderSummary>;
  },

  // GET /orders/:id (auth)
  getById: async (id: string) => {
    const body = await http.get<unknown>(API.order.byId(id));
    return unwrapData<OrderDetail>(body);
  },

  // GET /orders/my-history (auth)
  myHistory: async () => {
    try {
      const body = await http.get<unknown>(API.order.myHistory);
      return unwrapDataArray<OrderSummary>(body);
    } catch {
      return [] as OrderSummary[];
    }
  },

  // GET /orders/lookup?code=... | ?email=... | ?phone=... (public)
  // Always normalize to a list of orders for UI simplicity
  lookup: async (params: { code?: string; email?: string; phone?: string }) => {
    const body = await http.get<unknown>(API.order.lookupGeneric(params));
    if (Array.isArray(body)) return body as OrderDetail[];
    const arr = unwrapDataArray<OrderDetail>(body);
    if (arr.length > 0) return arr;
    // single object wrapped or plain
    return [unwrapData<OrderDetail>(body)];
  },

  // GET /orders/lookup?code=... (public) - kept for backward compatibility
  lookupByCode: async (code: string) => {
    const arr = await orderService.lookup({ code });
    return arr[0] as OrderDetail;
  },

  // GET /orders/lookup?phone=... - kept for backward compatibility
  lookupByPhone: async (phone: string) => {
    const arr = await orderService.lookup({ phone });
    return arr[0] as OrderDetail;
  },

  // GET /orders/lookup?email=... - kept for backward compatibility
  lookupByEmail: async (email: string) => {
    const arr = await orderService.lookup({ email });
    return arr[0] as OrderDetail;
  },

  // PATCH /orders/:id/status (admin)
  updateStatus: (id: string, payload: UpdateOrderStatusPayload) =>
    http.patch<unknown>(API.order.status(id), payload).then((raw) => unwrapData<OrderDetail>(raw)),

  // PATCH /orders/:id/delivery-code (admin)
  updateDeliveryCode: (id: string, deliveryCode: string) =>
    http.patch<unknown>(API.order.deliveryCode(id), { deliveryCode }).then((raw) => unwrapData<OrderDetail>(raw)),

  // POST /orders/:id/cancel (public)
  cancel: (id: string, orderCode?: string) =>
    http.post<unknown>(API.order.cancel(id), orderCode ? { orderCode } : undefined).then((raw) => unwrapData<OrderDetail>(raw)),

  // POST /orders/:id/placed (public)
  markPlaced: (id: string) => http.post<{ ok: boolean }>(API.order.byId(id) + '/placed'),
};
