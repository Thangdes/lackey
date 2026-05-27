'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistItem } from '@/type/wishlist'

const WISHLIST_STORAGE_KEY = 'cvf-wishlist'

export type WishlistState = {
  items: WishlistItem[]
  isLoading: boolean
  productIds: Set<string>
  totalItems: number
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string, variantId?: string) => void
  clearWishlist: () => void
  setItems: (items: WishlistItem[]) => void
  setLoading: (loading: boolean) => void
  isInWishlist: (productId: string, variantId?: string) => boolean
  toggleItem: (item: WishlistItem) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      productIds: new Set<string>(),
      totalItems: 0,

      addItem: (item: WishlistItem) => {
        set((state) => {
          const exists = state.items.some(
            (i) => 
              i.productId === item.productId && 
              (item.variantId ? i.variantId === item.variantId : !i.variantId)
          )
          
          if (exists) return state

          const newItems = [item, ...state.items]
          const productIds = new Set(newItems.map(i => i.productId))
          
          return {
            items: newItems,
            productIds,
            totalItems: newItems.length,
          }
        })
      },

      removeItem: (productId: string, variantId?: string) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => 
              !(item.productId === productId && 
                (variantId ? item.variantId === variantId : !item.variantId))
          )
          const productIds = new Set(newItems.map(i => i.productId))
          
          return {
            items: newItems,
            productIds,
            totalItems: newItems.length,
          }
        })
      },

      clearWishlist: () => {
        set({
          items: [],
          productIds: new Set(),
          totalItems: 0,
        })
      },

      setItems: (items: WishlistItem[]) => {
        const safeItems = Array.isArray(items) ? items : []
        const productIds = new Set(safeItems.map(i => i.productId))
        set({
          items: safeItems,
          productIds,
          totalItems: safeItems.length,
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      isInWishlist: (productId: string, variantId?: string) => {
        const state = get()
        return state.items.some(
          (item) => 
            item.productId === productId && 
            (variantId ? item.variantId === variantId : !item.variantId)
        )
      },

      toggleItem: (item: WishlistItem) => {
        const state = get()
        const exists = state.isInWishlist(item.productId, item.variantId)
        
        if (exists) {
          state.removeItem(item.productId, item.variantId)
        } else {
          state.addItem(item)
        }
      },
    }),
    {
      name: WISHLIST_STORAGE_KEY,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.productIds = new Set(state.items.map(i => i.productId))
          state.totalItems = state.items.length
        }
      },
    }
  )
)
