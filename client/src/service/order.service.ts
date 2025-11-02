import { http } from "@/utils/http";
import { API } from "@/constant/api";
import type { Paginated } from "@/type/common";
import type { CheckoutPayload, OrderDetail, OrderSummary, UpdateOrderStatusPayload } from "@/type/order";

type WithData<T> = { data: T };
function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
function hasData<T>(x: unknown): x is WithData<T> {
  return isObject(x) && "data" in x;
}
function hasDataArray<T>(x: unknown): x is WithData<T[]> {
  return isObject(x) && Array.isArray((x as Record<string, unknown>).data as unknown);
}

export const orderService = {
  // POST /orders/checkout
  checkout: async (payload: CheckoutPayload) => {
    type Resp = OrderDetail | WithData<OrderDetail>;
    const body: Resp = await http.post<Resp>(API.order.checkout, payload);
    return hasData<OrderDetail>(body) ? body.data : body;
  },

  // GET /orders/my-history?status=&page=&limit= (auth)
  myHistoryPaginated: async (params?: { status?: string; page?: number; limit?: number; search?: string; fromDate?: string; toDate?: string }) => {
    const qp = new URLSearchParams();
    if (params?.status) qp.set("status", params.status);
    if (params?.page) qp.set("page", String(params.page));
    if (params?.limit) qp.set("limit", String(params.limit));
    if (params?.search) qp.set("search", params.search);
    if (params?.fromDate) qp.set("fromDate", params.fromDate);
    if (params?.toDate) qp.set("toDate", params.toDate);
    const qs = qp.toString();
    type Resp = Paginated<OrderSummary> | (Paginated<OrderSummary> & { data?: OrderSummary[] }) | OrderSummary[] | { data: OrderSummary[] };
    try {
      const body: Resp = await http.get<Resp>(`${API.order.myHistory}${qs ? `?${qs}` : ""}`);
      if (Array.isArray(body)) {
        return { items: body, total: body.length, page: params?.page ?? 1, pageSize: params?.limit ?? body.length } as Paginated<OrderSummary>;
      }
      if (hasDataArray<OrderSummary>(body)) {
        const arr = body.data;
        return { items: arr, total: arr.length, page: params?.page ?? 1, pageSize: params?.limit ?? arr.length } as Paginated<OrderSummary>;
      }
      return body as Paginated<OrderSummary>;
    } catch {
      return { items: [], total: 0, page: params?.page ?? 1, pageSize: params?.limit ?? 10 } as Paginated<OrderSummary>;
    }
  },

  // GET /orders (admin)
  list: async (params?: { page?: number; limit?: number; status?: string; search?: string; code?: string; email?: string; deliveryCode?: string; customerType?: "guest" | "registered" }) => {
    const qp = new URLSearchParams();
    if (params?.page) qp.set("page", String(params.page));
    if (params?.limit) qp.set("limit", String(params.limit));
    if (params?.status) qp.set("status", params.status);
    if (params?.search) qp.set("search", params.search);
    if (params?.code) qp.set("code", params.code);
    if (params?.email) qp.set("email", params.email);
    if (params?.deliveryCode) qp.set("deliveryCode", params.deliveryCode);
    if (params?.customerType === "guest") qp.set("isGuest", "true");
    if (params?.customerType === "registered") qp.set("isGuest", "false");
    const qs = qp.toString();
    type Resp =
      | Paginated<OrderSummary>
      | WithData<Paginated<OrderSummary>
      >
      | OrderSummary[]
      | WithData<OrderSummary[]>;
    const body: Resp = await http.get<Resp>(`${API.order.root}${qs ? `?${qs}` : ""}`);
    if (Array.isArray(body)) {
      return {
        items: body,
        total: body.length,
        page: params?.page ?? 1,
        pageSize: params?.limit ?? body.length,
      } satisfies Paginated<OrderSummary>;
    }
    if (hasDataArray<OrderSummary>(body)) {
      const arr = body.data;
      return {
        items: arr,
        total: arr.length,
        page: params?.page ?? 1,
        pageSize: params?.limit ?? arr.length,
      } satisfies Paginated<OrderSummary>;
    }
    return hasData<Paginated<OrderSummary>>(body) ? body.data : (body as Paginated<OrderSummary>);
  },

  // GET /orders/:id (auth)
  getById: async (id: string) => {
    type Resp = OrderDetail | WithData<OrderDetail>;
    const body: Resp = await http.get<Resp>(API.order.byId(id));
    return hasData<OrderDetail>(body) ? body.data : body;
  },

  // GET /orders/my-history (auth)
  myHistory: async () => {
    type Resp = OrderSummary[] | WithData<OrderSummary[]> | (Paginated<OrderSummary> & WithData<OrderSummary[]>);
    try {
      const body: Resp = await http.get<Resp>(API.order.myHistory);
      if (Array.isArray(body)) return body;
      if (hasDataArray<OrderSummary>(body)) return body.data;
      return [] as OrderSummary[];
    } catch {
      return [] as OrderSummary[];
    }
  },

  // GET /orders/lookup?code=... | ?email=... | ?phone=... (public)
  // Always normalize to a list of orders for UI simplicity
  lookup: async (params: { code?: string; email?: string; phone?: string }) => {
    type Resp = OrderDetail | WithData<OrderDetail> | OrderDetail[] | WithData<OrderDetail[]>;
    const body: Resp = await http.get<Resp>(API.order.lookupGeneric(params));
    if (Array.isArray(body)) return body as OrderDetail[];
    if (hasDataArray<OrderDetail>(body)) return body.data as OrderDetail[];
    if (hasData<OrderDetail>(body)) return [body.data as OrderDetail];
    return [body as OrderDetail];
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
    http.patch<OrderDetail>(API.order.status(id), payload),

  // PATCH /orders/:id/delivery-code (admin)
  updateDeliveryCode: (id: string, deliveryCode: string) =>
    http.patch<OrderDetail>(API.order.deliveryCode(id), { deliveryCode }),

  // POST /orders/:id/cancel (public)
  cancel: (id: string, orderCode?: string) =>
    http.post<OrderDetail>(API.order.cancel(id), orderCode ? { orderCode } : undefined),

  // POST /orders/:id/placed (public)
  markPlaced: (id: string) => http.post<{ ok: boolean }>(API.order.byId(id) + '/placed'),
};
