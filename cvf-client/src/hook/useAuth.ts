"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/service/auth.service";
import type { User } from "@/type/user";
import { authKeys as keys } from "@/constant/key/auth";
import { cartKeys } from "@/constant/key/cart";
import { showSuccessToast } from "@/components/toast/AppToast";

export function useAuthProfile() {
  return useQuery<User | null>({
    queryKey: keys.profile(),
    queryFn: async () => {
      const res = await authService.profile();
      if (!res) return null;
      const role = ((): "admin" | "user" => {
        const r = (res as unknown as Record<string, unknown>)?.role;
        if (typeof r === "string" && r.toUpperCase() === "ADMIN") return "admin";
        return "user";
      })();
      const email = (() => {
        const r = res as unknown as { email?: unknown; customer?: { email?: unknown } | null; supplier?: { email?: unknown } | null };
        if (typeof r?.email === "string") return r.email;
        if (typeof r?.customer?.email === "string") return r.customer.email;
        if (typeof r?.supplier?.email === "string") return r.supplier.email;
        return "";
      })();
      return { ...(res as User), email, role } as User;
    },
  });
}

export function useSignup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { username: string; email: string; password: string }) =>
      authService.signup(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.profile() });
    },
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) => authService.login(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.profile() });
    },
  });
}

export function useRefresh() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authService.refresh(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.profile() });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      qc.setQueryData<User | null>(keys.profile(), null);
      try { qc.removeQueries({ queryKey: cartKeys.root() }); } catch {}
      try { qc.removeQueries({ queryKey: cartKeys.items() }); } catch {}
      // Show a consistent logout success toast using shared UI
      showSuccessToast({ title: "Đăng xuất thành công", message: "Hẹn gặp lại bạn!" });
    },
  });
}
