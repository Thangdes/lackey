import { http } from "@/utils/http";
import { normalizePaginationMeta, unwrapData, unwrapDataArray } from "@/utils/response";
import { API } from "@/constant/api";
import type { Customer, CustomerAddress, CustomerListParams } from "@/type/customer";

export type { CustomerListParams };

export const customerService = {
  
  list: async (params: CustomerListParams) => {
    const url = API.customers.list(params.page ?? 1, params.limit ?? 10, params.search);
    const raw = await http.get<
      | Customer[]
      | ({ data?: Customer[]; items?: Customer[]; customers?: Customer[]; meta?: Record<string, unknown> } & Record<string, unknown>)
    >(url);

    const payload = unwrapData<
      | Customer[]
      | ({ data?: Customer[]; items?: Customer[]; customers?: Customer[]; meta?: Record<string, unknown> } & Record<string, unknown>)
    >(raw);

    
    const data: Customer[] = Array.isArray(payload)
      ? payload
      : (() => {
          const r = payload as Partial<{ data?: unknown; items?: unknown; customers?: unknown }> | undefined;
          if (r && Array.isArray(r.data)) return r.data as Customer[];
          if (r && Array.isArray(r.items)) return r.items as Customer[];
          if (r && Array.isArray(r.customers)) return r.customers as Customer[];
          return [] as Customer[];
        })();

    
    const rawMeta = Array.isArray(payload) ? {} : (payload as { meta?: unknown } | undefined)?.meta ?? payload;
    const meta = normalizePaginationMeta(rawMeta, { page: params.page ?? 1, limit: params.limit ?? 10 });

    return { data, meta } as { data: Customer[]; meta?: { page?: number; limit?: number; total?: number } };
  },

  
  getById: (id: string) => http.get<unknown>(API.customers.byId(id)).then((raw) => unwrapData<Customer>(raw)),

  
  getMe: () => http.get<unknown>(API.customers.me).then((raw) => unwrapData<Customer | null>(raw)),

  
  listAddresses: (customerId: string) =>
    http.get<unknown>(API.customers.addresses(customerId)).then((raw) => unwrapDataArray<CustomerAddress>(raw)),

  
  addAddress: (
    customerId: string,
    payload: {
      recipientName: string;
      phoneNumber: string;
      street: string;
      ward: string;
      district: string;
      city: string;
      isDefault?: boolean;
    }
  ) => http.post<unknown>(API.customers.addresses(customerId), payload).then((raw) => unwrapData<CustomerAddress>(raw)),

  
  updateAddress: (
    customerId: string,
    addressId: string,
    payload: Partial<{
      recipientName: string;
      phoneNumber: string;
      street: string;
      ward: string;
      district: string;
      city: string;
      isDefault: boolean;
    }>
  ) =>
    http
      .patch<unknown>(API.customers.addressById(customerId, addressId), payload)
      .then((raw) => unwrapData<CustomerAddress>(raw)),

  
  removeAddress: (customerId: string, addressId: string) =>
    http
      .delete<unknown>(API.customers.addressById(customerId, addressId))
      .then((raw) => unwrapData<{ message: string }>(raw)),
};
