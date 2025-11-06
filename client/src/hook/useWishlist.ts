'use client'

import { useCallback } from 'react'
import { useWishlistStore } from '@/store/wishlist'
import { wishlistService } from '@/service/wishlist.service'
import type { Product, ProductVariant } from '@/type/product'
import type { WishlistItem } from '@/type/wishlist'
import { toast } from 'sonner'

export function useWishlist() {
  const {
    items,
    isLoading,
    totalItems,
    addItem,
    removeItem,
    clearWishlist,
    setItems,
    setLoading,
    isInWishlist,
  } = useWishlistStore()

  const addToWishlist = useCallback(async (
    product: Product,
    variant?: ProductVariant
  ) => {
    try {
      const wishlistItem: WishlistItem = {
        id: `${product.id}-${variant?.id || 'default'}`,
        productId: product.id,
        variantId: variant?.id,
        addedAt: new Date().toISOString(),
        product,
        variant,
      }

      addItem(wishlistItem)
      
      toast.success('Đã thêm vào yêu thích', {
        description: product.name,
      })

      try {
        await wishlistService.addItem({
          productId: product.id,
          variantId: variant?.id,
        })
      } catch (error) {
        console.warn('[WISHLIST] Failed to sync with server:', error)
      }
    } catch (error) {
      console.error('[WISHLIST] Failed to add item:', error)
      toast.error('Không thể thêm vào yêu thích')
    }
  }, [addItem])

  const removeFromWishlist = useCallback(async (
    productId: string,
    variantId?: string
  ) => {
    try {
      removeItem(productId, variantId)
      
      toast.success('Đã xóa khỏi yêu thích')

      try {
        await wishlistService.removeItem(productId, variantId)
      } catch (error) {
        console.warn('[WISHLIST] Failed to sync removal with server:', error)
      }
    } catch (error) {
      console.error('[WISHLIST] Failed to remove item:', error)
      toast.error('Không thể xóa khỏi yêu thích')
    }
  }, [removeItem])

  const toggleWishlist = useCallback(async (
    product: Product,
    variant?: ProductVariant
  ) => {
    const inWishlist = isInWishlist(product.id, variant?.id)
    
    if (inWishlist) {
      await removeFromWishlist(product.id, variant?.id)
    } else {
      await addToWishlist(product, variant)
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist])

  const clearAll = useCallback(async () => {
    try {
      clearWishlist()
      toast.success('Đã xóa toàn bộ yêu thích')

      try {
        await wishlistService.clearWishlist()
      } catch (error) {
        console.warn('[WISHLIST] Failed to sync clear with server:', error)
      }
    } catch (error) {
      console.error('[WISHLIST] Failed to clear wishlist:', error)
      toast.error('Không thể xóa wishlist')
    }
  }, [clearWishlist])

  const syncWithServer = useCallback(async () => {
    try {
      setLoading(true)
      const serverItems = await wishlistService.getWishlist()
      setItems(serverItems)
    } catch (error) {
      console.error('[WISHLIST] Failed to sync with server:', error)
    } finally {
      setLoading(false)
    }
  }, [setItems, setLoading])

  return {
    items,
    isLoading,
    totalItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearAll,
    isInWishlist,
    syncWithServer,
  }
}

export function useWishlistItem(productId: string, variantId?: string) {
  const isInWishlist = useWishlistStore(state => 
    state.isInWishlist(productId, variantId)
  )
  const { toggleWishlist } = useWishlist()

  return {
    isInWishlist,
    toggleWishlist,
  }
}
