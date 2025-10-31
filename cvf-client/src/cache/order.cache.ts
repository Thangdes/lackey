import { QueryClient } from "@tanstack/react-query";
import { orderKeys as keys } from "@/constant/key/order";
import type { OrderDetail, OrderSummary } from "@/type/order";
import type { Paginated } from "@/type/common";
import { http } from "@/utils/http";

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
    
    const page = params?.page ?? 1;
    const pageSize = params?.limit ?? 10;
    
    let normalized: Paginated<OrderSummary> = { 
      items: [], 
      total: 0, 
      page, 
      pageSize 
    };

    if (Array.isArray(data)) {
      normalized = { 
        items: data, 
        total: data.length, 
        page, 
        pageSize: params?.limit ?? data.length 
      };
    } else if (data && typeof data === 'object') {
      normalized = {
        items: Array.isArray(data.items) ? data.items : [],
        total: Number(data.total ?? 0),
        page: Number(data.page ?? page),
        pageSize: Number(data.pageSize ?? pageSize),
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
    const data = await http.get<OrderSummary[]>(
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
    setMyOrderHistory(qc, Array.isArray(data) ? data : []);
  } catch {
  }
}

export async function prefetchOrderDetail(qc: QueryClient, id: string, cookieHeader?: string) {
  try {
    const data = await http.get<OrderDetail>(
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
    if (data) {
      qc.setQueryData<OrderDetail>(keys.byId(id), data);
    }
  } catch (error) {
    console.error(`Failed to fetch order detail for ID ${id}:`, error);
  }
}
