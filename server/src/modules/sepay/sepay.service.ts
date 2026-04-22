import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PaymentStatus } from '@prisma/client';
import { SepayWebhookDto, ParsedOrderContent } from './dto/sepay-webhook.dto';
import { PaymentService } from '../commerce/payments/payment.service';

export interface WebhookProcessResult {
  success: boolean;
  message: string;
}

@Injectable()
export class SepayWebhookService {
  private readonly logger = new Logger(SepayWebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * Xử lý SePay Báo Có Webhook.
   * SePay gọi endpoint này mỗi khi nhận tiền chuyển khoản vào tài khoản.
   *
   * Luồng:
   * 1. Bỏ qua giao dịch "out" (tiền ra)
   * 2. Idempotency: skip nếu externalTxnId đã tồn tại
   * 3. Parse nội dung → tìm mã đơn hàng (VD: CVF-1746450000000)
   * 4. Tìm đơn hàng + Payment(PENDING) theo orderCode
   * 5. Kiểm tra số tiền khớp (tolerance ±5000 VND)
   * 6. Transaction: Payment → SUCCESS, Order → CONFIRMED, tạo Invoice
   * 7. Emit sự kiện gửi email + Telegram
   */
  async processWebhook(payload: SepayWebhookDto): Promise<WebhookProcessResult> {
    this.logger.log(
      `Received SePay webhook | txn=${payload.id} | amount=${payload.transferAmount} | type=${payload.transferType}`,
    );

    // 1. Chỉ xử lý tiền vào
    if (payload.transferType !== 'in') {
      return { success: true, message: 'Outgoing transfer ignored' };
    }

    const externalTxnId = String(payload.id);

    // 2. Idempotency — tránh xử lý trùng
    const alreadyProcessed = await this.prisma.payment.findFirst({
      where: { externalTxnId },
    });
    if (alreadyProcessed) {
      this.logger.warn(`Transaction ${externalTxnId} already processed. Skipping.`);
      return { success: true, message: 'Already processed' };
    }

    // 3. Parse nội dung chuyển khoản → tìm mã đơn hàng
    const parsed = this.parseOrderContent(payload.content);
    if (!parsed) {
      this.logger.warn(
        `No order code found in transfer content: "${payload.content}"`,
      );
      // Trả về success=true để SePay không retry (giao dịch không liên quan đến hệ thống)
      return { success: true, message: 'No matching order code in content' };
    }

    this.logger.log(`Parsed order code: ${parsed.orderCode} from content: "${payload.content}"`);

    const paidAt = payload.transactionDate ? new Date(payload.transactionDate) : undefined;

    try {
      return await this.paymentService.confirmPaymentBySepay({
        orderCode: parsed.orderCode,
        receivedAmount: payload.transferAmount,
        externalTxnId,
        paidAt,
        metadata: {
          gateway: payload.gateway,
          referenceCode: payload.referenceCode,
          transferContent: payload.content,
          accountNumber: payload.accountNumber,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error processing webhook for order ${parsed.orderCode}:`,
        error,
      );
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal error',
      };
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán của đơn hàng.
   * Frontend polling dùng endpoint này để biết khi nào đơn được xác nhận.
   */
  async getOrderPaymentStatus(orderCode: string) {
    const order = await this.prisma.order.findFirst({
      where: { orderCode },
      include: {
        payments: {
          select: {
            id: true,
            status: true,
            paidAt: true,
            amount: true,
            method: true,
          },
        },
      },
    });

    if (!order) {
      return { found: false, orderCode, orderStatus: null, paymentStatus: null };
    }

    const latestPayment = order.payments[order.payments.length - 1] || null;

    return {
      found: true,
      orderId: order.id,
      orderCode: order.orderCode,
      orderStatus: order.status,
      paymentStatus: latestPayment?.status ?? null,
      paidAt: latestPayment?.paidAt ?? null,
      amount: latestPayment?.amount ?? null,
    };
  }

  // --------------- PRIVATE HELPERS ---------------

  /**
   * Parse nội dung chuyển khoản để tìm mã đơn hàng.
   * Hỗ trợ format: "CVF-1746450000000" hoặc bất kỳ vị trí nào trong chuỗi.
   * Mã đơn hàng được tạo theo pattern: CVF-<timestamp>
   */
  private parseOrderContent(content: string): ParsedOrderContent | null {
    if (!content) return null;

    // Match "LK-" theo sau là ít nhất 10 chữ số
    const pattern = /\b(LK-\d{10,})\b/i;
    const match = content.match(pattern);

    if (!match) return null;

    return { orderCode: match[1].toUpperCase() };
  }
}
