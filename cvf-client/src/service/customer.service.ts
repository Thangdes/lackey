import { http } from "@/utils/http";
import { API } from "@/constant/api";
import type { Customer, CustomerAddress } from "@/type/customer";

export type CustomerListParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const customerService = {
  // GET /customers?page=1&limit=10&search=...
  list: async (params: CustomerListParams) => {
    const url = API.customers.list(params.page ?? 1, params.limit ?? 10, params.search);
    const raw = await http.get<
      | Customer[]
      | ({ data?: Customer[]; items?: Customer[]; customers?: Customer[]; meta?: Record<string, unknown> } & Record<string, unknown>)
    >(url);

    // Normalize data array
    const data: Customer[] = Array.isArray(raw)
      ? raw
      : (() => {
          const r = raw as Partial<{ data?: unknown; items?: unknown; customers?: unknown }> | undefined;
          if (r && Array.isArray(r.data)) return r.data as Customer[];
          if (r && Array.isArray(r.items)) return r.items as Customer[];
          if (r && Array.isArray(r.customers)) return r.customers as Customer[];
          return [] as Customer[];
        })();

    // Normalize meta similar to productService.list
    const m: Record<string, unknown> = Array.isArray(raw)
      ? {}
      : ((raw as { meta?: unknown } | Record<string, unknown> | undefined)?.meta as Record<string, unknown> | undefined) ??
        ((raw as Record<string, unknown>) || {});
    const page = (m.page as number) ?? (m.currentPage as number) ?? (params.page ?? 1);
    const limit = (m.limit as number) ?? (m.pageSize as number) ?? (m.perPage as number) ?? (params.limit ?? 10);
    const total =
      (m.total as number) ??
      (m.totalItems as number) ??
      (typeof m.totalPages === "number" ? (m.totalPages as number) * ((m.limit as number) ?? (m.pageSize as number) ?? (m.perPage as number) ?? limit) : undefined);

    return { data, meta: { page, limit, total } } as { data: Customer[]; meta?: { page?: number; limit?: number; total?: number } };
  },

  // GET /customers/:id
  getById: (id: string) => http.get<Customer>(API.customers.byId(id)),

  // GET /customers/me (current authenticated customer profile)
  getMe: () => http.get<Customer | null>(API.customers.me),

  // GET /customers/:customerId/addresses
  listAddresses: (customerId: string) => http.get<CustomerAddress[]>(API.customers.addresses(customerId)),

  // POST /customers/:customerId/addresses
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
  ) => http.post<CustomerAddress>(API.customers.addresses(customerId), payload),

  // PATCH /customers/:customerId/addresses/:addressId
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
  ) => http.patch<CustomerAddress>(API.customers.addressById(customerId, addressId), payload),

  // DELETE /customers/:customerId/addresses/:addressId
  removeAddress: (customerId: string, addressId: string) =>
    http.delete<{ message: string }>(API.customers.addressById(customerId, addressId)),
};
