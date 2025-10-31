const {
  PrismaClient,
  UserRole,
} = require('@prisma/client');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const randomCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

async function main() {
  console.log('Start seeding ...');

  // Optional destructive reset for local/dev only
  if (String(process.env.ALLOW_DESTRUCTIVE_SEED).toLowerCase() === 'true') {
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

  // basic CMS pages
  await prisma.cmsPage.createMany({
    data: [
      { title: 'Về Chúng Tôi', slug: 'about-us', isPublished: true },
      { title: 'Chính Sách Đổi Trả', slug: 'return-policy', isPublished: true },
    ],
  }).catch(() => undefined);

  // Seed default SiteContent (banners & testimonials) if empty
  const existingBannerCount = await prisma.siteContent.count({ where: { type: 'BANNER' } });
  if (existingBannerCount === 0) {
    await prisma.siteContent.createMany({
      data: [
        {
          type: 'BANNER',
          title: 'Fresh Fruits Delivered',
          thumbnailUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=1200&h=400&fit=crop',
          linkUrl: '/',
          displayOrder: 1,
          isPublished: true,
        },
        {
          type: 'BANNER',
          title: 'Weekly Specials',
          thumbnailUrl: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=1200&h=400&fit=crop',
          linkUrl: '/',
          displayOrder: 2,
          isPublished: true,
        },
      ],
    }).catch(() => undefined);
  }

  const existingTestimonialCount = await prisma.siteContent.count({ where: { type: 'TESTIMONIAL' } });
  if (existingTestimonialCount === 0) {
    await prisma.siteContent.createMany({
      data: [
        {
          type: 'TESTIMONIAL',
          title: 'Great quality!',
          content: 'Rau củ quả tươi và giao nhanh.',
          authorName: 'Chị Lan',
          authorTitle: 'Khách hàng',
          displayOrder: 1,
          isPublished: true,
        },
      ],
    }).catch(() => undefined);
  }

  // Seed products from FE JSON if enabled
  if (String(process.env.SEED_SAMPLE_DATA).toLowerCase() === 'true') {
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
      where: { name: 'Imported Supplier' },
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
      path.resolve(__dirname, '../../cvf-client/src/data/products.json'),
      path.resolve(__dirname, '../../../cvf-client/src/data/products.json'),
      path.resolve(process.cwd(), '../cvf-client/src/data/products.json'),
      path.resolve(__dirname, '../../cvf-client/data/products.json'),
      path.resolve(__dirname, '../../../cvf-client/data/products.json'),
      path.resolve(process.cwd(), '../cvf-client/data/products.json'),
    ];

    let productsRaw = null;
    let usedPath = null;
    for (const p of candidatePaths) {
      try {
        if (fs.existsSync(p)) {
          productsRaw = fs.readFileSync(p, 'utf-8');
          usedPath = p;
          break;
        }
      } catch (e) {
        // try next
      }
    }

    if (!productsRaw) {
      console.warn('FE products.json not found. Skipping product seeding.');
    } else {
      /** @type {Array<any>} */
      const feProducts = JSON.parse(productsRaw);
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
              category: { connect: { id: importedCategory.id } },
              supplier: { connect: { id: importedSupplier.id } },
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
          console.warn(`Skip product slug=${item.slug}: ${err.message}`);
        }
      }
      console.log(`Products seeded from FE JSON (${usedPath}).`);
    }
  } else {
    console.log('SEED_SAMPLE_DATA!=true. Skipping FE product seeding.');
  }

  // Ensure Admin user exists (idempotent)
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.log('ADMIN_USERNAME/ADMIN_PASSWORD not provided. Skipping admin bootstrap.');
  } else {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await prisma.user.upsert({
      where: { username: ADMIN_USERNAME },
      update: {},
      create: {
        username: ADMIN_USERNAME,
        password: hashed,
        role: UserRole.ADMIN,
        customer: ADMIN_EMAIL ? { create: { email: ADMIN_EMAIL, fullName: 'Admin' } } : undefined,
      },
    });
  }


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
