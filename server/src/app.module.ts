import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './integrations/cloudinary/cloudinary.module';
import { MailModule } from './integrations/mail/mail.module';
import { CmspageModule } from './modules/content/cms-pages/cmspage.module';
import { CategoryModule } from './modules/products/categories/category.module';
import { ProductModule } from './modules/products/products/product.module';
import { CustomerModule } from './modules/customers/customer.module';
import { CartModule } from './modules/commerce/cart/cart.module';
import { OrderModule } from './modules/commerce/orders/order.module';
import { PaymentModule } from './modules/commerce/payments/payment.module';
import { PdfModule } from './integrations/pdf/pdf.module';
// import { TelegramModule } from './integrations/telegram/telegram.module';
// import { WorkersModule } from './infrastructure/workers/workers.module';
import { ShippingModule } from './modules/commerce/shipping/shipping.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './infrastructure/schedulers/tasks.module';
import { DashboardModule } from './modules/dashboards/customer-dashboard/dashboard.module';
import { RatingModule } from './modules/content/ratings/rating.module';
import { DiscountModule } from './modules/commerce/discounts/discount.module';
import { PostModule } from './modules/content/posts/post.module';
import { HealthController } from './health.controller';
import { SupplierDashboardModule } from './modules/dashboards/supplier-dashboard/supplier-dashboard.module';
import { SupplierModule } from './modules/admin/suppliers/supplier.module';
import { SiteContentModule } from './modules/content/site-content/site-content.module';
import { CacheModule } from '@nestjs/cache-manager';
// import { GhnModule } from './integrations/ghn/ghn.module';
import { LoggerModule } from './infrastructure/common/logger/logger.module';
import { SiteSettingsModule } from './modules/content/site-settings/site-settings.module';
import { InventoryModule } from './modules/commerce/inventory/inventory.module';
import { WishlistModule } from './modules/commerce/wishlist/wishlist.module';
import { AttributeModule } from './modules/products/attributes/attribute.module';
import { BrandModule } from './modules/products/brands/brand.module';
import { TagModule } from './modules/products/tags/tag.module';
import { SepayModule } from './modules/sepay/subscription.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.docker'],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: Number(process.env.CACHE_TTL_SECONDS) || 60 * 60 * 24, // default 1 day
      // Using memory store instead of Redis to reduce Redis commands
      // If you need Redis cache, install @nestjs/cache-manager/redis and configure it
    }),
    // GhnModule,
    LoggerModule,
    PrismaModule,
    AuthModule,
    CloudinaryModule,
    MailModule,
    CmspageModule,
    CategoryModule,
    ProductModule,
    CustomerModule,
    CartModule,
    OrderModule,
    PaymentModule,
    PdfModule,
    ShippingModule,
    TasksModule,
    DashboardModule,
    RatingModule,
    DiscountModule,
    PostModule,
    SupplierDashboardModule,
    SupplierModule,
    SiteContentModule,
    SiteSettingsModule,
    InventoryModule,
    WishlistModule,
    AttributeModule,
    BrandModule,
    TagModule,
    SepayModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
