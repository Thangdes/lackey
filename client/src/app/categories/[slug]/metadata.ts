import type { Metadata } from 'next'
import { categoryService } from '@/service/category.service'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const categories = await categoryService.list()
    const category = categories.find(c => c.slug === params.slug || c.id === params.slug)

    if (!category) {
      return {
        title: 'Danh mục không tồn tại',
        description: 'Không tìm thấy danh mục này',
      }
    }

    const title = `${category.name} | Móc Khóa LắcKey`
    const description = category.description || `Khám phá bộ sưu tập ${category.name} tại LắcKey. Móc khóa chất lượng cao, thiết kế độc đáo.`
    const imageUrl = category.thumbnailUrl || 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg'

    return {
      title,
      description,
      keywords: [
        category.name,
        'móc khóa',
        'keychain',
        'LắcKey',
        'móc khóa custom',
        'phụ kiện',
        'quà tặng',
      ],
      openGraph: {
        title,
        description,
        type: 'website',
        url: `https://lackey.vn/categories/${category.slug}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: category.name,
          },
        ],
        siteName: 'LắcKey - Móc Khóa Custom',
        locale: 'vi_VN',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://lackey.vn/categories/${category.slug}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  } catch {
    return {
      title: 'Danh mục sản phẩm',
      description: 'Khám phá các danh mục sản phẩm tại LắcKey',
    }
  }
}
