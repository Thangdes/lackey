import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Danh Mục Sản Phẩm | LắcKey',
  description: 'Khám phá các danh mục bàn phím cơ, keycap, switch và phụ kiện đa dạng. Tìm món đồ yêu thích của bạn tại LắcKey.',
  keywords: [
    'danh mục bàn phím cơ',
    'categories',
    'keycap artisan',
    'switch bàn phím',
    'custom keyboard',
    'phụ kiện setup',
    'LắcKey',
    'phân loại sản phẩm',
  ],
  openGraph: {
    title: 'Danh Mục Sản Phẩm | LắcKey',
    description: 'Khám phá các danh mục bàn phím cơ, keycap, switch và phụ kiện đa dạng',
    type: 'website',
    url: 'https://lackey.vn/categories',
    images: [
      {
        url: 'https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg',
        width: 1200,
        height: 630,
        alt: 'LắcKey Categories',
      },
    ],
    siteName: 'LắcKey - Custom Keyboard & Keycap',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Danh Mục Sản Phẩm | LắcKey',
    description: 'Khám phá các danh mục bàn phím cơ đa dạng',
    images: ['https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg'],
  },
  alternates: {
    canonical: 'https://lackey.vn/categories',
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

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
