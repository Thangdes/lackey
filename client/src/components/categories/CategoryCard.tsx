'use client'

import Link from 'next/link'
import Image from 'next/image'
import { buildCategoryPath } from '@/constant/route'
import type { Category } from '@/service/category.service'
import { Package } from 'lucide-react'

export type CategoryCardProps = {
  category: Category & { productCount?: number }
  className?: string
}

export default function CategoryCard({ category, className = '' }: CategoryCardProps) {
  const imageUrl = category.thumbnailUrl || '/logo/logo.jpg'
  const href = buildCategoryPath(category.slug || category.id)

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden bg-white border-2 border-black hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {category.productCount !== undefined && category.productCount > 0 && (
          <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 text-xs font-bold flex items-center gap-1.5">
            <Package size={14} />
            <span>{category.productCount} SP</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t-2 border-black bg-white">
        <h3 className="font-[family-name:var(--font-retro)] text-lg font-bold uppercase tracking-wider text-black line-clamp-2 min-h-[3.5rem] mb-2">
          {category.name}
        </h3>
        
        {category.description && (
          <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
            {category.description}
          </p>
        )}
        
        <div className="inline-flex items-center text-sm font-bold text-black uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
          <span>Xem ngay</span>
          <span className="ml-2 text-lg">→</span>
        </div>
      </div>
    </Link>
  )
}
