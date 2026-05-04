import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
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
import { WorkersModule } from './infrastructure/workers/workers.module';
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

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.docker'] }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 24,
    }),
    // GhnModule,
    LoggerModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
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
    // TelegramModule,
    WorkersModule,
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
  ],
  controllers: [HealthController],
})
export class AppModule { }
