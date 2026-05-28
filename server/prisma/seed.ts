import {
  PrismaClient,
  UserRole,
  PaymentMethod,
  PaymentStatus,
  OrderStatus,
  ContentType,
  DiscountType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const randomCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const slug = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

async function main() {
  console.log('🚀 Start seeding keyboard store data...');

  const allowDestructive =
    String(process.env.ALLOW_DESTRUCTIVE_SEED).toLowerCase() === 'true';
  if (allowDestructive) {
    console.log('⚠️  Destructive mode: deleting all existing data...');
    await prisma.rating.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.paymentEvent.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.address.deleteMany();
    await prisma.token.deleteMany();
    await prisma.productTag.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.category.deleteMany();
    await prisma.siteContent.deleteMany();
    await prisma.discount.deleteMany();
    await prisma.cmsPage.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.supplier.deleteMany();
    console.log('✅ Old data deleted.');
  } else {
    console.log('ℹ️  Skipping destructive delete (ALLOW_DESTRUCTIVE_SEED!=true).');
  }

  // ─────────────────────────────────────────────────────────────────────
  // CMS Pages
  // ─────────────────────────────────────────────────────────────────────
  await prisma.cmsPage.createMany({
    data: [
      {
        title: 'Về Chúng Tôi',
        slug: 'about-us',
        isPublished: true,
        contentHtml: `<h2>Lackey – Thiên đường bàn phím cơ Việt Nam</h2>
<p>Lackey là cửa hàng chuyên cung cấp bàn phím cơ, keycap, switch và phụ kiện chơi phím hàng đầu tại Việt Nam. Chúng tôi tin tưởng rằng mỗi người dùng xứng đáng có một bàn phím hoàn hảo – từ gaming đến văn phòng, từ người mới bắt đầu đến enthusiast lâu năm.</p>
<p>Với kinh nghiệm hơn 5 năm trong lĩnh vực custom keyboard, đội ngũ Lackey luôn lựa chọn kỹ càng từng sản phẩm trước khi đưa vào kho hàng.</p>`,
      },
      {
        title: 'Chính Sách Đổi Trả',
        slug: 'return-policy',
        isPublished: true,
        contentHtml: `<h2>Chính Sách Đổi Trả</h2>
<p>Lackey chấp nhận đổi trả trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên vẹn, chưa qua sử dụng.</p>
<ul>
  <li>Lỗi từ nhà sản xuất: đổi mới 100% miễn phí</li>
  <li>Thay đổi ý kiến: đổi sang sản phẩm khác, hoàn tiền phần chênh lệch</li>
</ul>`,
      },
      {
        title: 'Hướng Dẫn Chọn Switch',
        slug: 'switch-guide',
        isPublished: true,
        contentHtml: `<h2>Switch là gì?</h2>
<p>Switch (công tắc) là linh kiện quan trọng nhất của bàn phím cơ, quyết định cảm giác gõ, độ ồn và lực bấm.</p>
<h3>Phân loại switch</h3>
<ul>
  <li><strong>Linear:</strong> Bấm trơn, không có điểm dừng. Phù hợp gaming.</li>
  <li><strong>Tactile:</strong> Có điểm bump nhẹ khi kích hoạt. Phù hợp typing.</li>
  <li><strong>Clicky:</strong> Có tiếng click to, phản hồi rõ ràng. Phù hợp enthusiast.</li>
</ul>`,
      },
    ],
  });
  console.log('✅ CMS Pages created.');

  // ─────────────────────────────────────────────────────────────────────
  // Admin
  // ─────────────────────────────────────────────────────────────────────
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPasswordRaw = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@lackey.vn';
  const adminPassword = await bcrypt.hash(adminPasswordRaw, 10);
  const existingAdmin = await prisma.user.findFirst({ where: { username: adminUsername } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        username: adminUsername,
        password: adminPassword,
        role: UserRole.ADMIN,
        customer: {
          create: { email: adminEmail, fullName: 'Admin Lackey' },
        },
      },
    });
  }
  console.log('✅ Admin created.');

  // ─────────────────────────────────────────────────────────────────────
  // Suppliers
  // ─────────────────────────────────────────────────────────────────────
  const supplierPassword = await bcrypt.hash(
    process.env.SUPPLIER_PASSWORD || 'Supplier@123',
    10,
  );

  const suppliersData = [
    {
      name: 'Akko',
      email: 'supplier@akko.vn',
      phone: '0901234001',
      address: '50 Cầu Giấy, Hà Nội',
      description: 'Thương hiệu bàn phím cơ và keycap hàng đầu đến từ Trung Quốc, nổi tiếng với thiết kế anime colorway độc đáo và giá thành hợp lý.',
      username: 'supplier.akko',
    },
    {
      name: 'Aula',
      email: 'supplier@aula.vn',
      phone: '0901234002',
      address: '12 Lê Lai, Quận 1, TP.HCM',
      description: 'Thương hiệu gaming gear đến từ Trung Quốc, chuyên cung cấp bàn phím cơ gaming với switch gasket mount và thiết kế RGB bắt mắt.',
      username: 'supplier.aula',
    },
    {
      name: 'Keychron',
      email: 'supplier@keychron.vn',
      phone: '0901234003',
      address: '8 Nguyễn Huệ, Quận 1, TP.HCM',
      description: 'Thương hiệu bàn phím cơ wireless cao cấp đến từ Hong Kong, nổi tiếng với các dòng Q-Series và V-Series gasket mount chất lượng cao.',
      username: 'supplier.keychron',
    },
    {
      name: 'Lackey Store',
      email: 'supplier@lackey.vn',
      phone: '0901234004',
      address: '99 Trần Duy Hưng, Hà Nội',
      description: 'Nhà cung cấp nội bộ của Lackey, chuyên nhập khẩu và phân phối keycap, switch, lube và phụ kiện từ các thương hiệu uy tín.',
      username: 'supplier.lackey',
    },
    {
      name: 'Gateron',
      email: 'supplier@gateron.vn',
      phone: '0901234005',
      address: '23 Bạch Đằng, Đà Nẵng',
      description: 'Nhà sản xuất switch cơ học hàng đầu thế giới từ Trung Quốc, cung cấp switch từ entry-level đến cao cấp cho cộng đồng custom keyboard.',
      username: 'supplier.gateron',
    },
  ];

  const suppliers: Record<string, { id: string }> = {};
  for (const s of suppliersData) {
    const { username, ...data } = s;
    const sup = await prisma.supplier.upsert({
      where: { name: data.name },
      update: {},
      create: { ...data, isActive: true },
    });
    suppliers[s.name] = sup;
    const existingSupplierUser = await prisma.user.findFirst({ where: { username } });
    if (!existingSupplierUser) {
      // Create a linked customer to avoid null customerId unique constraint on MongoDB
      const supplierCustomer = await prisma.customer.create({
        data: {
          email: data.email,
          fullName: data.name,
          phone: data.phone,
        },
      });
      await prisma.user.create({
        data: {
          username,
          password: supplierPassword,
          role: UserRole.SUPPLIER,
          customer: { connect: { id: supplierCustomer.id } },
          supplier: { connect: { id: sup.id } },
        },
      });
    }
  }
  console.log('✅ Suppliers and supplier users created.');

  // ─────────────────────────────────────────────────────────────────────
  // Brands
  // ─────────────────────────────────────────────────────────────────────
  const brandsData = [
    { name: 'Akko', slug: 'akko' },
    { name: 'Aula', slug: 'aula' },
    { name: 'Keychron', slug: 'keychron' },
    { name: 'Gateron', slug: 'gateron' },
    { name: 'Durock', slug: 'durock' },
    { name: 'GMK', slug: 'gmk' },
    { name: 'ePBT', slug: 'epbt' },
    { name: 'KBDfans', slug: 'kbdfans' },
  ];
  const brands: Record<string, { id: string }> = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: { ...b, isActive: true },
    });
    brands[b.name] = brand;
  }
  console.log('✅ Brands created.');

  // ─────────────────────────────────────────────────────────────────────
  // Categories
  // ─────────────────────────────────────────────────────────────────────
  const categoriesData = [
    {
      name: 'Bàn Phím Cơ',
      slug: 'ban-phim-co',
      description: 'Bàn phím cơ (mechanical keyboard) với switch cơ học, đa dạng layout từ 60% đến fullsize. Cảm giác gõ vượt trội, độ bền cao.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=400&fit=crop',
    },
    {
      name: 'Keycap',
      slug: 'keycap',
      description: 'Keycap thay thế cho bàn phím cơ. Đa dạng chất liệu PBT, ABS với nhiều colorway độc đáo từ anime đến retro.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
    },
    {
      name: 'Switch',
      slug: 'switch',
      description: 'Switch cơ học – linh hồn của bàn phím cơ. Phân loại linear, tactile, clicky với lực bấm và âm thanh đa dạng.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=600&h=400&fit=crop',
    },
    {
      name: 'Lube & Phụ Kiện',
      slug: 'lube-phu-kien',
      description: 'Lube switch, foam dampening, stabilizer, puller và các phụ kiện mod bàn phím chuyên nghiệp.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1629429409892-5a0c04b8d0a3?w=600&h=400&fit=crop',
    },
    {
      name: 'Bàn Phím Gaming',
      slug: 'ban-phim-gaming',
      description: 'Bàn phím gaming RGB, anti-ghosting, polling rate cao, thiết kế tối ưu cho game thủ chuyên nghiệp.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop',
    },
    {
      name: 'Bộ Kit Tự Lắp',
      slug: 'bo-kit-tu-lap',
      description: 'Bộ kit bàn phím bare-bones để tự lắp switch và keycap theo ý thích. Bao gồm PCB, case nhôm/acrylic, stabilizer.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1563191911-e65a8f136b88?w=600&h=400&fit=crop',
    },
  ];
  const categories: Record<string, { id: string }> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories[c.name] = cat;
  }
  console.log('✅ Categories created.');

  // ─────────────────────────────────────────────────────────────────────
  // Tags
  // ─────────────────────────────────────────────────────────────────────
  const tagsData = [
    'Hot Deal', 'Best Seller', 'New Arrival', 'Gaming', 'Typing', 'Wireless',
    'RGB', 'Linear', 'Tactile', 'Clicky', 'PBT', 'ABS', 'Custom', 'Budget',
    'Premium', 'Gasket Mount', 'TKL', '75%', '65%', '60%',
  ];
  const tags: Record<string, { id: string }> = {};
  for (const t of tagsData) {
    const tag = await prisma.tag.upsert({
      where: { slug: slug(t) },
      update: {},
      create: { name: t, slug: slug(t), isActive: true },
    });
    tags[t] = tag;
  }
  console.log('✅ Tags created.');

  // ─────────────────────────────────────────────────────────────────────
  // Helper: create product with tags
  // ─────────────────────────────────────────────────────────────────────
  const createProduct = async (data: {
    name: string;
    categoryKey: string;
    supplierKey: string;
    brandKey?: string;
    description: string;
    thumbnailUrl: string;
    images?: string[];
    initialBuyCount?: number;
    buyCount?: number;
    ratingAvg?: number;
    ratingCount?: number;
    tagKeys?: string[];
    variants: Array<{
      name: string;
      sku: string;
      price: number;
      discountPrice?: number;
      stockQuantity: number;
    }>;
  }) => {
    const productSlug = slug(data.name);
    const product = await prisma.product.upsert({
      where: { slug: productSlug },
      update: {},
      create: {
        name: data.name,
        slug: productSlug,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        images: data.images || [],
        category: { connect: { id: categories[data.categoryKey].id } },
        supplier: { connect: { id: suppliers[data.supplierKey].id } },
        brand: data.brandKey ? { connect: { id: brands[data.brandKey].id } } : undefined,
        initialBuyCount: data.initialBuyCount || 0,
        buyCount: data.buyCount || 0,
        ratingAvg: data.ratingAvg || 0,
        ratingCount: data.ratingCount || 0,
        variants: {
          create: data.variants,
        },
      },
      include: { variants: true },
    });
    if (data.tagKeys) {
      for (const tagKey of data.tagKeys) {
        if (tags[tagKey]) {
          await prisma.productTag.upsert({
            where: { productId_tagId: { productId: product.id, tagId: tags[tagKey].id } },
            update: {},
            create: { productId: product.id, tagId: tags[tagKey].id },
          });
        }
      }
    }
    return product;
  };

  // ─────────────────────────────────────────────────────────────────────
  // PRODUCTS – Bàn Phím Cơ
  // ─────────────────────────────────────────────────────────────────────

  const p_akko3098B = await createProduct({
    name: 'Akko 3098B Plus Multi-Mode',
    categoryKey: 'Bàn Phím Cơ',
    supplierKey: 'Akko',
    brandKey: 'Akko',
    description: `<div class="product-description">
  <h2>Akko 3098B Plus – Kết Nối Đa Chế Độ, Hiệu Năng Vượt Trội</h2>
  <p>Akko 3098B Plus là bàn phím cơ layout 98 phím (98%) với khả năng kết nối đa chế độ gồm Bluetooth 5.0 (3 thiết bị), 2.4GHz không dây và có dây USB-C. Tích hợp pin 4000mAh đủ sức dùng hàng tuần liên tục mà không cần sạc.</p>
  <h3>Điểm Nổi Bật</h3>
  <ul>
    <li><strong>Layout 98%:</strong> Giữ nguyên numpad nhưng nhỏ gọn hơn fullsize, phù hợp cả văn phòng và gaming.</li>
    <li><strong>Kết nối 3-in-1:</strong> Bluetooth 5.0 (3 device), 2.4GHz dongle, USB-C có dây – chuyển đổi tức thì bằng phím tắt.</li>
    <li><strong>Pin 4000mAh:</strong> Lên đến 200 giờ sử dụng ở chế độ Bluetooth không đèn nền.</li>
    <li><strong>Hotswap PCB:</strong> Dễ dàng thay switch mà không cần hàn thiếc, hỗ trợ switch 3-pin và 5-pin.</li>
    <li><strong>South-facing RGB:</strong> Đèn nền LED RGB với 16.8 triệu màu, nhiều hiệu ứng động bắt mắt.</li>
    <li><strong>Case nhựa ABS cao cấp</strong> với góc nghiêng 5.5°, tích hợp foam dampening để giảm âm.</li>
  </ul>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Layout</strong></td><td>98% (98 phím)</td></tr>
    <tr><td><strong>Switch mặc định</strong></td><td>Akko CS Jelly Purple (Tactile) / Pink (Linear) / Crystal (Clicky)</td></tr>
    <tr><td><strong>Hotswap</strong></td><td>Có (3-pin và 5-pin MX compatible)</td></tr>
    <tr><td><strong>Kết nối</strong></td><td>BT 5.0 x3 / 2.4GHz / USB-C</td></tr>
    <tr><td><strong>Pin</strong></td><td>4000mAh</td></tr>
    <tr><td><strong>Đèn nền</strong></td><td>South-facing RGB Per-key</td></tr>
    <tr><td><strong>Kích thước</strong></td><td>388 × 134 × 38mm</td></tr>
    <tr><td><strong>Trọng lượng</strong></td><td>~870g</td></tr>
  </table>
  <h3>Trong Hộp</h3>
  <ul>
    <li>1x Bàn phím Akko 3098B Plus</li>
    <li>1x Cáp USB-C to USB-A braid</li>
    <li>1x USB dongle 2.4GHz</li>
    <li>1x Keycap puller + switch puller</li>
    <li>1x Hướng dẫn sử dụng</li>
  </ul>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=533&fit=crop',
      'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 150,
    buyCount: 312,
    ratingAvg: 4.7,
    ratingCount: 89,
    tagKeys: ['Best Seller', 'Wireless', 'RGB', 'Hot Deal'],
    variants: [
      { name: 'Akko CS Jelly Purple (Tactile)', sku: 'AKKO-3098B-PURPLE', price: 1890000, discountPrice: 1650000, stockQuantity: 45 },
      { name: 'Akko CS Jelly Pink (Linear)', sku: 'AKKO-3098B-PINK', price: 1890000, discountPrice: 1650000, stockQuantity: 38 },
      { name: 'Akko CS Crystal (Clicky)', sku: 'AKKO-3098B-CRYSTAL', price: 1890000, discountPrice: 1650000, stockQuantity: 22 },
    ],
  });

  const p_akkoACR75 = await createProduct({
    name: 'Akko ACR75 Alice Layout Gasket Mount',
    categoryKey: 'Bàn Phím Cơ',
    supplierKey: 'Akko',
    brandKey: 'Akko',
    description: `<div class="product-description">
  <h2>Akko ACR75 – Ergonomic Alice Layout, Gasket Mount Cao Cấp</h2>
  <p>Akko ACR75 là bàn phím cơ layout Alice (75%) với thiết kế ergonomic giúp giảm mỏi cổ tay khi gõ lâu. Case acrylic trong suốt cho phép nhìn thấy toàn bộ nội thất bên trong, kết hợp với RGB underglow tạo hiệu ứng "floating" cực đẹp.</p>
  <h3>Điểm Nổi Bật</h3>
  <ul>
    <li><strong>Alice Layout:</strong> Thiết kế split-angle giúp đặt tay tự nhiên, giảm đau cổ tay khi gõ nhiều giờ.</li>
    <li><strong>Gasket Mount:</strong> PCB được đỡ bởi hệ thống gasket silicon, tạo cảm giác gõ mềm mại và âm thanh "thock" đặc trưng.</li>
    <li><strong>Case Acrylic trong suốt:</strong> Cấu trúc sandwich acrylic nhiều lớp, RGB underglow lung linh.</li>
    <li><strong>Hotswap PCB 5-pin:</strong> Tương thích với hầu hết switch MX-compatible trên thị trường.</li>
    <li><strong>Pre-lubed Stabilizer:</strong> Stabilizer được bôi lube sẵn, giảm rattle và cải thiện cảm giác gõ ngay từ hộp.</li>
  </ul>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Layout</strong></td><td>75% Alice Ergonomic</td></tr>
    <tr><td><strong>Mount Style</strong></td><td>Gasket Mount</td></tr>
    <tr><td><strong>Case</strong></td><td>Acrylic sandwich (trong suốt)</td></tr>
    <tr><td><strong>PCB</strong></td><td>Hotswap 5-pin MX</td></tr>
    <tr><td><strong>Đèn nền</strong></td><td>Per-key RGB + RGB Underglow</td></tr>
    <tr><td><strong>Kết nối</strong></td><td>USB-C có dây</td></tr>
    <tr><td><strong>Kích thước</strong></td><td>360 × 155 × 40mm</td></tr>
  </table>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 80,
    buyCount: 174,
    ratingAvg: 4.8,
    ratingCount: 54,
    tagKeys: ['New Arrival', 'Typing', 'Gasket Mount', 'Custom', 'Premium'],
    variants: [
      { name: 'Akko CS Jelly Black (Linear) – Trắng', sku: 'AKKO-ACR75-WHITE-LINEAR', price: 2490000, discountPrice: 2190000, stockQuantity: 18 },
      { name: 'Akko CS Jelly Black (Linear) – Đen', sku: 'AKKO-ACR75-BLACK-LINEAR', price: 2490000, discountPrice: 2190000, stockQuantity: 15 },
    ],
  });

  const p_aulaf75 = await createProduct({
    name: 'Aula F75 Gasket Mount Wireless',
    categoryKey: 'Bàn Phím Gaming',
    supplierKey: 'Aula',
    brandKey: 'Aula',
    description: `<div class="product-description">
  <h2>Aula F75 – Gaming Gasket Mount, Không Dây Đa Chế Độ</h2>
  <p>Aula F75 là bàn phím gaming 75% layout với cấu trúc gasket mount mềm mại, hỗ trợ kết nối 3-in-1 (BT 5.0 / 2.4GHz / USB-C). Được trang bị switch Aula Mechanical Pre-lubed sẵn, mang đến trải nghiệm gaming mượt mà và typing thoải mái.</p>
  <h3>Điểm Nổi Bật</h3>
  <ul>
    <li><strong>Gasket Mount structure:</strong> Giảm chấn hiệu quả, âm thanh gõ mềm và đều, loại bỏ cảm giác cứng đơ của top-mount thông thường.</li>
    <li><strong>Tri-mode wireless:</strong> Bluetooth 5.0 (3 thiết bị), 2.4GHz tốc độ thấp trễ, USB-C có dây.</li>
    <li><strong>RGB Per-key:</strong> Đèn nền RGB từng phím với hơn 20 hiệu ứng đèn động.</li>
    <li><strong>Case nhôm CNC:</strong> Khung nhôm anodize chắc chắn, nặng tay, tạo cảm giác premium cao cấp.</li>
    <li><strong>Polling Rate 1000Hz:</strong> Phản hồi cực nhanh khi kết nối có dây hoặc 2.4GHz.</li>
  </ul>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Layout</strong></td><td>75% (82 phím)</td></tr>
    <tr><td><strong>Case</strong></td><td>Nhôm CNC anodize</td></tr>
    <tr><td><strong>Mount Style</strong></td><td>Gasket Mount</td></tr>
    <tr><td><strong>Kết nối</strong></td><td>BT 5.0 / 2.4GHz / USB-C</td></tr>
    <tr><td><strong>Pin</strong></td><td>3000mAh</td></tr>
    <tr><td><strong>Polling Rate</strong></td><td>1000Hz (dây/2.4G), 125Hz (BT)</td></tr>
    <tr><td><strong>Hotswap</strong></td><td>Có (3-pin MX)</td></tr>
    <tr><td><strong>Trọng lượng</strong></td><td>~950g (bao gồm pin)</td></tr>
  </table>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 200,
    buyCount: 445,
    ratingAvg: 4.6,
    ratingCount: 132,
    tagKeys: ['Best Seller', 'Gaming', 'Wireless', 'RGB', 'Gasket Mount', '75%'],
    variants: [
      { name: 'Switch Linear Đỏ – Màu Đen', sku: 'AULA-F75-BLACK-RED', price: 1750000, discountPrice: 1490000, stockQuantity: 55 },
      { name: 'Switch Linear Đỏ – Màu Trắng', sku: 'AULA-F75-WHITE-RED', price: 1750000, discountPrice: 1490000, stockQuantity: 40 },
      { name: 'Switch Tactile – Màu Xám', sku: 'AULA-F75-GRAY-TACTILE', price: 1850000, discountPrice: 1590000, stockQuantity: 28 },
    ],
  });

  const p_keychronQ5 = await createProduct({
    name: 'Keychron Q5 Pro QMK/VIA Wireless',
    categoryKey: 'Bàn Phím Cơ',
    supplierKey: 'Keychron',
    brandKey: 'Keychron',
    description: `<div class="product-description">
  <h2>Keychron Q5 Pro – Đỉnh Cao Custom Keyboard Wireless</h2>
  <p>Keychron Q5 Pro là bàn phím cơ 96% layout (96 phím) được làm từ nhôm CNC nguyên khối, hỗ trợ QMK/VIA để remap hoàn toàn. Phiên bản Pro bổ sung kết nối Bluetooth 5.1 không dây bên cạnh USB-C có dây, là lựa chọn hoàn hảo cho cả designer lẫn programmer.</p>
  <h3>Điểm Nổi Bật</h3>
  <ul>
    <li><strong>CNC Aluminum Case:</strong> Case nhôm 6063 CNC nguyên khối, nặng ~1.8kg, không rung lắc khi gõ mạnh.</li>
    <li><strong>Double Gasket Mount:</strong> Hệ thống gasket kép (top + bottom) tạo âm thanh thock sâu và cảm giác gõ mềm mại bậc nhất phân khúc.</li>
    <li><strong>QMK/VIA Full Support:</strong> Remap từng phím, tạo macro, custom lighting qua phần mềm Keychron Launcher.</li>
    <li><strong>South-facing RGB:</strong> Đèn nền south-facing tương thích shine-through keycap, không bị che bởi switch.</li>
    <li><strong>Wireless Bluetooth 5.1:</strong> Độ trễ thấp, kết nối ổn định đến 3 thiết bị đồng thời.</li>
    <li><strong>Pre-installed Screw-in Stab:</strong> Stabilizer vít được bôi lube từ nhà máy.</li>
  </ul>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Layout</strong></td><td>96% (98 phím)</td></tr>
    <tr><td><strong>Case</strong></td><td>Nhôm CNC 6063 anodize</td></tr>
    <tr><td><strong>Mount</strong></td><td>Double Gasket</td></tr>
    <tr><td><strong>PCB</strong></td><td>Hotswap 5-pin, QMK/VIA</td></tr>
    <tr><td><strong>Kết nối</strong></td><td>Bluetooth 5.1 / USB-C</td></tr>
    <tr><td><strong>Pin</strong></td><td>4000mAh</td></tr>
    <tr><td><strong>Đèn nền</strong></td><td>South-facing RGB per-key</td></tr>
    <tr><td><strong>Trọng lượng</strong></td><td>~1.85kg</td></tr>
  </table>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1563191911-e65a8f136b88?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1563191911-e65a8f136b88?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 60,
    buyCount: 187,
    ratingAvg: 4.9,
    ratingCount: 73,
    tagKeys: ['Premium', 'Typing', 'Gasket Mount', 'Wireless', 'Custom'],
    variants: [
      { name: 'Gateron G Pro 3.0 Red (Linear) – Carbon Black', sku: 'KQ5PRO-CARBON-RED', price: 4590000, discountPrice: 4190000, stockQuantity: 12 },
      { name: 'Gateron G Pro 3.0 Brown (Tactile) – Carbon Black', sku: 'KQ5PRO-CARBON-BROWN', price: 4590000, discountPrice: 4190000, stockQuantity: 10 },
      { name: 'Gateron G Pro 3.0 Red (Linear) – Navy', sku: 'KQ5PRO-NAVY-RED', price: 4590000, discountPrice: 4190000, stockQuantity: 8 },
    ],
  });

  const p_keychronV1 = await createProduct({
    name: 'Keychron V1 QMK TKL Gasket',
    categoryKey: 'Bàn Phím Cơ',
    supplierKey: 'Keychron',
    brandKey: 'Keychron',
    description: `<div class="product-description">
  <h2>Keychron V1 – TKL Gasket Mount, QMK Entry-Level Tốt Nhất</h2>
  <p>Keychron V1 là bàn phím cơ TKL (tenkeyless, 80%) với cấu trúc gasket mount và hỗ trợ QMK/VIA ở mức giá phải chăng nhất trong dòng V-Series. Case nhựa polycarbonate frosted trong suốt cho phép ánh sáng RGB lan tỏa đẹp mắt.</p>
  <h3>Điểm Nổi Bật</h3>
  <ul>
    <li><strong>Frosted PC Case:</strong> Nhựa polycarbonate trong mờ, RGB underglow đẹp và có chiều sâu.</li>
    <li><strong>Gasket Mount:</strong> Đệm silicone giữa PCB và case, cảm giác gõ mềm, âm "thock" rõ nét.</li>
    <li><strong>Hotswap 5-pin:</strong> Tương thích mọi switch MX 3-pin và 5-pin.</li>
    <li><strong>QMK/VIA:</strong> Hoàn toàn customizable qua phần mềm.</li>
    <li><strong>Double-shot PBT Keycap:</strong> Keycap PBT double-shot bền bỉ, không mờ chữ theo thời gian.</li>
  </ul>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Layout</strong></td><td>TKL 80% (87 phím)</td></tr>
    <tr><td><strong>Case</strong></td><td>Frosted Polycarbonate</td></tr>
    <tr><td><strong>Mount</strong></td><td>Gasket Mount</td></tr>
    <tr><td><strong>Kết nối</strong></td><td>USB-C có dây</td></tr>
    <tr><td><strong>Hotswap</strong></td><td>Có (5-pin MX)</td></tr>
    <tr><td><strong>Keycap</strong></td><td>Double-shot PBT</td></tr>
  </table>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 90,
    buyCount: 256,
    ratingAvg: 4.7,
    ratingCount: 98,
    tagKeys: ['Best Seller', 'Typing', 'Gasket Mount', 'Budget', 'TKL'],
    variants: [
      { name: 'Gateron G Pro 3.0 Red (Linear) – Frosted Black', sku: 'KV1-FROSTED-RED', price: 2190000, discountPrice: 1890000, stockQuantity: 35 },
      { name: 'Gateron G Pro 3.0 Brown (Tactile) – Frosted Black', sku: 'KV1-FROSTED-BROWN', price: 2190000, discountPrice: 1890000, stockQuantity: 28 },
      { name: 'Gateron G Pro 3.0 Blue (Clicky) – Frosted Black', sku: 'KV1-FROSTED-BLUE', price: 2190000, discountPrice: 1890000, stockQuantity: 15 },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────
  // PRODUCTS – Keycap
  // ─────────────────────────────────────────────────────────────────────

  const p_akkoASA = await createProduct({
    name: 'Akko ASA Ocean Star Full Set Keycap',
    categoryKey: 'Keycap',
    supplierKey: 'Akko',
    brandKey: 'Akko',
    description: `<div class="product-description">
  <h2>Akko ASA Ocean Star – Biển Cả Trong Từng Phím Bấm</h2>
  <p>Bộ keycap ASA Ocean Star của Akko lấy cảm hứng từ đại dương sâu thẳm với gradient màu xanh biển đến xanh lá rực rỡ. Chất liệu PBT double-shot cao cấp đảm bảo chữ in sắc nét, không bao giờ mòn theo thời gian.</p>
  <h3>Điểm Nổi Bật</h3>
  <ul>
    <li><strong>ASA Profile:</strong> Cao hơn OEM, thấp hơn SA – điểm trung gian hoàn hảo giữa comfort và accessibility.</li>
    <li><strong>PBT Double-shot:</strong> Chữ được đúc 2 lớp nhựa, không bao giờ mờ dù gõ hàng triệu lần.</li>
    <li><strong>Gradient Ocean:</strong> Màu chuyển tiếp từ Deep Blue (#0A2463) sang Teal (#3E8989), nhìn lung linh dưới ánh đèn RGB.</li>
    <li><strong>Full 230-key set:</strong> Bao phủ mọi layout từ 40% đến fullsize, bao gồm ISO và ANSI.</li>
    <li><strong>Shine-through:</strong> Keycap mỏng ở đáy, ánh sáng RGB xuyên qua đẹp và đều.</li>
  </ul>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Profile</strong></td><td>ASA (uniform row 3)</td></tr>
    <tr><td><strong>Chất liệu</strong></td><td>PBT Double-shot</td></tr>
    <tr><td><strong>Tương thích</strong></td><td>MX switch và clone</td></tr>
    <tr><td><strong>Số lượng</strong></td><td>230 keycap</td></tr>
    <tr><td><strong>Layout</strong></td><td>ANSI + ISO, 40% đến Fullsize</td></tr>
  </table>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 120,
    buyCount: 289,
    ratingAvg: 4.6,
    ratingCount: 76,
    tagKeys: ['Best Seller', 'PBT', 'Hot Deal'],
    variants: [
      { name: 'Ocean Star – Set Đầy Đủ 230 Phím', sku: 'AKKO-ASA-OCEAN-FULL', price: 890000, discountPrice: 750000, stockQuantity: 67 },
    ],
  });

  const p_akkoCS = await createProduct({
    name: 'Akko Dye-Sub PBT Keycap 9009 Retro',
    categoryKey: 'Keycap',
    supplierKey: 'Akko',
    brandKey: 'Akko',
    description: `<div class="product-description">
  <h2>Akko 9009 Retro – Huyền Thoại Vintage Tái Sinh</h2>
  <p>Bộ keycap 9009 Retro lấy cảm hứng từ bảng màu vintage của máy tính IBM những năm 1980. Chất liệu PBT Dye-sub mang lại màu sắc sống động, bền bỉ theo thời gian mà không phai màu. Đây là lựa chọn yêu thích của cộng đồng keyboard enthusiast thế giới.</p>
  <h3>Điểm Nổi Bật</h3>
  <ul>
    <li><strong>Cherry Profile:</strong> Chiều cao thấp, phù hợp gõ lâu không mỏi tay.</li>
    <li><strong>PBT Dye-sublimation:</strong> Màu sắc thấm sâu vào chất liệu, không bong tróc hay mờ đi.</li>
    <li><strong>Retro Colorway:</strong> Beige warm + legend màu đỏ/nâu đặc trưng IBM 9009.</li>
    <li><strong>Thickened PBT 1.5mm:</strong> Thành keycap dày hơn, âm thanh gõ trầm và đặc.</li>
    <li><strong>Full support layout:</strong> ANSI US, bao gồm phím numpad và F-row đầy đủ.</li>
  </ul>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Profile</strong></td><td>Cherry (sculpted)</td></tr>
    <tr><td><strong>Chất liệu</strong></td><td>PBT Dye-sublimation, dày 1.5mm</td></tr>
    <tr><td><strong>Màu sắc</strong></td><td>Beige / Legends đỏ & nâu (9009 Retro)</td></tr>
    <tr><td><strong>Layout</strong></td><td>ANSI US Fullsize</td></tr>
    <tr><td><strong>Số lượng</strong></td><td>171 keycap</td></tr>
  </table>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1629429409892-5a0c04b8d0a3?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1629429409892-5a0c04b8d0a3?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 200,
    buyCount: 512,
    ratingAvg: 4.8,
    ratingCount: 143,
    tagKeys: ['Best Seller', 'PBT', 'Premium', 'Typing'],
    variants: [
      { name: '9009 Retro – Cherry Profile PBT', sku: 'AKKO-9009-CHERRY-PBT', price: 690000, discountPrice: 590000, stockQuantity: 89 },
    ],
  });

  const p_epbtMiami = await createProduct({
    name: 'ePBT Miami Nights Keycap Set',
    categoryKey: 'Keycap',
    supplierKey: 'Lackey Store',
    brandKey: 'ePBT',
    description: `<div class="product-description">
  <h2>ePBT Miami Nights – Neon Đêm Nóng Bỏng</h2>
  <p>ePBT Miami Nights là bộ keycap Cherry profile PBT với bảng màu lấy cảm hứng từ đêm neon Miami những năm 80. Sự kết hợp giữa tím đậm, hồng neon và xanh cyan tạo nên một bộ keycap vừa retro vừa futuristic – hoàn hảo cho setup tím hồng hoặc RGB rainbow.</p>
  <h3>Điểm Nổi Bật</h3>
  <ul>
    <li><strong>Cherry Profile sculpted:</strong> Thiết kế cong theo hàng (row 1–5), tối ưu cho typing speed và comfort.</li>
    <li><strong>PBT Dye-sub:</strong> Chữ legend in sắc nét, bền bỉ vĩnh viễn, không phai màu dù dùng nhiều năm.</li>
    <li><strong>Miami Nights Colorway:</strong> Deep purple base + pink/cyan accent – setup kiểu aesthetic không đâu sánh được.</li>
    <li><strong>Thick PBT 1.5mm:</strong> Keycap dày, âm thanh gõ "clacky" đặc trưng được ưa chuộng trong cộng đồng.</li>
    <li><strong>Bộ kit đầy đủ:</strong> Bao gồm novelty key, modifier đặc biệt và base kit ANSI.</li>
  </ul>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Profile</strong></td><td>Cherry (sculpted, row 1-5)</td></tr>
    <tr><td><strong>Chất liệu</strong></td><td>PBT Dye-sublimation 1.5mm</td></tr>
    <tr><td><strong>Màu sắc</strong></td><td>Deep Purple + Hot Pink + Cyan Neon</td></tr>
    <tr><td><strong>Layout</strong></td><td>ANSI + ISO, 40%-Fullsize</td></tr>
  </table>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 40,
    buyCount: 98,
    ratingAvg: 4.9,
    ratingCount: 38,
    tagKeys: ['Premium', 'PBT', 'New Arrival', 'Typing'],
    variants: [
      { name: 'Miami Nights – Base Kit ANSI', sku: 'EPBT-MIAMI-BASE-ANSI', price: 1450000, stockQuantity: 22 },
      { name: 'Miami Nights – Base + ISO Kit', sku: 'EPBT-MIAMI-BASE-ISO', price: 1650000, stockQuantity: 10 },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────
  // PRODUCTS – Switch
  // ─────────────────────────────────────────────────────────────────────

  const p_gateronYellow = await createProduct({
    name: 'Gateron G Pro 3.0 Yellow Switch (35 cái)',
    categoryKey: 'Switch',
    supplierKey: 'Gateron',
    brandKey: 'Gateron',
    description: `<div class="product-description">
  <h2>Gateron G Pro 3.0 Yellow – Linear Nhẹ Nhàng Cho Gamer</h2>
  <p>Gateron G Pro 3.0 Yellow là switch linear được coi là "budget king" của dòng switch cơ học. Với lực kích hoạt chỉ 35gf và hành trình mượt mà không tiếng ồn, đây là lựa chọn hàng đầu cho game thủ yêu thích tốc độ và sự thoải mái khi gõ lâu.</p>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Loại</strong></td><td>Linear</td></tr>
    <tr><td><strong>Lực kích hoạt</strong></td><td>35gf</td></tr>
    <tr><td><strong>Pre-travel</strong></td><td>2.0mm</td></tr>
    <tr><td><strong>Total travel</strong></td><td>4.0mm</td></tr>
    <tr><td><strong>Tuổi thọ</strong></td><td>100 triệu lần bấm</td></tr>
    <tr><td><strong>PCB tương thích</strong></td><td>3-pin và 5-pin (MX footprint)</td></tr>
    <tr><td><strong>SMD LED</strong></td><td>Có hỗ trợ</td></tr>
  </table>
  <h3>Tại Sao Chọn Gateron Yellow?</h3>
  <ul>
    <li>Mượt nhất trong phân khúc giá rẻ – smoother than Cherry MX Red</li>
    <li>Lực bấm siêu nhẹ – không mỏi tay khi gaming marathon</li>
    <li>Bottom-out không tiếng "ping" – im lặng, tập trung game</li>
    <li>Factory stem pre-lubed nhẹ – dùng được ngay, lube thêm để tăng smoothness</li>
  </ul>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 300,
    buyCount: 876,
    ratingAvg: 4.7,
    ratingCount: 234,
    tagKeys: ['Best Seller', 'Linear', 'Gaming', 'Budget'],
    variants: [
      { name: 'Gateron Yellow – 35 cái (lẻ)', sku: 'GATE-G3-YELLOW-35', price: 195000, discountPrice: 165000, stockQuantity: 200 },
      { name: 'Gateron Yellow – 70 cái', sku: 'GATE-G3-YELLOW-70', price: 370000, discountPrice: 320000, stockQuantity: 120 },
      { name: 'Gateron Yellow – 110 cái (full board)', sku: 'GATE-G3-YELLOW-110', price: 550000, discountPrice: 490000, stockQuantity: 80 },
    ],
  });

  const p_gateronInk = await createProduct({
    name: 'Gateron Ink V2 Black Switch (35 cái)',
    categoryKey: 'Switch',
    supplierKey: 'Gateron',
    brandKey: 'Gateron',
    description: `<div class="product-description">
  <h2>Gateron Ink V2 Black – Premium Linear Đỉnh Cao</h2>
  <p>Gateron Ink V2 Black là switch linear cao cấp nhất của Gateron, nổi tiếng với housing trong suốt Ink và stem được gia công tỉ mỉ cho độ mượt vượt trội. Đây là switch được ưa chuộng nhất trong cộng đồng custom keyboard Việt Nam và quốc tế.</p>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Loại</strong></td><td>Linear</td></tr>
    <tr><td><strong>Lực kích hoạt</strong></td><td>60gf (bottom-out 70gf)</td></tr>
    <tr><td><strong>Pre-travel</strong></td><td>2.0mm</td></tr>
    <tr><td><strong>Total travel</strong></td><td>4.0mm</td></tr>
    <tr><td><strong>Housing</strong></td><td>Ink PC trong suốt (top + bottom)</td></tr>
    <tr><td><strong>Stem</strong></td><td>POM màu đen, tự bôi trơn nhẹ</td></tr>
    <tr><td><strong>Tuổi thọ</strong></td><td>150 triệu lần bấm</td></tr>
  </table>
  <h3>Tại Sao Ink V2 Là "Endgame" Switch?</h3>
  <ul>
    <li><strong>Ink housing độc quyền:</strong> Chất liệu PC đặc biệt giảm tiếng rattle và tăng âm thanh "clack" trầm ấm.</li>
    <li><strong>Mượt không cần lube:</strong> Out-of-box smoothness tốt hơn hầu hết switch đã lube.</li>
    <li><strong>Âm thanh thicker:</strong> Sound signature đặc trưng được cộng đồng đánh giá cao nhất phân khúc.</li>
    <li><strong>5-pin footprint:</strong> Ổn định hoàn hảo trên mọi PCB hotswap 5-pin.</li>
  </ul>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1629429409892-5a0c04b8d0a3?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1629429409892-5a0c04b8d0a3?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 180,
    buyCount: 423,
    ratingAvg: 4.9,
    ratingCount: 167,
    tagKeys: ['Premium', 'Linear', 'Best Seller', 'Typing'],
    variants: [
      { name: 'Ink V2 Black – 35 cái', sku: 'GATE-INK2-BLK-35', price: 480000, stockQuantity: 85 },
      { name: 'Ink V2 Black – 70 cái', sku: 'GATE-INK2-BLK-70', price: 920000, stockQuantity: 52 },
    ],
  });

  const p_akkoPinkSwitch = await createProduct({
    name: 'Akko CS Jelly Pink Switch (45 cái)',
    categoryKey: 'Switch',
    supplierKey: 'Akko',
    brandKey: 'Akko',
    description: `<div class="product-description">
  <h2>Akko CS Jelly Pink – Linear Nhẹ Nhàng, Âm Thanh Đặc Biệt</h2>
  <p>Akko CS Jelly Pink là switch linear nổi tiếng với housing PC trong suốt màu hồng (Jelly housing) tạo ra âm thanh "clacky" đặc trưng được ưa chuộng trong cộng đồng. Lực bấm nhẹ và hành trình mượt mà là điểm mạnh nổi bật của dòng switch này.</p>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Loại</strong></td><td>Linear</td></tr>
    <tr><td><strong>Lực kích hoạt</strong></td><td>45gf</td></tr>
    <tr><td><strong>Pre-travel</strong></td><td>1.9mm</td></tr>
    <tr><td><strong>Total travel</strong></td><td>4.0mm</td></tr>
    <tr><td><strong>Housing</strong></td><td>Jelly PC hồng trong suốt</td></tr>
    <tr><td><strong>Stem</strong></td><td>POM trắng</td></tr>
    <tr><td><strong>SMD LED</strong></td><td>Có hỗ trợ (shine-through)</td></tr>
  </table>
  <h3>Điểm Đặc Biệt</h3>
  <ul>
    <li>Jelly housing tạo âm thanh "clacky-poppy" độc đáo</li>
    <li>Shine-through hoàn toàn – RGB xuyên qua phím rực rỡ</li>
    <li>Pre-lubed nhẹ từ nhà máy – mượt ngay từ hộp</li>
    <li>Giá thành hợp lý, phù hợp cho người mới bắt đầu</li>
  </ul>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1598495496954-2d2f7b1d2d68?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598495496954-2d2f7b1d2d68?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 220,
    buyCount: 534,
    ratingAvg: 4.5,
    ratingCount: 189,
    tagKeys: ['Best Seller', 'Linear', 'Budget', 'New Arrival'],
    variants: [
      { name: 'Jelly Pink – 45 cái', sku: 'AKKO-CS-PINK-45', price: 265000, discountPrice: 225000, stockQuantity: 150 },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────
  // PRODUCTS – Lube & Phụ Kiện
  // ─────────────────────────────────────────────────────────────────────

  const p_krytox205 = await createProduct({
    name: 'Krytox 205g0 Switch Lube (3ml)',
    categoryKey: 'Lube & Phụ Kiện',
    supplierKey: 'Lackey Store',
    description: `<div class="product-description">
  <h2>Krytox 205g0 – Vua Lube Trong Cộng Đồng Keyboard</h2>
  <p>Krytox GPL 205 Grade 0 là loại lube switch được coi là tiêu chuẩn vàng trong cộng đồng custom keyboard toàn cầu. Dạng gel đặc, bôi trên stem switch linear tạo ra độ mượt tuyệt vời và giảm âm thanh scratch/scratchiness đáng kể.</p>
  <h3>Hướng Dẫn Sử Dụng</h3>
  <ul>
    <li><strong>Dùng cho:</strong> Switch linear (Red, Yellow, Black) – KHÔNG dùng cho tactile/clicky (mất bump)</li>
    <li><strong>Bôi vào:</strong> Stem (4 cạnh), housing bottom (inner rails), spring (bag lube hoặc brush)</li>
    <li><strong>Lượng dùng:</strong> Layer mỏng là đủ – ít hơn bạn nghĩ</li>
    <li><strong>Công cụ cần:</strong> Switch opener, brush 0 (painting brush)</li>
  </ul>
  <h3>Thông Số</h3>
  <table>
    <tr><td><strong>Loại</strong></td><td>PFPE/PTFE grease, Grade 0</td></tr>
    <tr><td><strong>Độ nhớt</strong></td><td>Thấp đến trung bình (NLG 0)</td></tr>
    <tr><td><strong>Dung tích</strong></td><td>3ml (đủ lube ~120-150 switch)</td></tr>
    <tr><td><strong>Màu sắc</strong></td><td>Trắng đục, dạng gel</td></tr>
  </table>
  <p><em>⚠️ Lưu ý: 205g0 chỉ phù hợp switch linear. Dùng Tribosys 3203 cho tactile switch.</em></p>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 400,
    buyCount: 1023,
    ratingAvg: 4.9,
    ratingCount: 312,
    tagKeys: ['Best Seller', 'Hot Deal', 'Custom'],
    variants: [
      { name: 'Krytox 205g0 – 3ml', sku: 'KRYTOX-205G0-3ML', price: 185000, discountPrice: 155000, stockQuantity: 300 },
      { name: 'Krytox 205g0 – 10ml', sku: 'KRYTOX-205G0-10ML', price: 490000, discountPrice: 420000, stockQuantity: 120 },
    ],
  });

  const p_switchKit = await createProduct({
    name: 'Bộ Dụng Cụ Mod Switch (Opener + Brush + Puller)',
    categoryKey: 'Lube & Phụ Kiện',
    supplierKey: 'Lackey Store',
    description: `<div class="product-description">
  <h2>Bộ Mod Switch Toàn Diện – Dành Cho Keyboard Enthusiast</h2>
  <p>Bộ dụng cụ mod switch đầy đủ bao gồm switch opener đa năng, keycap puller, switch puller, và brush lube chuyên dụng. Tất cả trong một hộp nhỏ gọn, tiện lợi cho việc mod và maintain bàn phím cơ.</p>
  <h3>Bộ Bao Gồm</h3>
  <ul>
    <li><strong>1x Switch Opener:</strong> Tương thích MX và Alps switch, mở không xây xước housing</li>
    <li><strong>1x Wire Keycap Puller:</strong> Kéo keycap không làm trầy xước, phù hợp mọi profile</li>
    <li><strong>1x Switch Puller:</strong> Kéo switch từ hotswap socket an toàn</li>
    <li><strong>2x Brush lube size 0:</strong> Brush chuyên dụng bôi lube switch</li>
    <li><strong>1x Hộp đựng switch mini:</strong> Đựng 10 switch lẻ khi lube</li>
  </ul>
  <h3>Chất Liệu</h3>
  <table>
    <tr><td><strong>Switch Opener</strong></td><td>Nhựa ABS cao cấp, không xây xước</td></tr>
    <tr><td><strong>Keycap Puller</strong></td><td>Dây thép inox, tay cầm nhựa</td></tr>
    <tr><td><strong>Switch Puller</strong></td><td>Nhựa PC trong suốt</td></tr>
  </table>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 150,
    buyCount: 378,
    ratingAvg: 4.6,
    ratingCount: 94,
    tagKeys: ['Best Seller', 'Custom', 'Budget'],
    variants: [
      { name: 'Bộ Mod Tool Tiêu Chuẩn', sku: 'MOD-TOOL-STANDARD', price: 145000, discountPrice: 119000, stockQuantity: 180 },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────
  // PRODUCTS – Bộ Kit Tự Lắp
  // ─────────────────────────────────────────────────────────────────────

  const p_kbdfans5 = await createProduct({
    name: 'KBDfans D60 Lite Barebones Kit',
    categoryKey: 'Bộ Kit Tự Lắp',
    supplierKey: 'Lackey Store',
    brandKey: 'KBDfans',
    description: `<div class="product-description">
  <h2>KBDfans D60 Lite – Entry-Level Custom Kit Chất Lượng Cao</h2>
  <p>KBDfans D60 Lite là bộ kit bàn phím 60% barebones (không bao gồm switch và keycap) với case nhôm CNC và PCB hotswap 5-pin. Đây là điểm khởi đầu lý tưởng cho ai muốn tự lắp bàn phím custom đầu tiên với ngân sách hợp lý.</p>
  <h3>Bộ Bao Gồm</h3>
  <ul>
    <li><strong>1x Case nhôm 6063 CNC</strong> (anodize matte)</li>
    <li><strong>1x PCB hotswap 5-pin</strong> (QMK/VIA compatible)</li>
    <li><strong>1x Plate polycarbonate</strong> (flex cut, giảm chấn tốt)</li>
    <li><strong>1x Case foam</strong> (dampening sound)</li>
    <li><strong>1x PCB foam</strong></li>
    <li><strong>1x Bộ stabilizer Durock V2</strong> (screw-in, pre-lubed)</li>
    <li><strong>1x Cáp USB-C</strong></li>
  </ul>
  <h3>Thông Số Kỹ Thuật</h3>
  <table>
    <tr><td><strong>Layout</strong></td><td>60% ANSI (61 phím)</td></tr>
    <tr><td><strong>Case</strong></td><td>Nhôm 6063 CNC anodize</td></tr>
    <tr><td><strong>Plate</strong></td><td>Polycarbonate flex cut</td></tr>
    <tr><td><strong>Mount Style</strong></td><td>Top mount với gasket pad</td></tr>
    <tr><td><strong>PCB</strong></td><td>Hotswap 5-pin, QMK/VIA</td></tr>
    <tr><td><strong>Góc nghiêng</strong></td><td>5°</td></tr>
    <tr><td><strong>Trọng lượng case</strong></td><td>~680g</td></tr>
  </table>
  <p><strong>⚠️ Lưu ý:</strong> Bộ kit không bao gồm switch và keycap. Bạn cần mua riêng để hoàn thiện bàn phím.</p>
</div>`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&h=533&fit=crop',
    ],
    initialBuyCount: 30,
    buyCount: 67,
    ratingAvg: 4.8,
    ratingCount: 28,
    tagKeys: ['Custom', 'Premium', 'Gasket Mount', '60%'],
    variants: [
      { name: 'D60 Lite – Black Anodize', sku: 'KBD-D60-BLACK', price: 3290000, discountPrice: 2990000, stockQuantity: 15 },
      { name: 'D60 Lite – Silver Anodize', sku: 'KBD-D60-SILVER', price: 3290000, discountPrice: 2990000, stockQuantity: 12 },
    ],
  });

  console.log('✅ All products created.');

  // ─────────────────────────────────────────────────────────────────────
  // Site Content – Testimonials
  // ─────────────────────────────────────────────────────────────────────
  const testimonialsData = [
    {
      title: 'Bàn phím cơ tốt nhất tôi từng dùng!',
      content: 'Tôi đã dùng Keychron Q5 Pro được 3 tháng và không thể không chia sẻ. Âm thanh thock của gasket mount cực kỳ thỏa mãn, cảm giác gõ mềm mại hơn hẳn những bàn phím office rẻ tiền trước đây. Shipping nhanh, đóng gói cẩn thận. Lackey xứng đáng 5 sao!',
      authorName: 'Nguyễn Minh Tuấn',
      authorTitle: 'Software Engineer, Hà Nội',
      displayOrder: 1,
    },
    {
      title: 'Switch Gateron Ink V2 ngon không tưởng',
      content: 'Mình đã thử nhiều switch trước đây nhưng Gateron Ink V2 Black thực sự ở đẳng cấp khác. Mượt không cần lube, âm thanh thicker và trầm rất dễ chịu. Lube thêm 205g0 thì gần như là endgame rồi. Cảm ơn Lackey đã ship hàng nhanh trong 2 ngày!',
      authorName: 'Trần Thị Hoa',
      authorTitle: 'UI/UX Designer, TP.HCM',
      displayOrder: 2,
    },
    {
      title: 'Keycap ePBT Miami Nights đẹp xuất sắc',
      content: 'Setup tím hồng của mình hoàn toàn được nâng cấp nhờ bộ keycap Miami Nights. Màu sắc chuẩn không lệch, PBT dày dặn, gõ nghe "clacky" rất thích. Lackey giao hàng đúng hẹn, tư vấn nhiệt tình khi mình không biết chọn profile nào.',
      authorName: 'Lê Quang Khải',
      authorTitle: 'Content Creator, Đà Nẵng',
      displayOrder: 3,
    },
    {
      title: 'Akko 3098B Plus – Xứng đáng với giá tiền',
      content: 'Bàn phím wireless 98% ở tầm giá này mà có hotswap, RGB, pin 4000mAh thì thực sự không có đối thủ. Mình dùng Bluetooth để kết nối MacBook và iPad, chuyển đổi rất mượt. Gõ văn bản và code cả ngày không thấy mỏi. Highly recommend!',
      authorName: 'Phạm Văn Đức',
      authorTitle: 'Product Manager, Hà Nội',
      displayOrder: 4,
    },
    {
      title: 'Mua lube 205g0 và mod tool rất hài lòng',
      content: 'Lần đầu lube switch nhờ hướng dẫn của Lackey, sau khi lube Gateron Yellow thì sự khác biệt rõ ràng ngay. Smooth hơn, ít tiếng hơn, gõ sướng hơn hẳn. Bộ mod tool giá rẻ nhưng dùng tốt, switch opener không xây xước housing. Shop tư vấn tận tình, sẽ quay lại mua tiếp.',
      authorName: 'Võ Thị Thu',
      authorTitle: 'Sinh viên, Cần Thơ',
      displayOrder: 5,
    },
    {
      title: 'D60 Lite build xong đẹp không kém gì custom đắt tiền',
      content: 'Lần đầu custom keyboard, mình chọn D60 Lite với Gateron Ink V2 Red và keycap 9009 Retro. Kết quả ngoài mong đợi – case nhôm chắc tay, PCB hotswap hỗ trợ QMK nên remap thoải mái. Lackey hỗ trợ build guide chi tiết, rất thân thiện với người mới.',
      authorName: 'Hoàng Anh Tú',
      authorTitle: 'Gamer & Streamer, TP.HCM',
      displayOrder: 6,
    },
  ];

  for (const t of testimonialsData) {
    await prisma.siteContent.create({
      data: {
        type: ContentType.TESTIMONIAL,
        title: t.title,
        content: t.content,
        authorName: t.authorName,
        authorTitle: t.authorTitle,
        displayOrder: t.displayOrder,
        isPublished: true,
      },
    });
  }
  console.log('✅ Testimonials created.');

  // ─────────────────────────────────────────────────────────────────────
  // Site Content – Banners
  // ─────────────────────────────────────────────────────────────────────
  await prisma.siteContent.createMany({
    data: [
      {
        type: ContentType.BANNER,
        title: 'Summer Sale – Giảm đến 20% toàn bộ Switch',
        content: 'Mùa hè bùng nổ với deal switch khủng! Mua từ 2 bộ trở lên, giảm thêm 5%.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&h=500&fit=crop',
        linkUrl: '/products?category=switch',
        displayOrder: 1,
        isPublished: true,
      },
      {
        type: ContentType.BANNER,
        title: 'Keychron Q-Series – Nhôm Nguyên Khối, Gasket Mount',
        content: 'Trải nghiệm cảm giác gõ endgame với dòng Q-Series từ Keychron.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1200&h=500&fit=crop',
        linkUrl: '/products?brand=keychron',
        displayOrder: 2,
        isPublished: true,
      },
      {
        type: ContentType.BANNER,
        title: 'New Arrival – ePBT Miami Nights Keycap',
        content: 'Bộ keycap neon đêm Miami đã về kho – số lượng có hạn!',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=500&fit=crop',
        linkUrl: '/products?category=keycap&tag=new-arrival',
        displayOrder: 3,
        isPublished: true,
      },
    ],
  });
  console.log('✅ Banners created.');

  // ─────────────────────────────────────────────────────────────────────
  // Discounts
  // ─────────────────────────────────────────────────────────────────────
  await prisma.discount.createMany({
    data: [
      {
        code: 'LACKEY10',
        description: 'Giảm 10% cho đơn hàng từ 500,000đ – dành cho khách hàng mới',
        type: DiscountType.PERCENTAGE,
        value: 10,
        isActive: true,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        minAmount: 500000,
        maxDiscountAmount: 200000,
        usageLimit: 1000,
        perUserLimit: 1,
      },
      {
        code: 'SWITCH50K',
        description: 'Giảm 50,000đ khi mua switch từ 200,000đ',
        type: DiscountType.FIXED_AMOUNT,
        value: 50000,
        isActive: true,
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-06-30'),
        minAmount: 200000,
        usageLimit: 500,
      },
      {
        code: 'KEYBOARD15',
        description: 'Giảm 15% bàn phím cơ từ 1,000,000đ',
        type: DiscountType.PERCENTAGE,
        value: 15,
        isActive: true,
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-07-31'),
        minAmount: 1000000,
        maxDiscountAmount: 500000,
        usageLimit: 200,
      },
    ],
  });
  console.log('✅ Discount codes created: LACKEY10, SWITCH50K, KEYBOARD15');

  // ─────────────────────────────────────────────────────────────────────
  // Demo Customers + Address + Sample Orders (for chart data)
  // ─────────────────────────────────────────────────────────────────────
  const customerAPassword = await bcrypt.hash('User@123', 10);

  let customerA = await prisma.customer.findFirst({ where: { email: 'customer.a@lackey.vn' } });
  if (!customerA) {
    customerA = await prisma.customer.create({
      data: {
        email: 'customer.a@lackey.vn',
        fullName: 'Nguyễn Văn An',
        phone: '0912345678',
        user: {
          create: {
            username: 'nguyenvanan',
            password: customerAPassword,
            role: UserRole.CUSTOMER,
          },
        },
      },
    });
  }

  let customerB = await prisma.customer.findFirst({ where: { email: 'customer.b@lackey.vn' } });
  if (!customerB) {
    customerB = await prisma.customer.create({
      data: {
        email: 'customer.b@lackey.vn',
        fullName: 'Trần Thị Bích',
        phone: '0987654321',
      },
    });
  }

  let addressA = await prisma.address.findFirst({ where: { customerId: customerA.id } });
  if (!addressA) {
    addressA = await prisma.address.create({
      data: {
        customerId: customerA.id,
        recipientName: 'Nguyễn Văn An',
        phoneNumber: '0912345678',
        street: '45 Nguyễn Trãi',
        ward: 'Phường Thượng Đình',
        district: 'Quận Thanh Xuân',
        city: 'Hà Nội',
        fullAddress: '45 Nguyễn Trãi, Phường Thượng Đình, Quận Thanh Xuân, Hà Nội',
        isDefault: true,
      },
    });
  }

  // Collect all variants for sample orders
  const allProducts = [
    p_akko3098B, p_akkoACR75, p_aulaf75, p_keychronQ5, p_keychronV1,
    p_akkoASA, p_akkoCS, p_epbtMiami, p_gateronYellow, p_gateronInk,
    p_akkoPinkSwitch, p_krytox205, p_switchKit, p_kbdfans5,
  ];
  const allVariants = allProducts.flatMap((p) => p.variants);

  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };

  const statusCycle = [
    OrderStatus.COMPLETED,
    OrderStatus.COMPLETED,
    OrderStatus.COMPLETED,
    OrderStatus.SHIPPED,
    OrderStatus.PREPARING_SHIPMENT,
    OrderStatus.CONFIRMED,
    OrderStatus.PENDING_CONFIRMATION,
  ];

  for (let day = 0; day < 30; day++) {
    const createdAt = daysAgo(29 - day);
    const orderCode = `LK${randomCode()}`;
    const lineCount = 1 + (day % 3);
    const items: Array<{ v: (typeof allVariants)[number]; qty: number }> = [];
    for (let i = 0; i < lineCount; i++) {
      const v = allVariants[(day * 3 + i * 7) % allVariants.length];
      const qty = 1 + (i % 2);
      items.push({ v, qty });
    }
    let subtotal = 0;
    for (const it of items) subtotal += Number(it.v.discountPrice ?? it.v.price) * it.qty;
    const shippingFee = 30000;
    const total = subtotal + shippingFee;
    const status = statusCycle[day % statusCycle.length];

    await prisma.order.create({
      data: {
        customerId: customerA.id,
        shippingAddressId: addressA.id,
        orderCode,
        deliveryCode: `DLV${randomCode()}`,
        status,
        subtotalAmount: subtotal,
        shippingFee,
        totalAmount: total,
        createdAt,
        orderItems: {
          create: items.map(({ v, qty }) => ({
            productVariantId: v.id,
            quantity: qty,
            priceAtPurchase: Number(v.discountPrice ?? v.price),
          })),
        },
        payments: {
          create: [
            {
              method: PaymentMethod.COD,
              amount: total,
              status: status === OrderStatus.COMPLETED ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
              paidAt: status === OrderStatus.COMPLETED ? createdAt : null,
            },
          ],
        },
      },
    });

    for (const { v, qty } of items) {
      await prisma.product.update({
        where: { id: v.productId },
        data: { buyCount: { increment: qty } },
      });
    }
  }
  console.log('✅ Sample orders created (30 days of data).');

  console.log('\n🎉 Seeding complete! Lackey keyboard store data is ready.');
  console.log('\n📋 Summary:');
  console.log(`   • ${categoriesData.length} categories`);
  console.log(`   • ${suppliersData.length} suppliers`);
  console.log(`   • ${brandsData.length} brands`);
  console.log(`   • ${allProducts.length} products with variants`);
  console.log(`   • ${testimonialsData.length} testimonials`);
  console.log(`   • 3 banners`);
  console.log(`   • 3 discount codes`);
  console.log(`   • 30 sample orders`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
