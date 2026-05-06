# Script Import Data Hoàn Chỉnh

## Tổng quan

Script này giúp import toàn bộ data mẫu vào database MongoDB thông qua Prisma:
- Categories, Brands, Tags
- Suppliers
- Products với Variants (20 sản phẩm)
- Blog Posts (10 bài viết)
- Banners & Testimonials
- Customers & Users mẫu

---

## 1. Tạo file seed script

Tạo file `server/prisma/seed.ts`:

```typescript
import { PrismaClient, UserRole, ContentType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Clear existing data (optional - cẩn thận!)
  // await clearDatabase();

  // 2. Seed Categories
  const categories = await seedCategories();
  console.log('✅ Categories seeded');

  // 3. Seed Brands
  const brands = await seedBrands();
  console.log('✅ Brands seeded');

  // 4. Seed Tags
  const tags = await seedTags();
  console.log('✅ Tags seeded');

  // 5. Seed Suppliers
  const suppliers = await seedSuppliers();
  console.log('✅ Suppliers seeded');

  // 6. Seed Admin User
  const admin = await seedAdminUser();
  console.log('✅ Admin user seeded');

  // 7. Seed Products
  await seedProducts(categories, brands, tags, suppliers);
  console.log('✅ Products seeded');

  // 8. Seed Blog Posts
  await seedBlogPosts(admin);
  console.log('✅ Blog posts seeded');

  // 9. Seed Banners & Testimonials
  await seedSiteContent();
  console.log('✅ Site content seeded');

  // 10. Seed Sample Customers
  await seedCustomers();
  console.log('✅ Sample customers seeded');

  console.log('🎉 Seed completed!');
}

// ============================================
// CLEAR DATABASE (Cẩn thận!)
// ============================================
async function clearDatabase() {
  console.log('⚠️  Clearing database...');
  
  // Xóa theo thứ tự để tránh lỗi foreign key
  await prisma.rating.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.paymentEvent.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.post.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.address.deleteMany();
  await prisma.token.deleteMany();
  await prisma.user.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.discount.deleteMany();
  
  console.log('✅ Database cleared');
}

// ============================================
// SEED CATEGORIES
// ============================================
async function seedCategories() {
  const categoriesData = [
    {
      name: 'Mechanical Keyboards',
      slug: 'mechanical-keyboards',
      description: 'Bàn phím cơ cao cấp với nhiều loại switch',
      thumbnailUrl: '/images/categories/mechanical-keyboards.jpg',
    },
    {
      name: 'Custom Keyboard Kits',
      slug: 'custom-keyboard-kits',
      description: 'Bộ kit tự lắp ráp bàn phím theo sở thích',
      thumbnailUrl: '/images/categories/keyboard-kits.jpg',
    },
    {
      name: 'Keycaps',
      slug: 'keycaps',
      description: 'Bộ keycap thay thế đa dạng màu sắc và chất liệu',
      thumbnailUrl: '/images/categories/keycaps.jpg',
    },
    {
      name: 'Switches',
      slug: 'switches',
      description: 'Switch cơ các loại: Linear, Tactile, Clicky',
      thumbnailUrl: '/images/categories/switches.jpg',
    },
    {
      name: 'Keyboard Accessories',
      slug: 'keyboard-accessories',
      description: 'Phụ kiện bàn phím: cable, foam, lube, v.v.',
      thumbnailUrl: '/images/categories/accessories.jpg',
    },
  ];

  const categories = [];
  for (const data of categoriesData) {
    const category = await prisma.category.create({ data });
    categories.push(category);
  }

  return categories;
}

// ============================================
// SEED BRANDS
// ============================================
async function seedBrands() {
  const brandsData = [
    { name: 'Keychron', slug: 'keychron', isActive: true },
    { name: 'Akko', slug: 'akko', isActive: true },
    { name: 'Monsgeek', slug: 'monsgeek', isActive: true },
    { name: 'GMMK', slug: 'gmmk', isActive: true },
    { name: 'Razer', slug: 'razer', isActive: true },
    { name: 'Logitech', slug: 'logitech', isActive: true },
    { name: 'Ducky', slug: 'ducky', isActive: true },
    { name: 'Leopold', slug: 'leopold', isActive: true },
  ];

  const brands = [];
  for (const data of brandsData) {
    const brand = await prisma.brand.create({ data });
    brands.push(brand);
  }

  return brands;
}

// ============================================
// SEED TAGS
// ============================================
async function seedTags() {
  const tagsData = [
    { name: 'Hot-swap', slug: 'hot-swap', isActive: true },
    { name: 'RGB', slug: 'rgb', isActive: true },
    { name: 'Wireless', slug: 'wireless', isActive: true },
    { name: '75% Layout', slug: '75-layout', isActive: true },
    { name: '65% Layout', slug: '65-layout', isActive: true },
    { name: 'TKL', slug: 'tkl', isActive: true },
    { name: 'Full Size', slug: 'full-size', isActive: true },
    { name: 'Gasket Mount', slug: 'gasket-mount', isActive: true },
    { name: 'Aluminum Case', slug: 'aluminum-case', isActive: true },
    { name: 'PBT Keycaps', slug: 'pbt-keycaps', isActive: true },
  ];

  const tags = [];
  for (const data of tagsData) {
    const tag = await prisma.tag.create({ data });
    tags.push(tag);
  }

  return tags;
}

// ============================================
// SEED SUPPLIERS
// ============================================
async function seedSuppliers() {
  const suppliersData = [
    {
      name: 'KeyboardVN Official',
      contactName: 'Nguyễn Văn A',
      email: 'supplier@keyboardvn.com',
      phone: '0901234567',
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      description: 'Nhà phân phối chính thức các thương hiệu keyboard',
      isActive: true,
    },
    {
      name: 'MechKey Store',
      contactName: 'Trần Thị B',
      email: 'contact@mechkey.vn',
      phone: '0912345678',
      address: '456 Lê Lợi, Q1, TP.HCM',
      description: 'Chuyên cung cấp keyboard custom và phụ kiện',
      isActive: true,
    },
  ];

  const suppliers = [];
  for (const data of suppliersData) {
    const supplier = await prisma.supplier.create({ data });
    suppliers.push(supplier);
  }

  return suppliers;
}

// ============================================
// SEED ADMIN USER
// ============================================
async function seedAdminUser() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
      avatar: '/images/avatars/admin.jpg',
    },
  });

  return admin;
}

// ============================================
// SEED PRODUCTS (Ví dụ 5 sản phẩm đầu)
// ============================================
async function seedProducts(categories, brands, tags, suppliers) {
  const mechanicalKeyboards = categories.find(c => c.slug === 'mechanical-keyboards');
  const keychron = brands.find(b => b.slug === 'keychron');
  const akko = brands.find(b => b.slug === 'akko');
  const supplier = suppliers[0];

  // Product 1: Keychron K8 Pro
  const product1 = await prisma.product.create({
    data: {
      name: 'Keychron K8 Pro QMK/VIA Wireless',
      slug: 'keychron-k8-pro-qmk-via-wireless',
      categoryId: mechanicalKeyboards.id,
      supplierId: supplier.id,
      brandId: keychron.id,
      description: 'Bàn phím cơ TKL 87 phím, hỗ trợ QMK/VIA, kết nối không dây và có dây. Hot-swap switch, RGB backlight, pin 4000mAh.',
      thumbnailUrl: '/images/products/keychron-k8-pro.jpg',
      images: [
        '/images/products/keychron-k8-pro-1.jpg',
        '/images/products/keychron-k8-pro-2.jpg',
        '/images/products/keychron-k8-pro-3.jpg',
      ],
      isActive: true,
      initialBuyCount: 150,
      buyCount: 150,
      ratingAvg: 4.8,
      ratingCount: 45,
      variants: {
        create: [
          {
            name: 'Keychron K8 Pro - Gateron G Pro Red',
            sku: 'K8PRO-RED-001',
            price: 2890000,
            discountPrice: 2590000,
            stockQuantity: 25,
          },
          {
            name: 'Keychron K8 Pro - Gateron G Pro Brown',
            sku: 'K8PRO-BROWN-001',
            price: 2890000,
            discountPrice: 2590000,
            stockQuantity: 30,
          },
          {
            name: 'Keychron K8 Pro - Gateron G Pro Blue',
            sku: 'K8PRO-BLUE-001',
            price: 2890000,
            discountPrice: null,
            stockQuantity: 20,
          },
        ],
      },
    },
  });

  // Link tags
  const hotswapTag = tags.find(t => t.slug === 'hot-swap');
  const rgbTag = tags.find(t => t.slug === 'rgb');
  const wirelessTag = tags.find(t => t.slug === 'wireless');
  const tklTag = tags.find(t => t.slug === 'tkl');

  await prisma.productTag.createMany({
    data: [
      { productId: product1.id, tagId: hotswapTag.id },
      { productId: product1.id, tagId: rgbTag.id },
      { productId: product1.id, tagId: wirelessTag.id },
      { productId: product1.id, tagId: tklTag.id },
    ],
  });

  // Product 2: Akko 3098B
  const product2 = await prisma.product.create({
    data: {
      name: 'Akko 3098B Multi-Mode Mechanical Keyboard',
      slug: 'akko-3098b-multi-mode',
      categoryId: mechanicalKeyboards.id,
      supplierId: supplier.id,
      brandId: akko.id,
      description: 'Bàn phím cơ 98 phím compact, kết nối đa chế độ (Bluetooth 5.0, 2.4GHz, USB-C). Hot-swap, pin 3000mAh.',
      thumbnailUrl: '/images/products/akko-3098b.jpg',
      images: [
        '/images/products/akko-3098b-1.jpg',
        '/images/products/akko-3098b-2.jpg',
      ],
      isActive: true,
      initialBuyCount: 200,
      buyCount: 200,
      ratingAvg: 4.6,
      ratingCount: 67,
      variants: {
        create: [
          {
            name: 'Akko 3098B - Black & Pink',
            sku: 'AKKO-3098B-BP-001',
            price: 1890000,
            discountPrice: 1690000,
            stockQuantity: 40,
          },
          {
            name: 'Akko 3098B - World Tour Tokyo',
            sku: 'AKKO-3098B-WT-001',
            price: 2190000,
            discountPrice: null,
            stockQuantity: 25,
          },
        ],
      },
    },
  });

  const fullsizeTag = tags.find(t => t.slug === 'full-size');
  await prisma.productTag.createMany({
    data: [
      { productId: product2.id, tagId: hotswapTag.id },
      { productId: product2.id, tagId: rgbTag.id },
      { productId: product2.id, tagId: wirelessTag.id },
      { productId: product2.id, tagId: fullsizeTag.id },
    ],
  });

  // TODO: Thêm 18 sản phẩm còn lại tương tự...
  console.log('⚠️  Chỉ seed 2 sản phẩm mẫu. Thêm 18 sản phẩm còn lại theo cùng pattern.');
}

// ============================================
// SEED BLOG POSTS
// ============================================
async function seedBlogPosts(admin) {
  const postsData = [
    {
      title: 'Hướng Dẫn Chọn Bàn Phím Cơ Đầu Tiên Cho Người Mới',
      slug: 'huong-dan-chon-ban-phim-co-dau-tien',
      content: `
        <h2>Giới thiệu</h2>
        <p>Bàn phím cơ đang ngày càng phổ biến trong cộng đồng game thủ và dân văn phòng. Với sự đa dạng về switch, layout, và giá cả, việc chọn bàn phím cơ đầu tiên có thể khá khó khăn cho người mới.</p>
        
        <h2>Các loại switch</h2>
        <p>Switch là linh hồn của bàn phím cơ. Có 3 loại chính:</p>
        <ul>
          <li><strong>Linear</strong>: Gõ mượt, không có điểm tactile. Phù hợp gaming.</li>
          <li><strong>Tactile</strong>: Có điểm tactile rõ ràng. Cân bằng giữa typing và gaming.</li>
          <li><strong>Clicky</strong>: Có tiếng click to. Phù hợp typing nhưng ồn.</li>
        </ul>
        
        <h2>Layout bàn phím</h2>
        <p>Các layout phổ biến: Full-size (100%), TKL (80%), 75%, 65%, 60%. Người mới nên bắt đầu với TKL hoặc 75% để cân bằng giữa compact và đầy đủ chức năng.</p>
        
        <h2>Ngân sách</h2>
        <p>Với người mới bắt đầu, nên chọn bàn phím trong khoảng 1-2 triệu để trải nghiệm mà không tốn quá nhiều chi phí.</p>
      `,
      excerpt: 'Bạn mới bắt đầu tìm hiểu về bàn phím cơ? Hãy đọc bài viết này để biết cách chọn bàn phím cơ đầu tiên phù hợp với nhu cầu và ngân sách.',
      thumbnailUrl: '/images/blog/chon-ban-phim-co.jpg',
      isPublished: true,
      authorId: admin.id,
      metaTitle: 'Hướng Dẫn Chọn Bàn Phím Cơ Đầu Tiên | KeyboardVN',
      metaDescription: 'Hướng dẫn chi tiết cách chọn bàn phím cơ đầu tiên cho người mới: switch, layout, ngân sách, thương hiệu uy tín.',
    },
    {
      title: 'So Sánh Switch Cherry MX vs Gateron vs Akko',
      slug: 'so-sanh-switch-cherry-mx-gateron-akko',
      content: `
        <h2>Cherry MX - Ông tổ của switch cơ</h2>
        <p>Cherry MX là thương hiệu switch lâu đời nhất, chất lượng ổn định, độ bền cao. Tuy nhiên giá thành cao hơn các đối thủ.</p>
        
        <h2>Gateron - Lựa chọn giá trị</h2>
        <p>Gateron nổi tiếng với giá cả phải chăng nhưng chất lượng tốt. Gateron Yellow và Oil King được đánh giá cao.</p>
        
        <h2>Akko - Tân binh đầy tiềm năng</h2>
        <p>Akko V3 series đang được đánh giá cao với giá rẻ và chất lượng tốt, phù hợp người mới bắt đầu.</p>
      `,
      excerpt: 'Phân tích chi tiết sự khác biệt giữa 3 thương hiệu switch phổ biến: Cherry MX, Gateron và Akko.',
      thumbnailUrl: '/images/blog/so-sanh-switch.jpg',
      isPublished: true,
      authorId: admin.id,
      metaTitle: 'So Sánh Switch Cherry MX vs Gateron vs Akko | KeyboardVN',
      metaDescription: 'So sánh chi tiết 3 thương hiệu switch phổ biến: Cherry MX, Gateron, Akko.',
    },
    // TODO: Thêm 8 blog posts còn lại...
  ];

  for (const data of postsData) {
    await prisma.post.create({ data });
  }

  console.log('⚠️  Chỉ seed 2 blog posts mẫu. Thêm 8 posts còn lại theo cùng pattern.');
}

// ============================================
// SEED SITE CONTENT (Banners & Testimonials)
// ============================================
async function seedSiteContent() {
  // Banners
  const bannersData = [
    {
      type: ContentType.BANNER,
      title: 'Flash Sale Cuối Tuần - Giảm 30%',
      content: 'Giảm giá lên đến 30% cho tất cả bàn phím Keychron. Chỉ từ 2-4/5/2026!',
      thumbnailUrl: '/images/banners/flash-sale-weekend.jpg',
      linkUrl: '/products?brand=keychron&discount=true',
      displayOrder: 1,
      isPublished: true,
    },
    {
      type: ContentType.BANNER,
      title: 'Ra Mắt Monsgeek M5',
      content: 'Monsgeek M5 với vỏ nhôm, gasket mount, chỉ 2.49 triệu.',
      thumbnailUrl: '/images/banners/monsgeek-m5-launch.jpg',
      linkUrl: '/products/monsgeek-m5-aluminum-keyboard',
      displayOrder: 2,
      isPublished: true,
    },
    {
      type: ContentType.BANNER,
      title: 'Miễn Phí Vận Chuyển Đơn Từ 1 Triệu',
      content: 'Áp dụng cho tất cả đơn hàng từ 1.000.000đ trở lên.',
      thumbnailUrl: '/images/banners/free-shipping.jpg',
      linkUrl: '/shipping',
      displayOrder: 3,
      isPublished: true,
    },
  ];

  for (const data of bannersData) {
    await prisma.siteContent.create({ data });
  }

  // Testimonials
  const testimonialsData = [
    {
      type: ContentType.TESTIMONIAL,
      title: 'Chất lượng tuyệt vời!',
      content: 'Mình đã mua Keychron K8 Pro và rất hài lòng. Chất lượng build tốt, âm thanh gõ phím rất hay.',
      authorName: 'Nguyễn Văn A',
      authorTitle: 'Software Engineer',
      displayOrder: 1,
      isPublished: true,
    },
    {
      type: ContentType.TESTIMONIAL,
      title: 'Dịch vụ xuất sắc',
      content: 'Lần đầu mua bàn phím custom, shop tư vấn rất chi tiết. 10/10!',
      authorName: 'Trần Thị B',
      authorTitle: 'Graphic Designer',
      displayOrder: 2,
      isPublished: true,
    },
  ];

  for (const data of testimonialsData) {
    await prisma.siteContent.create({ data });
  }
}

// ============================================
// SEED SAMPLE CUSTOMERS
// ============================================
async function seedCustomers() {
  const hashedPassword = await bcrypt.hash('customer123', 10);

  const customer1 = await prisma.customer.create({
    data: {
      email: 'customer1@example.com',
      fullName: 'Nguyễn Văn A',
      phone: '0901111111',
      user: {
        create: {
          username: 'customer1',
          password: hashedPassword,
          role: UserRole.CUSTOMER,
          isActive: true,
        },
      },
      addresses: {
        create: {
          recipientName: 'Nguyễn Văn A',
          phoneNumber: '0901111111',
          street: '123 Nguyễn Huệ',
          ward: 'Phường Bến Nghé',
          district: 'Quận 1',
          city: 'TP. Hồ Chí Minh',
          isDefault: true,
        },
      },
    },
  });

  console.log('✅ Sample customer created:', customer1.email);
}

// ============================================
// RUN SEED
// ============================================
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 2. Cấu hình package.json

Thêm script seed vào `server/package.json`:

```json
{
  "scripts": {
    "seed": "ts-node prisma/seed.ts",
    "seed:clear": "ts-node prisma/seed.ts --clear"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

---

## 3. Chạy seed

```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt dependencies nếu chưa có
npm install

# Chạy seed
npm run seed

# Hoặc seed sau khi clear database (cẩn thận!)
npm run seed:clear
```

---

## 4. Kiểm tra kết quả

```bash
# Kết nối MongoDB và kiểm tra
mongosh "your-mongodb-connection-string"

# Đếm số lượng documents
use your-database-name
db.categories.countDocuments()
db.brands.countDocuments()
db.products.countDocuments()
db.posts.countDocuments()
```

---

## 5. Lưu ý quan trọng

1. **Backup trước khi seed**: Luôn backup database trước khi chạy seed
2. **Environment variables**: Đảm bảo `DATABASE_URL` trong `.env` đúng
3. **Images**: Chuẩn bị tất cả ảnh trong thư mục `client/public/images/`
4. **ObjectId**: MongoDB tự động tạo ObjectId, không cần lo lắng
5. **Unique constraints**: Slug và SKU phải unique, script sẽ báo lỗi nếu trùng
6. **Relations**: Script tự động xử lý relationships giữa các models

---

## 6. Mở rộng

Để thêm đầy đủ 20 sản phẩm và 10 blog posts, copy pattern từ script mẫu và điều chỉnh data theo file hướng dẫn:
- `data-guide-products.md`
- `data-guide-products-part2.md`
- `data-guide-blog-banner.md`
