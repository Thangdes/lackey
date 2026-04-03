import {
  PrismaClient,
  UserRole,
  PaymentMethod,
  PaymentStatus,
  OrderStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const randomCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

async function main() {
  console.log('Start seeding ...');

  const allowDestructive = String(process.env.ALLOW_DESTRUCTIVE_SEED).toLowerCase() === 'true';
  if (allowDestructive) {
    await prisma.rating.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.address.deleteMany();
    await prisma.token.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.category.deleteMany();
    await prisma.cmsPage.deleteMany();
    console.log('Old data deleted.');
  } else {
    console.log('Skipping destructive delete (ALLOW_DESTRUCTIVE_SEED!=true).');
  }

  await prisma.cmsPage.createMany({
    data: [
      { title: 'Về Chúng Tôi', slug: 'about-us', isPublished: true },
      { title: 'Chính Sách Đổi Trả', slug: 'return-policy', isPublished: true },
    ],
  });
  console.log('CMS Pages created.');
  // Seed products from FE JSON if enabled
  const seedSample = String(process.env.SEED_SAMPLE_DATA).toLowerCase() === 'true';
  if (seedSample) {
    // Ensure default category exists
    const importedCategory = await prisma.category.upsert({
      where: { slug: 'imported' },
      update: {},
      create: {
        name: 'Imported',
        slug: 'imported',
        description: 'Imported from FE products.json',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=450&h=338&fit=crop',
      },
    });

    const importedSupplier = await prisma.supplier.upsert({
      where: { email: 'imported@supplier.local' },
      update: {},
      create: {
        name: 'Imported Supplier',
        email: 'imported@supplier.local',
        phone: '0000000000',
        address: 'N/A',
        isActive: true,
      },
    });

    const candidatePaths = [
      // Common monorepo layouts
      path.resolve(__dirname, '../../cvf-client/src/data/products.json'),
      path.resolve(__dirname, '../../../cvf-client/src/data/products.json'),
      path.resolve(process.cwd(), '../cvf-client/src/data/products.json'),
      // Actual location in this repo: cvf-client/cvf-client/data/products.json
      path.resolve(__dirname, '../../cvf-client/data/products.json'),
      path.resolve(__dirname, '../../../cvf-client/data/products.json'),
      path.resolve(process.cwd(), '../cvf-client/data/products.json'),
      // New paths for client folder
      path.resolve(__dirname, '../../client/data/products.json'),
      path.resolve(__dirname, '../../../client/data/products.json'),
      path.resolve(process.cwd(), '../client/data/products.json'),
    ];

    let productsRaw: string | null = null;
    let productsPathUsed: string | null = null;
    for (const p of candidatePaths) {
      try {
        if (fs.existsSync(p)) {
          productsRaw = fs.readFileSync(p, 'utf-8');
          productsPathUsed = p;
          break;
        }
      } catch (e) {
        // continue trying next path
      }
    }

    if (!productsRaw) {
      console.warn('FE products.json not found. Skipping product seeding.');
    } else {
      const feProducts: Array<{
        name: string;
        slug: string;
        description?: string;
        thumbnailUrl?: string;
        buyCount?: number;
        ratingAvg?: number;
        ratingCount?: number;
        variants?: Array<{
          name: string;
          sku?: string;
          price: number;
          discountPrice?: number;
          stockQuantity?: number;
        }>;
      }> = JSON.parse(productsRaw);

      for (const item of feProducts) {
        try {
          await prisma.product.upsert({
            where: { slug: item.slug },
            update: {},
            create: {
              name: item.name,
              slug: item.slug,
              description: item.description || '',
              thumbnailUrl: item.thumbnailUrl || '',
              category: {
                connect: { id: importedCategory.id },
              },
              supplier: {
                connect: { id: importedSupplier.id },
              },
              initialBuyCount: 0,
              buyCount: item.buyCount ?? 0,
              ratingAvg: item.ratingAvg ?? 0,
              ratingCount: item.ratingCount ?? 0,
              variants: item.variants && item.variants.length
                ? {
                    create: item.variants.map((v, idx) => ({
                      name: v.name || `Variant ${idx + 1}`,
                      sku: v.sku || `${item.slug}-${randomCode()}`,
                      price: v.price,
                      discountPrice: v.discountPrice,
                      stockQuantity: v.stockQuantity ?? 0,
                    })),
                  }
                : undefined,
            },
          });
        } catch (err) {
          console.warn(`Skip product slug=${item.slug}: ${(err as Error).message}`);
        }
      }
      console.log(`Products seeded from FE JSON (${productsPathUsed}).`);
    }
  } else {
    console.log('SEED_SAMPLE_DATA!=true. Skipping FE product seeding.');
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordRaw = process.env.ADMIN_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hatx.com';
  if (!adminUsername || !adminPasswordRaw) {
    console.log('ADMIN_USERNAME/ADMIN_PASSWORD not provided. Skipping admin bootstrap.');
  } else {
    const adminPassword = await bcrypt.hash(adminPasswordRaw, 10);
    await prisma.user.upsert({
      where: { username: adminUsername },
      update: {},
      create: {
        username: adminUsername,
        password: adminPassword,
        role: UserRole.ADMIN,
        customer: {
          create: {
            email: adminEmail,
            fullName: 'Admin',
          },
        },
      },
    });
  }

  const customerAPassword = await bcrypt.hash('User@123', 10);
  const customerA = await prisma.customer.create({
    data: {
      email: 'customer.a@example.com',
      fullName: 'Khách Hàng A',
      phone: '0123456789',
      user: {
        create: {
          username: 'customera',
          password: customerAPassword,
        },
      },
    },
  });

  const customerB = await prisma.customer.create({
    data: {
      email: 'customer.b@example.com',
      fullName: 'Khách Hàng B (Guest)',
      phone: '0987654321',
    },
  });
  console.log('Customers and Users created.');
  // ------------------------------------------------------------
  // Seed Supplier, Supplier User, Products, and Sample Orders
  // ------------------------------------------------------------
  const supplierPassword = await bcrypt.hash(process.env.SUPPLIER_PASSWORD || 'Supplier@123', 10);
  const demoSupplier = await prisma.supplier.upsert({
    where: { name: 'Demo Supplier' },
    update: {},
    create: {
      name: 'Demo Supplier',
      email: 'supplier.demo@example.com',
      phone: '0912000111',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { username: 'supplier.demo@example.com' },
    update: {},
    create: {
      username: 'supplier.demo@example.com',
      password: supplierPassword,
      role: UserRole.SUPPLIER,
      supplier: { connect: { id: demoSupplier.id } },
    },
  });

  // Ensure a category for demo supplier products
  const demoCategory = await prisma.category.upsert({
    where: { slug: 'fruits' },
    update: {},
    create: {
      name: 'Fruits',
      slug: 'fruits',
      description: 'Fresh fruits',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1547514701-42782101795e?w=450&h=338&fit=crop',
    },
  });

  // Create a few demo products/variants for the supplier
  const productA = await prisma.product.create({
    data: {
      name: 'Táo đỏ Mỹ',
      slug: 'tao-do-my-demo',
      description: 'Táo đỏ tươi ngon',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=480&h=360&fit=crop',
      category: { connect: { id: demoCategory.id } },
      supplier: { connect: { id: demoSupplier.id } },
      initialBuyCount: 0,
      buyCount: 0,
      variants: {
        create: [
          { name: '1kg', sku: `TAO1KG-${randomCode()}`, price: 85000, stockQuantity: 30 },
          { name: '2kg', sku: `TAO2KG-${randomCode()}`, price: 160000, stockQuantity: 20 },
        ],
      },
    },
    include: { variants: true },
  });

  const productB = await prisma.product.create({
    data: {
      name: 'Cam vàng',
      slug: 'cam-vang-demo',
      description: 'Cam vàng mọng nước',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=480&h=360&fit=crop',
      category: { connect: { id: demoCategory.id } },
      supplier: { connect: { id: demoSupplier.id } },
      initialBuyCount: 0,
      buyCount: 0,
      variants: {
        create: [
          { name: '1kg', sku: `CAM1KG-${randomCode()}`, price: 65000, stockQuantity: 25 },
          { name: '3kg', sku: `CAM3KG-${randomCode()}`, price: 180000, stockQuantity: 10 },
        ],
      },
    },
    include: { variants: true },
  });

  const productC = await prisma.product.create({
    data: {
      name: 'Xoài cát Hòa Lộc',
      slug: 'xoai-cat-hoa-loc-demo',
      description: 'Xoài ngọt thơm đặc sản',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1615485737656-cf5f1b593056?w=480&h=360&fit=crop',
      category: { connect: { id: demoCategory.id } },
      supplier: { connect: { id: demoSupplier.id } },
      initialBuyCount: 0,
      buyCount: 0,
      variants: {
        create: [
          { name: '1kg', sku: `XOAI1KG-${randomCode()}`, price: 99000, stockQuantity: 18 },
          { name: '5kg', sku: `XOAI5KG-${randomCode()}`, price: 460000, stockQuantity: 6 },
        ],
      },
    },
    include: { variants: true },
  });

  const productD = await prisma.product.create({
    data: {
      name: 'Nho đỏ không hạt',
      slug: 'nho-do-khong-hat-demo',
      description: 'Nho đỏ tươi, ngọt',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=480&h=360&fit=crop',
      category: { connect: { id: demoCategory.id } },
      supplier: { connect: { id: demoSupplier.id } },
      initialBuyCount: 0,
      buyCount: 0,
      variants: {
        create: [
          { name: '500g', sku: `NHO500G-${randomCode()}`, price: 75000, stockQuantity: 40 },
          { name: '1kg', sku: `NHO1KG-${randomCode()}`, price: 140000, stockQuantity: 20 },
        ],
      },
    },
    include: { variants: true },
  });

  const demoVariants = [
    ...productA.variants,
    ...productB.variants,
    ...productC.variants,
    ...productD.variants,
  ];

  // Create a default shipping address for customer A if none
  let addressA = await prisma.address.findFirst({ where: { customerId: customerA.id } });
  if (!addressA) {
    addressA = await prisma.address.create({
      data: {
        customerId: customerA.id,
        recipientName: 'Khách Hàng A',
        phoneNumber: '0123456789',
        street: '456 Đường XYZ',
        ward: 'Phường 1',
        district: 'Quận 3',
        city: 'TP.HCM',
        fullAddress: '456 Đường XYZ, Phường 1, Quận 3, TP.HCM',
        isDefault: true,
      },
    });
  }

  // Helper to create orders across the last 30 days to populate revenue chart
  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };

  // Generate 30 orders (one per day) for smoother revenue chart
  for (let day = 0; day < 30; day++) {
    const createdAt = daysAgo(29 - day);
    const orderCode = `OD${randomCode()}`;
    // pick 1-3 line items
    const lineCount = 1 + (day % 3); // 1..3
    const items: Array<{ v: typeof demoVariants[number]; qty: number }> = [];
    for (let i = 0; i < lineCount; i++) {
      const v = demoVariants[(day + i * 2) % demoVariants.length];
      const qty = 1 + ((day + i) % 3); // 1..3
      items.push({ v, qty });
    }
    let subtotal = 0;
    for (const it of items) subtotal += Number(it.v.price) * it.qty;
    const shippingFee = 20000;
    const total = subtotal + shippingFee;

    // rotate status for variety
    const statusCycle = [
      OrderStatus.PENDING_CONFIRMATION,
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING_SHIPMENT,
      OrderStatus.SHIPPED,
      OrderStatus.COMPLETED,
    ];
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
            priceAtPurchase: Number(v.price),
          })),
        },
        payments: {
          create: [
            {
              method: PaymentMethod.COD,
              amount: total,
              status: PaymentStatus.SUCCESS,
              paidAt: createdAt,
            },
          ],
        },
      },
    });

    // bump buyCount for each affected product
    for (const { v, qty } of items) {
      const prod = await prisma.product.findUnique({ where: { id: v.productId } });
      if (prod) {
        await prisma.product.update({ where: { id: prod.id }, data: { buyCount: prod.buyCount + qty } });
      }
    }
  }
  console.log('Demo supplier, user, products, and sample orders created.');
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
