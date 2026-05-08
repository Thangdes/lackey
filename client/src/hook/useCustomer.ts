import { useQuery } from "@tanstack/react-query";
import { customerService, type CustomerListParams } from "@/service/customer.service";
import type { Customer } from "@/type/customer";

import { useIsAuthenticated } from "@/hook/useIsAuthenticated";

export function useCustomerList(params: CustomerListParams) {
  const { page = 1, limit = 10, search } = params;
  return useQuery<{ data: Customer[]; meta?: { page?: number; limit?: number; total?: number } }>({
    queryKey: ["customers", page, limit, search ?? ""],
    queryFn: () => customerService.list({ page, limit, search }),
    placeholderData: { data: [], meta: { page, limit, total: 0 } },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });
}

export function useCustomerById(id: string) {
  return useQuery<Customer | null>({
    queryKey: ["customers", id],
    queryFn: async () => {
      const r = await customerService.getById(id);
      return r ?? null; 
    },
    enabled: !!id,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });
}

export function useCustomerMe() {
  const isAuth = useIsAuthenticated();
  return useQuery<Customer | null>({
    queryKey: ["customers", "me"],
    queryFn: async () => {
      const r = await customerService.getMe().catch(() => null);
      return r ?? null;
    },
    enabled: isAuth,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });
}
