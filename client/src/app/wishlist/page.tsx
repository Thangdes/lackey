'use client'

import { useEffect } from 'react'
import { Trash2, Package } from 'lucide-react'
import Link from 'next/link'
import { useWishlist } from '@/hook/useWishlist'
import WishlistCard from '@/components/wishlist/WishlistCard'
import { ROUTES } from '@/constant/route'
import type { WishlistItem } from '@/type/wishlist'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { items, isLoading, totalItems, clearAll, syncWithServer } = useWishlist()

  useEffect(() => {
    syncWithServer()
  }, [syncWithServer])

  const handleAddToCart = (_item: WishlistItem) => {
    toast.info('Tính năng thêm vào giỏ hàng đang được phát triển')
  }

  const handleClearAll = async () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ danh sách yêu thích?')) {
      await clearAll()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16 mt-4">
        <div className="mb-8">
          <div className="h-4 bg-black/5 border border-black w-32 animate-pulse mb-6" />
        </div>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-4 pb-4 border-b-2 border-black">
          <div className="h-6 bg-black/10 border-2 border-black w-32 animate-pulse" />
          <div className="h-10 bg-black/5 border-2 border-black w-32 animate-pulse" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white border-2 border-black">
              <div className="aspect-square bg-black/5 animate-pulse" />
              <div className="p-3 border-t-2 border-black">
                <div className="h-4 bg-black/10 mb-2 animate-pulse" />
                <div className="h-4 bg-black/5 mb-3 w-3/4 animate-pulse" />
                <div className="h-6 bg-black/10 mb-3 w-1/2 animate-pulse" />
                <div className="h-8 bg-black/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16 mt-4">
      <div className="">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <h1 className="font-[family-name:var(--font-retro)] text-3xl md:text-4xl font-bold uppercase tracking-wider text-black">
                Sản phẩm yêu thích
              </h1>
              <p className="text-neutral-700 mt-1 font-medium">
                {totalItems} sản phẩm trong danh sách của bạn
              </p>
            </div>
          </div>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-6">
            <Link href={ROUTES.home} className="text-neutral-600 hover:text-black font-semibold uppercase tracking-wider transition-colors">
              Trang chủ
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-black font-bold uppercase tracking-wider">Yêu thích</span>
          </nav>
        </div>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-4 pb-4 border-b-2 border-black">
          <p className="text-neutral-700 font-bold uppercase tracking-wider">
            <span className="text-black text-xl">{totalItems}</span> Sản phẩm
          </p>
          {totalItems > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black text-black font-bold uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-all duration-300"
            >
              <Trash2 size={16} />
              <span>Xóa tất cả</span>
            </button>
          )}
        </div>

        {totalItems === 0 ? (
          <div className="border-4 border-black bg-white shadow-lg p-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-[family-name:var(--font-retro)] text-2xl md:text-3xl font-bold uppercase tracking-wider text-black mb-3">
                Chưa có sản phẩm yêu thích
              </h2>
              <p className="text-neutral-700 mb-8 font-medium">
                Thêm sản phẩm vào danh sách yêu thích để dễ dàng theo dõi và mua sắm sau này
              </p>
              <Link
                href={ROUTES.products}
                className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all duration-300 border-2 border-black shadow-md hover:shadow-xl"
              >
                <Package size={20} />
                <span>Khám phá sản phẩm</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {items.map((item) => (
                <WishlistCard
                  key={`${item.productId}-${item.variantId || 'default'}`}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            <div className="mt-12 p-8 border-4 border-black bg-white shadow-lg">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="font-[family-name:var(--font-retro)] text-xl md:text-2xl font-bold uppercase tracking-wider text-black mb-3">
                  Tiếp tục khám phá?
                </h3>
                <p className="text-neutral-700 mb-6 font-medium">
                  Khám phá thêm nhiều sản phẩm chất lượng và thêm vào danh sách yêu thích của bạn
                </p>
                <Link
                  href={ROUTES.products}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all duration-300 border-2 border-black shadow-md hover:shadow-xl"
                >
                  <Package size={20} />
                  <span>Xem tất cả sản phẩm</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
