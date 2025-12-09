import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Markup, Telegraf } from 'telegraf';
import { PaymentMethod, Prisma } from '@prisma/client';
import { InjectBot } from 'nestjs-telegraf';

export type OrderForNotification = {
  id: string;
  orderCode: string;
  totalAmount: Prisma.Decimal | number;
  customer: {
    fullName: string;
    phone: string | null;
  };
  shippingAddress?: {
    recipientName: string | null;
    phoneNumber: string | null;
  } | null;
  payments: {
    method: PaymentMethod;
  }[];
};

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly chatId: string;
  private readonly enabled: boolean;

  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private configService: ConfigService,
  ) {
    const rawChatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    this.chatId = (rawChatId ?? '').trim();
    const token = (this.configService.get<string>('TELEGRAM_BOT_TOKEN') ?? '').trim();
    this.enabled = !!this.chatId && !!token;
    const tokenSuffix = token ? token.slice(-6) : 'unknown';
    if (this.enabled) {
      this.logger.log(
        `Telegram configured. chat_id="${this.chatId}", token=***${tokenSuffix}`,
      );
    } else {
      this.logger.warn('Telegram disabled: missing TELEGRAM_CHAT_ID or TELEGRAM_BOT_TOKEN.');
    }
  }

  public escapeMarkdownV2(text: string): string {
    if (!text) return '';
    const reservedChars = /[\\`*_[\]()~>#+\-=|{}.!]/g;
    return text.replace(reservedChars, '\\$&');
  }

  public formatOrderMessage(order: OrderForNotification): string {
    const payment = order.payments[0];
    const rawPaymentInfo =
      payment.method === PaymentMethod.COD
        ? 'Thu hộ (COD)'
        : 'Chuyển khoản (Đang chờ)';
    const escapedPaymentInfo = this.escapeMarkdownV2(rawPaymentInfo);
    const escapedOrderCode = this.escapeMarkdownV2(order.orderCode);
    const displayFullName = (order.customer?.fullName?.trim?.() || order.shippingAddress?.recipientName || '').trim();
    const displayPhone = (order.customer?.phone?.trim?.() || order.shippingAddress?.phoneNumber || '').trim();
    const escapedFullName = this.escapeMarkdownV2(displayFullName);
    const escapedPhone = this.escapeMarkdownV2(displayPhone);
    const escapedTotalAmount = this.escapeMarkdownV2(
      Number(order.totalAmount).toLocaleString('vi-VN'),
    );
    return `🔔 *ĐƠN HÀNG MỚI* \`${escapedOrderCode}\`

👤 *Khách hàng:* ${escapedFullName || 'N/A'}
📞 *SĐT:* ${escapedPhone || 'N/A'}
💰 *Tổng tiền:* ${escapedTotalAmount} VND
💳 *Thanh toán:* ${escapedPaymentInfo}
`;
  }

  async sendNewOrderNotification(order: OrderForNotification) {
    if (!this.enabled) {
      this.logger.warn('sendNewOrderNotification skipped: Telegram disabled.');
      return;
    }
    const message = this.formatOrderMessage(order);
    const payment = order.payments[0];
    const keyboard =
      payment.method === PaymentMethod.VIETQR
        ? Markup.inlineKeyboard([
            Markup.button.callback(
              '✅ Xác nhận đã thanh toán',
              `confirm_payment:${order.id}`,
            ),
            Markup.button.callback('❌ Hủy đơn', `cancel_order:${order.id}`),
          ])
        : Markup.inlineKeyboard([
            Markup.button.callback(
              '🚚 Chuẩn bị hàng',
              `ship_order:${order.id}`,
            ),
            Markup.button.callback('❌ Hủy đơn', `cancel_order:${order.id}`),
          ]);
    try {
      await this.bot.telegram.sendMessage(this.chatId, message, {
        ...keyboard,
        parse_mode: 'MarkdownV2',
      });
      this.logger.log(`Sent new order notification for ${order.orderCode}`);
    } catch (error) {
      this.logger.error(
        `Failed to send Telegram message for order ${order.orderCode} (chat_id=${this.chatId})`,
        error?.description || error?.message || String(error),
      );
      throw error;
    }
  }

  async editMessage(chatId: number, messageId: number, newText: string) {
    if (!this.enabled) {
      this.logger.warn('editMessage skipped: Telegram disabled.');
      return;
    }
    try {
      await this.bot.telegram.editMessageText(
        chatId,
        messageId,
        undefined,
        newText,
        {
          parse_mode: 'MarkdownV2',
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to edit message ${messageId}`,
        error?.description || error?.message || String(error),
      );
      throw error;
    }
  }

  async sendTextMessage(text: string) {
    if (!this.enabled) {
      this.logger.warn('sendTextMessage skipped: Telegram disabled.');
      return;
    }
    try {
      await this.bot.telegram.sendMessage(this.chatId, text, {
        parse_mode: 'MarkdownV2',
      });
    } catch (error) {
      this.logger.error(
        `Failed to send text message: "${text}" (chat_id=${this.chatId})`,
        error?.description || error?.message || String(error),
      );
    }
  }
}
