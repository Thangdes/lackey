'use client'

import { useParams } from 'next/navigation'
import { Package, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCategoryList } from '@/hook/useCategory'
import { useProductList } from '@/hook/useProduct'
import ProductCard from '@/components/common/ProductCard'
import { ROUTES, buildCategoryPath } from '@/constant/route'
import type { Product } from '@/type/product'

export default function CategoryDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const { data: categories } = useCategoryList()
  const category = categories?.find(c => c.slug === slug || c.id === slug)

  const { data: productsData, isLoading: productsLoading } = useProductList(
    1,
    50,
    category?.id,
    undefined,
    undefined
  )

  const products = productsData?.data || []

  if (!category && !productsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-black mx-auto mb-6 flex items-center justify-center">
            <Package className="text-white" size={48} />
          </div>
          <h1 className="font-[family-name:var(--font-retro)] text-3xl font-bold uppercase tracking-wider text-black mb-4">
            Không tìm thấy danh mục
          </h1>
          <p className="text-neutral-600 mb-6 font-medium">
            Danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
          </p>
          <Link
            href={ROUTES.categories}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors border-2 border-black"
          >
            <ArrowLeft size={20} />
            <span>Về danh sách danh mục</span>
          </Link>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-black border-t-transparent animate-spin" />
          <p className="mt-4 text-black font-bold uppercase tracking-wider">Đang tải...</p>
        </div>
      </div>
    )
  }

  const imageUrl = category.thumbnailUrl || '/logo/logo.jpg'

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-4 border-black bg-white">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-6">
            <Link href={ROUTES.home} className="text-neutral-600 hover:text-black font-semibold uppercase tracking-wider">
              Trang chủ
            </Link>
            <span className="text-neutral-400">/</span>
            <Link href={ROUTES.categories} className="text-neutral-600 hover:text-black font-semibold uppercase tracking-wider">
              Danh mục
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-black font-bold uppercase tracking-wider">{category.name}</span>
          </nav>

          <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
            <div className="relative aspect-square overflow-hidden bg-gray-100 border-4 border-black">
              <Image
                src={imageUrl}
                alt={category.name}
                fill
                className="object-cover"
                sizes="200px"
                priority
              />
            </div>

            <div>
              <h1 className="font-[family-name:var(--font-retro)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-black mb-4">
                {category.name}
              </h1>
              
              {category.description && (
                <p className="text-lg text-neutral-700 mb-4 leading-relaxed font-medium">
                  {category.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="px-4 py-2 bg-black text-white font-bold uppercase tracking-wider text-sm">
                  {products.length} sản phẩm
                </div>
                <Link
                  href={ROUTES.categories}
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black text-black font-bold uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Danh mục khác</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
        {productsLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-black border-t-transparent animate-spin" />
            <p className="mt-4 text-black font-bold uppercase tracking-wider">Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 border-4 border-black bg-gray-50">
            <div className="w-24 h-24 bg-black mx-auto mb-6 flex items-center justify-center">
              <Package className="text-white" size={48} />
            </div>
            <h2 className="font-[family-name:var(--font-retro)] text-2xl font-bold uppercase tracking-wider text-black mb-2">
              Chưa có sản phẩm
            </h2>
            <p className="text-neutral-600 mb-6 font-medium">
              Danh mục này chưa có sản phẩm nào. Vui lòng quay lại sau.
            </p>
            <Link
              href={ROUTES.products}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors border-2 border-black"
            >
              <Package size={20} />
              <span>Xem tất cả sản phẩm</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 pb-4 border-b-2 border-black">
              <h2 className="font-[family-name:var(--font-retro)] text-2xl font-bold uppercase tracking-wider text-black">
                Sản phẩm trong danh mục
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showBadges={true}
                  showRating={true}
                  showAddToCart={true}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {categories && categories.length > 1 && (
        <div className="border-t-4 border-black bg-gray-50">
          <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
            <h2 className="font-[family-name:var(--font-retro)] text-2xl font-bold uppercase tracking-wider text-black mb-6 text-center">
              Danh mục khác
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories
                .filter(c => c.id !== category.id)
                .slice(0, 6)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={buildCategoryPath(cat.slug || cat.id)}
                    className="group block p-4 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors text-center"
                  >
                    <p className="font-bold uppercase tracking-wider text-sm line-clamp-2">
                      {cat.name}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
