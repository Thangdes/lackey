# LắcKey - Thế giới Bàn phím cơ & Custom Keyboard

Website thương mại điện tử chuyên cung cấp các sản phẩm và dịch vụ về bàn phím cơ (mechanical keyboard), keycap artisan, switch, và phụ kiện setup.

## 🎯 Về Dự Án

LắcKey là nền tảng e-commerce chuyên về:
- **Keycap Artisan**: Keycap resin/epoxy handmade độc đáo (anime, Kpop, meme)
- **Switch**: Gateron, Cherry MX, Akko và các loại switch chất lượng
- **Bàn phím Custom**: Kit barebone, bàn phím build sẵn
- **Phụ kiện**: Dây cáp coiled, kê tay, foam mod, sticker
- **Dịch vụ**: Build theo yêu cầu, mod bàn phím, keycap handmade

## 🚀 Công Nghệ Sử Dụng

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, TailwindCSS
- **Language**: TypeScript
- **State Management**: React Query
- **Styling**: Tailwind CSS + Custom Retro Theme

## 📦 Cài Đặt

```bash
# Clone repository
git clone [repository-url]

# Di chuyển vào thư mục client
cd client

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 🎨 Tính Năng Chính

### Landing Page
- **Hero Banner**: Giới thiệu sản phẩm nổi bật
- **Business Levels**: 3 cấp độ kinh doanh (Dễ bán → Trung cấp → Cao cấp)
- **Market Insights**: Phân tích thị trường và insight khách hàng
- **Services Section**: Dịch vụ build custom, keycap handmade, content creation
- **Best Sellers**: Sản phẩm bán chạy nhất
- **Top Collections**: Bộ sưu tập nổi bật
- **FAQ**: Câu hỏi thường gặp

### Sản Phẩm
- Danh sách sản phẩm với filter và search
- Chi tiết sản phẩm với variants
- Đánh giá và rating
- Wishlist

### Giỏ Hàng & Checkout
- Mini cart
- Checkout flow hoàn chỉnh
- Tích hợp thanh toán VietQR

## 📁 Cấu Trúc Thư Mục

```
client/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── home/        # Landing page components
│   │   ├── products/    # Product components
│   │   ├── cart/        # Cart components
│   │   └── ...
│   ├── constant/        # Constants và configs
│   ├── hook/            # Custom React hooks
│   ├── lib/             # Utility functions
│   └── type/            # TypeScript types
├── data/                # Mock data (products, reviews)
└── public/              # Static assets
```

## 🎨 Theme & Design

Website sử dụng **Retro/Brutalist Design** với:
- Font chữ retro đặc trưng
- Màu sắc nổi bật (#fff100 - vàng, #229090 - xanh ngọc)
- Border đậm, shadow box
- Hiệu ứng hover động

## 📝 Ghi Chú

- Dự án sử dụng mock data trong `client/data/`
- Để tích hợp backend, cần cập nhật API endpoints trong các service files
- Responsive design cho mobile, tablet, desktop

## 🔗 Liên Hệ

- **Email**: lackey6886@gmail.com
- **Phone**: 091 960 08 01
- **Facebook**: [LắcKey Facebook](https://www.facebook.com/profile.php?id=61581934494103)

## 📄 License

This project is private and proprietary.
