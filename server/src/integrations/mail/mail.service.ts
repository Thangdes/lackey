import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Order,
  Customer,
  Address,
  OrderItem,
  ProductVariant,
  Payment,
  Discount,
} from '@prisma/client';

export type OrderDetailsForEmail = Order & {
  customer: Customer;
  shippingAddress: Address;
  orderItems: (OrderItem & { productVariant: ProductVariant })[];
  payments: Payment[];
  discount: Discount | null;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendInvoiceEmail(to: string, order: OrderDetailsForEmail) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `Hóa đơn cho đơn hàng #${order.orderCode} từ Hạt Trường Xuân Ltd`,
        template: './invoice',
        context: order,
      });
      this.logger.log(
        `Invoice email sent successfully to ${to} for order ${order.orderCode}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send invoice email to ${to}`, error.stack);
      throw error;
    }
  }

  async sendOrderShippedEmail(
    to: string,
    order: { orderCode: string; deliveryCode: string; fullName: string },
  ) {
    const trackingUrl = `https://tramavandon.com/spx/`;

    await this.mailerService.sendMail({
      to,
      subject: `Đơn hàng #${order.orderCode} của bạn đã được giao đi!`,
      template: './order-shipped',
      context: {
        fullName: order.fullName,
        orderCode: order.orderCode,
        deliveryCode: order.deliveryCode,
        trackingUrl: trackingUrl,
      },
    });
  }

  async sendSupplierWelcomeEmail(
    to: string,
    data: {
      supplierName: string;
      username: string;
      temporaryPassword: string;
    },
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: `Chào mừng bạn đến với Hạt Trường Xuân Ltd - Thông tin tài khoản nhà cung cấp`,
        template: './supplier-welcome',
        context: {
          ...data,
          year: new Date().getFullYear(),
        },
      });
      this.logger.log(`Supplier welcome email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send supplier welcome email to ${to}`,
        error.stack,
      );
      throw error;
    }
  }
}
