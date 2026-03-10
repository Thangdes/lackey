import { QueryClient } from "@tanstack/react-query";
import { orderKeys as keys } from "@/constant/key/order";
import type { OrderDetail, OrderSummary } from "@/type/order";
import type { Paginated } from "@/type/common";
import { http } from "@/utils/http";
import { unwrapData, unwrapDataArray } from "@/utils/response";

export function setMyOrderHistory(qc: QueryClient, data: OrderSummary[]) {
  qc.setQueryData<OrderSummary[]>(keys.myHistory(), data);
}

export async function prefetchAdminOrderList(
  qc: QueryClient,
  params: { page?: number; limit?: number; status?: string; search?: string },
  cookieHeader?: string,
) {
  try {
    const qp = new URLSearchParams();
    if (params?.page) qp.set('page', String(params.page));
    if (params?.limit) qp.set('limit', String(params.limit));
    if (params?.status) qp.set('status', params.status);
    if (params?.search) qp.set('search', params.search);
    
    const queryString = qp.toString();
    const url = `/orders${queryString ? `?${queryString}` : ''}`;
    
    const data = await http.get<Paginated<OrderSummary> | OrderSummary[]>(
      url,
      cookieHeader
        ? {
            headers: {
              Cookie: cookieHeader,
            },
            withCredentials: true,
          }
        : undefined,
    );

    const payload = unwrapData<unknown>(data);
    
    const page = params?.page ?? 1;
    const pageSize = params?.limit ?? 10;
    
    let normalized: Paginated<OrderSummary> = { 
      items: [], 
      total: 0, 
      page, 
      pageSize 
    };

    if (Array.isArray(payload)) {
      normalized = { 
        items: payload as OrderSummary[], 
        total: (payload as OrderSummary[]).length, 
        page, 
        pageSize: params?.limit ?? (payload as OrderSummary[]).length 
      };
    } else if (payload && typeof payload === 'object') {
      const p = payload as Partial<Paginated<OrderSummary>> & Record<string, unknown>;
      normalized = {
        items: Array.isArray(p.items) ? (p.items as OrderSummary[]) : unwrapDataArray<OrderSummary>(p),
        total: Number(p.total ?? 0),
        page: Number(p.page ?? page),
        pageSize: Number(p.pageSize ?? pageSize),
      };
    }
    
    qc.setQueryData(
      keys.list(params?.page, params?.limit, params?.status ?? null, params?.search ?? null), 
      normalized
    );
  } catch (error) {
    console.error('Failed to fetch admin order list:', error);
  }
}

export async function prefetchMyOrderHistory(qc: QueryClient, cookieHeader?: string) {
  try {
    const data = await http.get<unknown>(
      "/orders/my-history",
      cookieHeader
        ? {
            headers: {
              Cookie: cookieHeader,
            },
            withCredentials: true,
          }
        : undefined,
    );
    const arr = unwrapDataArray<OrderSummary>(data);
    setMyOrderHistory(qc, arr);
  } catch {
  }
}

export async function prefetchOrderDetail(qc: QueryClient, id: string, cookieHeader?: string) {
  try {
    const data = await http.get<unknown>(
      `/orders/${id}`,
      cookieHeader
        ? {
            headers: {
              Cookie: cookieHeader,
            },
            withCredentials: true,
          }
        : undefined,
    );
    const detail = unwrapData<OrderDetail>(data);
    if (detail) {
      qc.setQueryData<OrderDetail>(keys.byId(id), detail);
    }
  } catch (error) {
    console.error(`Failed to fetch order detail for ID ${id}:`, error);
  }
}
