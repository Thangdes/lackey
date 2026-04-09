import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { PaymentModule } from '@/modules/commerce/payments/payment.module';
import { OrderModule } from '@/modules/commerce/orders/order.module';
import { PrismaModule } from '@/infrastructure/database/prisma.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const token = (configService.get<string>('TELEGRAM_BOT_TOKEN') ?? '').trim();
        const webhookUrl = configService.get<string>('TELEGRAM_WEBHOOK_URL');

        if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not defined');

        const telegrafOptions: any = { token };
        if (webhookUrl) {
          telegrafOptions.launchOptions = {
            webhook: {
              domain: webhookUrl,
              hookPath: '/api/v1/telegram-webhook',
            },
          };
        }
        const suffix = token.slice(-4);
        // Minimal log for troubleshooting
        // Using console.log instead of Nest logger because module factory runs before DI logger here
        // eslint-disable-next-line no-console
        console.log(`Telegraf configured. token=****${suffix} webhook=${webhookUrl ? 'on' : 'off'}`);
        return telegrafOptions;
      },
    }),
    PaymentModule,
    OrderModule,
    PrismaModule,
  ],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule { }
