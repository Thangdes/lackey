"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_CONSTANTS } from "@/constant/auth";
import { authService } from "@/service/auth.service";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys as keys } from "@/constant/key/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constant/route";
import { cartService } from "@/service/cart.service";
import { cartKeys } from "@/constant/key/cart";

export type AuthUser = { name?: string; email: string } | null;

export type AuthContextType = {
  user: AuthUser;
  login: (payload: { email: string; password: string; remember?: boolean }) => Promise<void> | void;
  register: (payload: { name?: string; email: string; password: string; remember?: boolean }) => Promise<void> | void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = AUTH_CONSTANTS.storageKey;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const qc = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = useCallback((u: AuthUser, remember?: boolean) => {
    setUser(u);
    try {
      if (remember && u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  useEffect(() => {
    const onSuccess = async () => {
      try {
        const prof = await authService.profile().catch(() => null);
        const remembered = (() => {
          try { return !!window.localStorage.getItem(STORAGE_KEY); } catch { return false; }
        })();
        const u = prof
          ? ({ name: (prof.name ?? prof.username), email: prof.email } as AuthUser)
          : user;
        persist(u ?? null, remembered);
        qc.invalidateQueries({ queryKey: keys.profile() });
        try { await qc.invalidateQueries({ queryKey: cartKeys.root() }); } catch {}
        try { await qc.invalidateQueries({ queryKey: cartKeys.items() }); } catch {}
        try { await qc.refetchQueries({ queryKey: cartKeys.root() }); } catch {}
      } catch {}
    };
    const onFailed = () => {
      const remembered = (() => {
        try { return !!window.localStorage.getItem(STORAGE_KEY); } catch { return false; }
      })();
      const hadSession = remembered || !!user;
      persist(null, false);
      try { qc.setQueryData(keys.profile(), null); } catch {}
      try { qc.removeQueries({ queryKey: cartKeys.root() }); } catch {}
      try { qc.removeQueries({ queryKey: cartKeys.items() }); } catch {}
      if (hadSession) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        try { router.push(ROUTES.home); } catch {}
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:refresh-success', onSuccess as EventListener);
      window.addEventListener('auth:refresh-failed', onFailed as EventListener);
      return () => {
        window.removeEventListener('auth:refresh-success', onSuccess as EventListener);
        window.removeEventListener('auth:refresh-failed', onFailed as EventListener);
      };
    }
  }, [persist, qc, user, router]);

  const login = useCallback(async ({ email, password, remember }: { email: string; password: string; remember?: boolean }) => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('cartItems') || '[]';
        const localItems: Array<{ variantId: string; quantity: number }> = JSON.parse(raw);
        if (Array.isArray(localItems) && localItems.length > 0) {
          await Promise.allSettled(
            localItems
              .filter((it) => it && it.variantId && it.quantity > 0)
              .map((it) => cartService.addItem({ productVariantId: it.variantId, quantity: it.quantity }))
          );
        }
      } catch {}
    }

    await authService.login({ email, password });
    const prof = await authService.profile().catch(() => null);
    const u = prof ? ({ name: (prof.name ?? prof.username), email: prof.email || email } as AuthUser) : ({ email } as AuthUser);
    persist(u, remember);

    try {
      qc.setQueryData(keys.profile(), prof);
      await qc.invalidateQueries({ queryKey: keys.profile() });
      await qc.refetchQueries({ queryKey: keys.profile() });
    } catch {}

    if (typeof window !== 'undefined') {
      try { window.dispatchEvent(new CustomEvent('auth:login-success')); } catch {}
    }

    if (typeof window !== 'undefined') {
      try { window.localStorage.removeItem('cartItems'); } catch {}
    }
    // After login, refetch cart as authenticated user
    try { await qc.invalidateQueries({ queryKey: cartKeys.root() }); } catch {}
    try { await qc.invalidateQueries({ queryKey: cartKeys.items() }); } catch {}
    try { await qc.refetchQueries({ queryKey: cartKeys.root() }); } catch {}
  }, [persist, qc]);

  const register = useCallback(async ({ name, email, password, remember }: { name?: string; email: string; password: string; remember?: boolean }) => {
    await authService.signup({ fullName: name, email, password });
    const prof = await authService.profile().catch(() => null);
    const u = prof ? ({ name: (prof.name ?? prof.username ?? name), email: prof.email || email } as AuthUser) : ({ name, email } as AuthUser);
    persist(u, remember);

    try {
      qc.setQueryData(keys.profile(), prof);
      await qc.invalidateQueries({ queryKey: keys.profile() });
      await qc.refetchQueries({ queryKey: keys.profile() });
    } catch {}

    if (typeof window !== 'undefined') {
      try { window.dispatchEvent(new CustomEvent('auth:login-success')); } catch {}
    }
  }, [persist, qc]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      // Clear auth user
      persist(null, false);
      // Clear cart cache to avoid showing stale user cart after logout
      try { qc.removeQueries({ queryKey: cartKeys.root() }); } catch {}
      try { qc.removeQueries({ queryKey: cartKeys.items() }); } catch {}
      try { await cartService.clear(); } catch {}
    }
  }, [persist, qc]);

  const value = useMemo(() => ({ user, login, register, logout }), [login, logout, register, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error(AUTH_CONSTANTS.errors.context);
  return ctx;
}
