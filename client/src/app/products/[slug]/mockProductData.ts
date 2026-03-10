import type { Product } from "@/type/product";

// Mock product data for testing UI/UX with slug "test"
// Using 'as Product' to bypass strict type checking for mock data
export const MOCK_PRODUCT_DATA = {
  id: "mock-product-1",
  name: "Hạt Điều Rang Muối Cao Cấp",
  slug: "test",
  description: `
## Hạt Điều Rang Muối Cao Cấp - Thơm Ngon Đậm Đà

Hạt điều rang muối của chúng tôi được chọn lọc kỹ càng từ những vùng trồng điều nổi tiếng, đảm bảo chất lượng cao nhất. Quy trình rang muối độc quyền giúp giữ nguyên hương vị tự nhiên, thơm ngon và giòn tan.

### Đặc điểm nổi bật:
- ✅ Hạt điều size W240 - W320 hạng cao
- ✅ Rang muối vừa phải, không quá mặn
- ✅ Giòn tan, thơm béo tự nhiên
- ✅ Không chất bảo quản, không hóa chất
- ✅ Đóng gói kín, giữ độ tươi ngon

### Công dụng:
- Ăn vặt hàng ngày
- Nguyên liệu chế biến món ăn
- Quà tặng cao cấp
- Bổ sung dinh dưỡng cho gia đình

### Bảo quản:
Để nơi khô ráo, thoáng mát. Sau khi mở túi nên bảo quản trong hộp kín và sử dụng trong vòng 2 tuần để giữ độ giòn.
  `,
  thumbnailUrl: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=800&h=800&fit=crop",
  images: [
    "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1599599810769-bcde5a8f4d32?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1613919671135-1969c43c4908?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1599599810694-8c92f8c2c4c8?w=800&h=800&fit=crop",
  ],
  categoryId: "cat-1",
  category: {
    id: "cat-1",
    name: "Hạt Điều",
    slug: "hat-dieu",
  },
  supplierId: "supplier-1",
  supplier: {
    id: "supplier-1",
    name: "LắcKey - Custom Keyboard Store",
    email: "contact@lackey.vn",
    phone: "0919600801",
    address: "Số 27/8, Đường Lê Văn Việt, Phường Hiệp Phú, Thành phố Thủ Đức, TP. Hồ Chí Minh",
    description: "Chuyên cung cấp bàn phím cơ, keycap artisan và phụ kiện setup từ năm 2024",
  },
  variants: [
    {
      id: "variant-1",
      name: "Hạt Điều Rang Muối (250g)",
      sku: "HDM-250",
      price: 85000,
      discountPrice: 75000,
      stockQuantity: 100,
      weight: 250,
    },
    {
      id: "variant-2",
      name: "Hạt Điều Rang Muối (500g)",
      sku: "HDM-500",
      price: 165000,
      discountPrice: 145000,
      stockQuantity: 80,
      weight: 500,
    },
    {
      id: "variant-3",
      name: "Hạt Điều Rang Muối (1kg)",
      sku: "HDM-1000",
      price: 320000,
      discountPrice: 280000,
      stockQuantity: 50,
      weight: 1000,
    },
    {
      id: "variant-4",
      name: "Hạt Điều Rang Muối (2kg)",
      sku: "HDM-2000",
      price: 620000,
      discountPrice: 540000,
      stockQuantity: 0, // Out of stock variant
      weight: 2000,
    },
  ],
  ratingAvg: 4.8,
  ratingCount: 127,
  status: "ACTIVE",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as Product;
