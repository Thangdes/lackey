import { http } from "@/utils/http";
import { API } from "@/constant/api";
import type { ServerCart, CartItemPayload, UpdateCartItemPayload } from "@/type/cart";


export type { CartItemPayload, UpdateCartItemPayload };

export const cartService = {
  
  getCart: async () => {
    try {
      return await http.get<ServerCart>(API.cart.root);
    } catch {
      return { items: [] } as ServerCart;
    }
  },

  
  addItem: async (payload: CartItemPayload) => {
    const res = await http.post<ServerCart>(API.cart.items, payload);
    try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'addItem' } })); } catch {}
    return res;
  },

  
  updateItem: async (itemId: string, payload: UpdateCartItemPayload) => {
    const res = await http.post<ServerCart>(
      API.cart.itemById(itemId),
      payload,
      { params: { _method: 'PATCH' } }
    );
    try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'updateItem' } })); } catch {}
    return res;
  },

  
  removeItem: async (itemId: string) => {
    const res = await http.delete<ServerCart>(API.cart.itemById(itemId));
    try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'removeItem' } })); } catch {}
    return res;
  },

  
  clear: async () => {
    const res = await http.post<ServerCart>(API.cart.clear);
    try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'clear' } })); } catch {}
    return res;
  },

  
  bulkSet: async (items: Array<{ productVariantId: string; quantity: number }>) => {
    const res = await http.post<ServerCart>(API.cart.bulkSet, { items });
    try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'bulkSet' } })); } catch {}
    return res;
  },

  
  applyDiscount: async (code: string) => {
    const res = await http.post<ServerCart>(API.cart.applyDiscount, { code });
    try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'applyDiscount' } })); } catch {}
    return res;
  },

  
  removeDiscount: async () => {
    const res = await http.post<ServerCart>(API.cart.removeDiscount);
    try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart:changed', { detail: { source: 'removeDiscount' } })); } catch {}
    return res;
  },
};
