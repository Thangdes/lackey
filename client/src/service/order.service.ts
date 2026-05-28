import { http } from "@/utils/http";
import { unwrapData, unwrapDataArray, buildQueryString } from "@/utils/response";
import { API } from "@/constant/api";
import type { Paginated } from "@/type/common";
import type { CheckoutPayload, OrderDetail, OrderSummary, UpdateOrderStatusPayload } from "@/type/order";

export const orderService = {
  
  checkout: async (payload: CheckoutPayload) => {
    const body = await http.post<unknown>(API.order.checkout, payload);
    return unwrapData<OrderDetail>(body);
  },

  
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
        
        return { items, total: items.length, page: params?.page ?? 1, pageSize: params?.limit ?? items.length } as Paginated<OrderSummary>;
      }
      
      if (body && typeof body === "object" && "items" in (body as object)) {
        return body as Paginated<OrderSummary>;
      }
      return { items, total: items.length, page: params?.page ?? 1, pageSize: params?.limit ?? items.length } as Paginated<OrderSummary>;
    } catch {
      return { items: [], total: 0, page: params?.page ?? 1, pageSize: params?.limit ?? 10 } as Paginated<OrderSummary>;
    }
  },

  
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

  
  getById: async (id: string) => {
    const body = await http.get<unknown>(API.order.byId(id));
    return unwrapData<OrderDetail>(body);
  },

  
  myHistory: async () => {
    try {
      const body = await http.get<unknown>(API.order.myHistory);
      return unwrapDataArray<OrderSummary>(body);
    } catch {
      return [] as OrderSummary[];
    }
  },

  
  
  lookup: async (params: { code?: string; email?: string; phone?: string }) => {
    const body = await http.get<unknown>(API.order.lookupGeneric(params));
    if (Array.isArray(body)) return body as OrderDetail[];
    const arr = unwrapDataArray<OrderDetail>(body);
    if (arr.length > 0) return arr;
    
    return [unwrapData<OrderDetail>(body)];
  },

  
  lookupByCode: async (code: string) => {
    const arr = await orderService.lookup({ code });
    return arr[0] as OrderDetail;
  },

  
  lookupByPhone: async (phone: string) => {
    const arr = await orderService.lookup({ phone });
    return arr[0] as OrderDetail;
  },

  
  lookupByEmail: async (email: string) => {
    const arr = await orderService.lookup({ email });
    return arr[0] as OrderDetail;
  },

  
  updateStatus: (id: string, payload: UpdateOrderStatusPayload) =>
    http.patch<unknown>(API.order.status(id), payload).then((raw) => unwrapData<OrderDetail>(raw)),

  
  updateDeliveryCode: (id: string, deliveryCode: string) =>
    http.patch<unknown>(API.order.deliveryCode(id), { deliveryCode }).then((raw) => unwrapData<OrderDetail>(raw)),

  
  cancel: (id: string, orderCode?: string) =>
    http.post<unknown>(API.order.cancel(id), orderCode ? { orderCode } : undefined).then((raw) => unwrapData<OrderDetail>(raw)),

  
  markPlaced: (id: string) => http.post<{ ok: boolean }>(API.order.byId(id) + '/placed'),
};
