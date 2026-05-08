'use client'

import { Package } from 'lucide-react'
import Link from 'next/link'
import { useCategoryList } from '@/hook/useCategory'
import CategoryCard from '@/components/categories/CategoryCard'
import { ROUTES } from '@/constant/route'
import type { Category } from '@/service/category.service'

const MOCK_CATEGORIES: (Category & { productCount?: number })[] = [
  {
    id: '1',
    name: 'Keycap Artisan',
    slug: 'keycap-artisan',
    description: 'Keycap resin/epoxy handmade độc đáo với theme anime, Kpop, game',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
    productCount: 156,
  },
  {
    id: '2',
    name: 'Switch',
    slug: 'switch',
    description: 'Switch bàn phím: Gateron, Cherry MX, Akko và các loại switch chất lượng',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    productCount: 89,
  },
  {
    id: '3',
    name: 'Bàn Phím Custom',
    slug: 'custom-keyboard',
    description: 'Kit barebone, bàn phím build sẵn và dịch vụ custom theo yêu cầu',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    productCount: 124,
  },
  {
    id: '4',
    name: 'Phụ Kiện',
    slug: 'accessories',
    description: 'Dây cáp coiled, kê tay, foam mod, sticker và phụ kiện setup',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=800',
    productCount: 98,
  },
  {
    id: '5',
    name: 'Dịch Vụ',
    slug: 'services',
    description: 'Build theo yêu cầu, mod bàn phím, lube switch chuyên nghiệp',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    productCount: 45,
  },
]

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategoryList()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1">
              <div className="h-10 bg-black/10 w-64 mb-2 animate-pulse" />
              <div className="h-4 bg-black/5 w-48 animate-pulse" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white border-2 border-black animate-pulse">
                <div className="aspect-square bg-black/5" />
                <div className="p-4 border-t-2 border-black">
                  <div className="h-6 bg-black/10 mb-2" />
                  <div className="h-4 bg-black/5 mb-2" />
                  <div className="h-4 bg-black/5 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const categoryList = (categories && categories.length > 0 ? categories : MOCK_CATEGORIES) as (Category & { productCount?: number })[]

  return (
    <div className="min-h-screen bg-white px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h1 className="font-[family-name:var(--font-retro)] text-3xl md:text-4xl font-bold uppercase tracking-wider text-black">
                Danh Mục Sản Phẩm
              </h1>
              <p className="text-neutral-700 mt-1 font-medium">
                Khám phá {categoryList.length} danh mục bàn phím cơ và phụ kiện đa dạng
              </p>
            </div>
          </div>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link href={ROUTES.home} className="text-neutral-600 hover:text-black font-semibold uppercase tracking-wider transition-colors">
              Trang chủ
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-black font-bold uppercase tracking-wider">Danh mục</span>
          </nav>
        </div>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-4 pb-4 border-b-2 border-black">
          <p className="text-neutral-700 font-bold uppercase tracking-wider">
            <span className="text-black text-xl">{categoryList.length}</span> Danh mục
          </p>
          <Link
            href={ROUTES.products}
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black text-black font-bold uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-all duration-300"
          >
            <Package size={16} />
            <span>Tất cả sản phẩm</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {categoryList.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>

        <div className="mt-12 p-8 border-4 border-black bg-white shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-[family-name:var(--font-retro)] text-xl md:text-2xl font-bold uppercase tracking-wider text-black mb-3">
              Không tìm thấy danh mục bạn cần?
            </h3>
            <p className="text-neutral-700 mb-6 font-medium">
              Liên hệ với chúng tôi để được tư vấn và hỗ trợ tìm kiếm sản phẩm phù hợp nhất
            </p>
            <Link
              href={ROUTES.contact}
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all duration-300 border-2 border-black shadow-md hover:shadow-xl"
            >
              <span>Liên hệ ngay</span>
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
