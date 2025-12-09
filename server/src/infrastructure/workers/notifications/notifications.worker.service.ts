import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { TelegramService } from '@/integrations/telegram/telegram.service';
import { PaymentService } from '@/modules/commerce/payments/payment.service';
import { OrderService } from '@/modules/commerce/orders/order.service';
import { OrderStatus } from '@prisma/client';

@Processor('notifications')
export class NotificationsWorkerService extends WorkerHost {
  private readonly logger = new Logger(NotificationsWorkerService.name);

  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
    private paymentService: PaymentService,
    private orderService: OrderService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data:`,
      job.data,
    );

    switch (job.name) {
      case 'send-new-order-telegram':
        return this.handleSendTelegramNotification(job.data.orderId);
      case 'confirm-payment-telegram':
        return this.handleConfirmPayment(job.data);
      case 'cancel-order-telegram':
        return this.handleCancelOrder(job.data);
      case 'prepare-shipment-telegram':
        return this.handlePrepareShipment(job.data);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleSendTelegramNotification(orderId: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { customer: true, payments: true, shippingAddress: true },
      });

      if (!order) {
        throw new Error(`Order with ID ${orderId} not found for notification.`);
      }

      await this.telegramService.sendNewOrderNotification(order);
      this.logger.log(
        `Successfully sent Telegram notification for order ${order.orderCode}`,
      );
    } catch (error) {
      this.logger.error(
        `Worker failed to send Telegram notification for order ${orderId}`,
        error,
      );
      throw error;
    }
  }

  private async handleConfirmPayment(data: {
    orderId: string;
    username: string;
    messageId: number;
    chatId: number;
  }) {
    const { orderId, username, messageId, chatId } = data;
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

        await this.telegramService.editMessage(chatId, messageId, newMessage);
      }
    } catch (error) {
      this.logger.error(
        `Worker failed to confirm payment for order ${orderId}`,
        error.message,
      );
      const errorMessage = `⚠️ Lỗi khi xác nhận đơn hàng \`${this.telegramService.escapeMarkdownV2(orderId)}\`:\n${this.telegramService.escapeMarkdownV2(error.message)}`;
      await this.telegramService.sendTextMessage(errorMessage);

      throw error;
    }
  }

  private async handleCancelOrder(data: {
    orderId: string;
    username: string;
    messageId: number;
    chatId: number;
  }) {
    const { orderId, username, messageId, chatId } = data;
    try {
      const canceledOrder = await this.orderService.updateStatus(orderId, {
        status: OrderStatus.CANCELED,
      });

      const escapedUsername = this.telegramService.escapeMarkdownV2(username);
      const newMessage = `❌ *Đơn hàng \`${this.telegramService.escapeMarkdownV2(canceledOrder.orderCode)}\` đã được hủy bởi @${escapedUsername}*`;
      await this.telegramService.editMessage(chatId, messageId, newMessage);
    } catch (error) {
      this.logger.error(
        `Worker failed to cancel order ${orderId}`,
        error.message,
      );
      const errorMessage = `⚠️ Lỗi khi hủy đơn hàng \`${this.telegramService.escapeMarkdownV2(orderId)}\`:\n${this.telegramService.escapeMarkdownV2(error.message)}`;
      await this.telegramService.sendTextMessage(errorMessage);

      throw error;
    }
  }

  private async handlePrepareShipment(data: {
    orderId: string;
    username: string;
    messageId: number;
    chatId: number;
  }) {
    const { orderId, username, messageId, chatId } = data;
    try {
      await this.orderService.prepareForShipment(orderId);

      const detailedOrder = await this.orderService.findOne(orderId);
      const originalMessage =
        this.telegramService.formatOrderMessage(detailedOrder);
      const escapedUsername = this.telegramService.escapeMarkdownV2(username);
      const newMessage = `${originalMessage}\n\n🚚 *Đang chuẩn bị hàng \\(xác nhận bởi @${escapedUsername}\\)*`;
      await this.telegramService.editMessage(chatId, messageId, newMessage);
    } catch (error) {
      this.logger.error(
        `Worker failed to prepare shipment for order ${orderId}`,
        error.message,
      );
      const errorMessage = `⚠️ Lỗi khi chuẩn bị đơn hàng \`${this.telegramService.escapeMarkdownV2(orderId)}\`:\n${this.telegramService.escapeMarkdownV2(error.message)}`;
      await this.telegramService.sendTextMessage(errorMessage);

      throw error;
    }
  }
}
