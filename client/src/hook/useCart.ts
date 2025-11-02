"use client";

import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { cartService, type CartItemPayload } from "@/service/cart.service";
import { cartKeys as keys } from "@/constant/key/cart";
import type { ServerCart, ServerCartItem, SmartCartItem } from "@/type/cart";
import { selectSmartCartItems, selectTotalItems } from "@/selector/cart.selectors";
 

export type LocalAddInfo = {
  sku: string;
  productId: string;
  productName: string;
  variantName: string;
  price?: number;
  compareAt?: number;
  addedAt?: number; 
  thumbnailUrl?: string | null;
};

export type SmartCartApi = {
  source: "local" | "server";
  items: SmartCartItem[];
  isLoading: boolean;
  error: unknown;
  guestCartId?: string;
  totalItems: number;
  add: (variantId: string, quantity?: number, info?: LocalAddInfo) => void;
  updateQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  totals?: ServerCart["totals"];
  appliedDiscount?: ServerCart["appliedDiscount"];
  applyDiscount?: (code: string) => void;
  removeDiscount?: () => void;
  applyDiscountAsync?: (code: string) => Promise<ServerCart>;
  removeDiscountAsync?: () => Promise<ServerCart>;
};

export function useCart(): UseQueryResult<ServerCart, unknown> {
  const q = useQuery<ServerCart, unknown>({
    queryKey: keys.root(),
    queryFn: async () => {
      const data = await cartService.getCart();
      return data ?? ({ items: [] } as ServerCart);
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
  return q;
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CartItemPayload) => cartService.addItem(payload),
    onSuccess: (data) => {
      if (data) qc.setQueryData(keys.root(), data);
      qc.invalidateQueries({ queryKey: keys.root() });
      qc.invalidateQueries({ queryKey: keys.items() });
    },
  });
}

export function useSmartCart(): SmartCartApi {
  const qc = useQueryClient();

  const cartQuery = useQuery<ServerCart>({
    queryKey: keys.root(),
    queryFn: async () => {
      const data = await cartService.getCart();
      return data ?? ({ items: [] } as ServerCart);
    },
    enabled: true,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const addMutation = useMutation({
    mutationFn: (payload: CartItemPayload) => cartService.addItem(payload),
    onSuccess: (data) => {
      if (data) qc.setQueryData(keys.root(), data);
      qc.invalidateQueries({ queryKey: keys.root() });
      qc.invalidateQueries({ queryKey: keys.items() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ itemId, qty }: { itemId: string; qty: number }) => {
      const current = await cartService.getCart();
      const items = (current.items || [])
        .map((it) => ({
          productVariantId: it.productVariantId,
          quantity: it.id === itemId ? qty : it.quantity,
        }));
      return cartService.bulkSet(items);
    },
    onSuccess: (data) => {
      if (data) qc.setQueryData(keys.root(), data);
      qc.invalidateQueries({ queryKey: keys.root() });
      qc.invalidateQueries({ queryKey: keys.items() });
    },
    onError: (err, variables: { itemId: string; qty: number }) => {
      try {
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart:update-error', { detail: { itemId: variables?.itemId, error: err instanceof Error ? err.message : String(err) } }));
      } catch {}
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const current = await cartService.getCart();
      const items = (current.items || [])
        .map((it) => ({
          productVariantId: it.productVariantId,
          quantity: it.id === itemId ? 0 : it.quantity,
        }));
      return cartService.bulkSet(items);
    },
    onSuccess: (data) => {
      if (data) qc.setQueryData(keys.root(), data);
      qc.invalidateQueries({ queryKey: keys.root() });
      qc.invalidateQueries({ queryKey: keys.items() });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => cartService.clear(),
    onSuccess: (data) => {
      if (data) qc.setQueryData(keys.root(), data);
      qc.invalidateQueries({ queryKey: keys.root() });
      qc.invalidateQueries({ queryKey: keys.items() });
    },
  });

  const applyDiscountMutation = useMutation({
    mutationFn: (code: string) => cartService.applyDiscount(code),
    onSuccess: (data) => {
      if (data) {
        qc.setQueryData(keys.root(), data);
      }
      qc.invalidateQueries({ queryKey: keys.root() });
      qc.invalidateQueries({ queryKey: keys.items() });
    },
    onError: (err) => {
      console.error('[CART] Failed to apply discount:', err);
    },
  });

  const removeDiscountMutation = useMutation({
    mutationFn: () => cartService.removeDiscount(),
    onSuccess: (data) => {
      if (data) {
        qc.setQueryData(keys.root(), data);
      }
      qc.invalidateQueries({ queryKey: keys.root() });
      qc.invalidateQueries({ queryKey: keys.items() });
    },
    onError: (err) => {
      console.error('[CART] Failed to remove discount:', err);
    },
  });

  const serverItems: ServerCartItem[] = cartQuery.data?.items || [];
  const normalized: SmartCartItem[] = selectSmartCartItems(serverItems);
  const totals = cartQuery.data?.totals;
  const appliedDiscount = cartQuery.data?.appliedDiscount;
  const totalItems = (totals && typeof totals.totalItems === "number")
    ? Math.max(0, totals.totalItems)
    : selectTotalItems(normalized);

  return {
    source: "server" as const,
    items: normalized,
    isLoading: cartQuery.isLoading,
    error: cartQuery.error,
    guestCartId: undefined,
    totalItems,
    add: (variantId: string, quantity = 1) => addMutation.mutate({ productVariantId: variantId, quantity }),
    updateQty: (itemId: string, qty: number) => updateMutation.mutate({ itemId, qty }),
    remove: (itemId: string) => removeMutation.mutate(itemId),
    clear: () => clearMutation.mutate(),
    totals,
    appliedDiscount,
    applyDiscount: (code: string) => applyDiscountMutation.mutate(code),
    removeDiscount: () => removeDiscountMutation.mutate(),
    applyDiscountAsync: (code: string) => applyDiscountMutation.mutateAsync(code),
    removeDiscountAsync: () => removeDiscountMutation.mutateAsync(),
  };
}