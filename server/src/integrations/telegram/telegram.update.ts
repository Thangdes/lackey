import { Update, Ctx, Action, Start } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Logger } from '@nestjs/common';
import { PaymentService } from '@/modules/commerce/payments/payment.service';
import { OrderService } from '@/modules/commerce/orders/order.service';
import { TelegramService } from './telegram.service';
import { OrderStatus } from '@prisma/client';

interface ActionContext extends Context {
  match: RegExpExecArray;
}

@Update()
export class TelegramUpdate {
  private readonly logger = new Logger(TelegramUpdate.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
    private readonly telegramService: TelegramService,
  ) { }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply('Chào mừng đến với Bot quản lý đơn hàng BazaarFood!');
  }

  @Action(/confirm_payment:(.+)/)
  async onConfirmPayment(@Ctx() ctx: ActionContext) {
    const orderId = ctx.match[1];
    const username = ctx.from.username || ctx.from.first_name || 'N/A';
    const message = (ctx.callbackQuery as any).message;

    this.logger.log(
      `Received confirmation for order ${orderId} from @${username}`,
    );
    await ctx.answerCbQuery(`Đang xử lý xác nhận cho đơn hàng...`);
    try {
      const confirmedOrder = await this.paymentService.confirmPaymentManually(
        orderId,
        username,
      );
      if (confirmedOrder) {
        const originalMessage =
          this.telegramService.formatOrderMessage(confirmedOrder);
        const escapedUsername = this.telegramService.escapeMarkdownV2(username);
        const newMessage = `${originalMessage}\n\n✅ *Đã xác nhận thanh toán bởi @${escapedUsername}*`;
        await this.telegramService.editMessage(
          message.chat.id,
          message.message_id,
          newMessage,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to confirm payment for order ${orderId}`,
        error,
      );
      await ctx.reply(
        `⚠️ Lỗi khi xác nhận đơn hàng \`${this.telegramService.escapeMarkdownV2(orderId)}\`:\n${this.telegramService.escapeMarkdownV2(error.message)}`,
        { parse_mode: 'MarkdownV2' },
      );
    }
  }

  @Action(/cancel_order:(.+)/)
  async onCancelOrder(@Ctx() ctx: ActionContext) {
    const orderId = ctx.match[1];
    const username = ctx.from.username || ctx.from.first_name || 'N/A';
    const message = (ctx.callbackQuery as any).message;

    await ctx.answerCbQuery('Đang xử lý hủy đơn hàng...');
    try {
      await this.orderService.updateStatus(orderId, {
        status: OrderStatus.CANCELED,
      });
      const escapedUsername = this.telegramService.escapeMarkdownV2(username);
      const orderCode = (await this.orderService.findOne(orderId)).orderCode;
      const newMessage = `❌ *Đơn hàng \`${this.telegramService.escapeMarkdownV2(orderCode)}\` đã được hủy bởi @${escapedUsername}*`;
      await this.telegramService.editMessage(
        message.chat.id,
        message.message_id,
        newMessage,
      );
    } catch (error) {
      this.logger.error(`Failed to cancel order ${orderId}`, error);
      await ctx.reply(
        `⚠️ Lỗi khi hủy đơn hàng \`${orderId}\`:\n${error.message}`,
      );
    }
  }

  @Action(/ship_order:(.+)/)
  async onShipOrder(@Ctx() ctx: ActionContext) {
    const orderId = ctx.match[1];
    const username = ctx.from.username || ctx.from.first_name || 'N/A';
    const message = (ctx.callbackQuery as any).message;

    await ctx.answerCbQuery('Đang xử lý chuẩn bị hàng...');
    try {
      await this.orderService.prepareForShipment(orderId);
      const detailedOrder = await this.orderService.findOne(orderId);
      const originalMessage =
        this.telegramService.formatOrderMessage(detailedOrder);
      const escapedUsername = this.telegramService.escapeMarkdownV2(username);
      const newMessage = `${originalMessage}\n\n🚚 *Đang chuẩn bị hàng \\(xác nhận bởi @${escapedUsername}\\)*`;
      await this.telegramService.editMessage(
        message.chat.id,
        message.message_id,
        newMessage,
      );
    } catch (error) {
      this.logger.error(
        `Failed to prepare shipment for order ${orderId}`,
        error,
      );
      await ctx.reply(
        `⚠️ Lỗi khi chuẩn bị đơn hàng \`${orderId}\`:\n${error.message}`,
      );
    }
  }
}
