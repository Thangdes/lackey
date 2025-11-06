'use client'

import { X, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatVND } from '@/utils/format'
import { useWishlist } from '@/hook/useWishlist'
import { buildProductDetailPath } from '@/constant/route'
import type { WishlistItem } from '@/type/wishlist'
import { cn } from '@/lib/utils'

export type WishlistCardProps = {
  item: WishlistItem
  onAddToCart?: (item: WishlistItem) => void
}

export default function WishlistCard({ item, onAddToCart }: WishlistCardProps) {
  const { removeFromWishlist } = useWishlist()
  const { product, variant } = item

  if (!product) return null

  const price = variant?.price || product.minEffectivePrice || 0
  const discountPrice = variant?.discountPrice
  const hasDiscount = discountPrice && discountPrice > 0 && discountPrice < price
  const finalPrice = hasDiscount ? discountPrice : price
  const savings = hasDiscount ? price - discountPrice : 0
  const discountPercent = hasDiscount ? Math.round((savings / price) * 100) : 0

  const imageUrl = product.thumbnailUrl || product.images?.[0] || '/logo/logo.jpg'
  const productUrl = buildProductDetailPath(product.slug || product.id)

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await removeFromWishlist(product.id, variant?.id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(item)
  }

  return (
    <div className="group relative bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 overflow-hidden">
      <Link href={productUrl} className="block">
        <div className="relative aspect-square overflow-hidden bg-black/5">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-[#AE1C2C] text-white text-xs font-bold px-2 py-1 border-2 border-black uppercase tracking-wider">
              -{discountPercent}%
            </div>
          )}

          <button
            onClick={handleRemove}
            className={cn(
              'absolute top-2 right-2 w-8 h-8 flex items-center justify-center',
              'bg-white border-2 border-black',
              'text-black hover:bg-[#AE1C2C] hover:text-white',
              'transition-all duration-200',
              'opacity-0 group-hover:opacity-100'
            )}
            aria-label="Xóa khỏi yêu thích"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-3 border-t-2 border-black">
          <h3 className="text-sm font-bold text-black line-clamp-2 min-h-[2.5rem] mb-2 uppercase tracking-wide">
            {product.name}
          </h3>

          {variant && (
            <p className="text-xs text-neutral-600 mb-2 line-clamp-1 font-medium">
              {variant.name}
            </p>
          )}

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[#AE1C2C]">
              {formatVND(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-500 line-through font-medium">
                {formatVND(price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-600 mb-3 font-medium">
            {product.ratingAvg && product.ratingCount ? (
              <div className="flex items-center gap-1">
                <span className="text-[#AE1C2C]">★</span>
                <span className="font-bold">{product.ratingAvg.toFixed(1)}</span>
                <span>({product.ratingCount})</span>
              </div>
            ) : null}
            {product.totalBuyCount ? (
              <span className="font-bold">Đã bán {product.totalBuyCount}</span>
            ) : null}
          </div>

          {onAddToCart && (
            <button
              onClick={handleAddToCart}
              className={cn(
                'w-full py-2 px-3 border-2 border-black',
                'bg-black text-white text-xs font-bold uppercase tracking-wider',
                'hover:bg-neutral-800 active:translate-y-0.5',
                'transition-all duration-200',
                'flex items-center justify-center gap-2'
              )}
            >
              <ShoppingCart size={14} strokeWidth={2.5} />
              <span>Thêm vào giỏ</span>
            </button>
          )}
        </div>
      </Link>
    </div>
  )
}
