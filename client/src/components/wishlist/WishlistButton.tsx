'use client'

import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/hook/useWishlist'
import type { Product, ProductVariant } from '@/type/product'

export type WishlistButtonProps = {
  product: Product
  variant?: ProductVariant
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function WishlistButton({
  product,
  variant,
  className,
  size = 'md',
  showLabel = false,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id, variant?.id)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleWishlist(product, variant)
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group relative flex items-center justify-center rounded-full',
        'transition-all duration-200',
        'hover:scale-110 active:scale-95',
        inWishlist
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500',
        'shadow-md hover:shadow-lg',
        sizeClasses[size],
        className
      )}
      aria-label={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      title={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      <Heart
        size={iconSizes[size]}
        className={cn(
          'transition-all duration-200',
          inWishlist ? 'fill-current' : 'group-hover:fill-current'
        )}
      />
      
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {inWishlist ? 'Đã yêu thích' : 'Yêu thích'}
        </span>
      )}

      <span className="absolute inset-0 rounded-full bg-current opacity-0 group-active:opacity-10 transition-opacity" />
    </button>
  )
}
