# LắcKey - Thế giới Bàn phím cơ & Custom Keyboard (Fullstack E-Commerce)

LắcKey là nền tảng e-commerce chuyên biệt cung cấp các sản phẩm và dịch vụ về bàn phím cơ (mechanical keyboard), keycap artisan, switch, phụ kiện setup và dịch vụ build phím custom. Dự án bao gồm hệ thống Frontend (Next.js) cho trải nghiệm người dùng tối ưu và Backend (NestJS) mạnh mẽ xử lý nghiệp vụ, quản lý đơn hàng.

## 🌟 Tính Năng Nổi Bật

- **Mặt Hàng Chuyên Biệt**: Bán các sản phẩm đặc thù như artisan keycaps (resin/epoxy), switch các loại, kit phím cơ, phụ kiện custom.
- **Quản lý Đơn Hàng & Giỏ Hàng**: Xử lý luồng đặt hàng hoàn chỉnh từ thêm vào giỏ, nhập thông tin giao hàng, cho tới thanh toán.
- **Thanh Toán**: Tích hợp thanh toán quét mã QR (VietQR) và thanh toán khi nhận hàng (COD).
- **Hệ thống Quản Trị (Admin/CMS)**: Quản lý sản phẩm, tồn kho, đơn hàng, người dùng, voucher giảm giá (Discount) và nội dung trên trang (Posts, CmsPages).
- **UI/UX Độc Đáo**: Giao diện mang phong cách Retro/Brutalist với hiệu ứng animation bắt mắt, phù hợp với cộng đồng chơi phím cơ.

## 🚀 Công Nghệ Sử Dụng

Dự án được xây dựng theo kiến trúc Client-Server với các công nghệ hiện đại nhất:

### Frontend (`/client`)
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19, TailwindCSS v4, Radix UI
- **State Management & Data Fetching**: Zustand, TanStack Query (React Query) v5
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS + Custom Retro Theme

### Backend (`/server`)
- **Framework**: NestJS v10
- **Cơ Sở Dữ Liệu**: MongoDB
- **ORM**: Prisma
- **Queue/Background Jobs**: BullMQ & Redis
- **Authentication**: JWT & Passport
- **Tiện ích khác**: Nodemailer (Gửi email báo cáo/hóa đơn), Cloudinary (Lưu trữ hình ảnh), PDFKit (Tạo file PDF hóa đơn).

## 📁 Cấu Trúc Dự Án

```text
lackey/
├── client/          # Ứng dụng Frontend (Next.js 15)
├── server/          # Ứng dụng Backend API (NestJS 10)
├── data/            # Mock data / Cấu hình dùng chung
├── docs/            # Tài liệu dự án (Architecture, DB Diagram)
├── provision/       # Scripts và configs triển khai (Docker, Nginx...)
└── report-research/ # Báo cáo và tài liệu nghiên cứu
```

## 📦 Hướng Dẫn Cài Đặt và Khởi Chạy

### Yêu Cầu Hệ Thống
- [Node.js](https://nodejs.org/) (Khuyến nghị v20+)
- [MongoDB](https://www.mongodb.com/) (Hoặc sử dụng MongoDB Atlas)
- [Redis](https://redis.io/) (Dành cho BullMQ background jobs)

### 1. Cài đặt Backend (Server)

```bash
cd server
npm install # hoặc yarn install

# Tạo file .env dựa trên template có sẵn (cần cấu hình DATABASE_URL trỏ tới MongoDB)
# cp .env.example .env

# Đẩy schema lên database và tạo dữ liệu mẫu
npx prisma db push
npm run prisma:seed

# Khởi chạy server ở chế độ development
npm run start:dev
```
Server backend mặc định sẽ chạy ở port đã config (thường là 8080 hoặc 3001).

### 2. Cài đặt Frontend (Client)

```bash
cd client
npm install # hoặc yarn install

# Khởi chạy client ở chế độ dev
npm run dev
```
Giao diện frontend mặc định sẽ chạy tại: `http://localhost:3000`. Bạn có thể mở trình duyệt để trải nghiệm website.

## 🤝 Tham Gia Phát Triển & Liên Hệ

- **Email**: lackey6886@gmail.com
- **Số Điện Thoại**: 091 960 08 01
- **Fanpage Facebook**: [LắcKey Facebook](https://www.facebook.com/profile.php?id=61581934494103)

## 📄 License
Dự án được bảo lưu mọi bản quyền (Private and proprietary).
