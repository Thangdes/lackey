import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';
import { CmspageModule } from './cmspage/cmspage.module';
import { CategoryModule } from './product/category/category.module';
import { ProductModule } from './product/product/product.module';
import { CustomerModule } from './customer/customer.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { PdfModule } from './pdf/pdf.module';
import { TelegramModule } from './telegram/telegram.module';
import { WorkersModule } from './workers/workers.module';
import { ShippingModule } from './shipping/shipping.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RatingModule } from './rating/rating.module';
import { DiscountModule } from './discount/discount.module';
import { PostModule } from './post/post.module';
import { HealthController } from './health.controller';
import { SupplierDashboardModule } from './supplier-dashboard/supplier-dashboard.module';
import { SupplierModule } from './admin/supplier/supplier.module';
import { SiteContentModule } from './site-content/site-content.module';
import { CacheModule } from '@nestjs/cache-manager';
import { GhnModule } from './ghn/ghn.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.docker'] }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 24,
    }),
    GhnModule,
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
    TelegramModule,
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
  ],
  controllers: [HealthController],
})
export class AppModule {}
