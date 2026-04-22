import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Logger,
  HttpCode,
  Req,
} from '@nestjs/common';
import { SepayWebhookService } from './sepay.service';
import { SepayWebhookDto } from './dto/sepay-webhook.dto';
import type { Request } from 'express';
import { PaymentService } from '../commerce/payments/payment.service';

/**
 * SePay Payment Controller
 * Base route: /payments/sepay
 *
 * Endpoints:
 *  POST /payments/sepay/webhook      — SePay Báo Có webhook (public, API Key auth)
 *  GET  /payments/sepay/qr/:orderId  — Lấy thông tin QR để frontend hiển thị
 *  GET  /payments/sepay/status       — Polling kiểm tra trạng thái thanh toán
 */
@Controller('payments/sepay')
export class SepayController {
  private readonly logger = new Logger(SepayController.name);

  constructor(
    private readonly sepayWebhookService: SepayWebhookService,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * SePay Báo Có Webhook
   *
   * SePay gọi endpoint này khi nhận tiền chuyển khoản vào tài khoản.
   * Bảo mật bằng API Key header: "Authorization: Apikey <key>"
   *
   * Configure tại: https://my.sepay.vn -> Tài khoản -> Webhook
   * Webhook URL: https://<your-domain>/api/v1/payments/sepay/webhook
   */
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Body() payload: SepayWebhookDto,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(
      `SePay Báo Có received | id=${payload.id} | amount=${payload.transferAmount} | content="${payload.content}"`,
    );

    // Xác thực API Key từ header
    const configuredApiKey =
      process.env.SEPAY_WEBHOOK_API_KEY || process.env.SEPAY_SECRET_KEY;

    if (configuredApiKey) {
      const authHeader = req.headers['authorization'];
      const expectedHeader = `Apikey ${configuredApiKey}`;

      if (!authHeader || authHeader !== expectedHeader) {
        this.logger.warn(
          `Unauthorized webhook attempt. Received: "${authHeader}"`,
        );
        // Trả 200 để tránh SePay log lỗi, nhưng không xử lý
        return { success: false, message: 'Unauthorized' };
      }
    } else {
      this.logger.warn(
        'SEPAY_WEBHOOK_API_KEY not configured — webhook is UNPROTECTED!',
      );
    }

    return this.sepayWebhookService.processWebhook(payload);
  }

  /**
   * Polling kiểm tra trạng thái thanh toán.
   * Frontend gọi định kỳ (mỗi 5-10s) để biết khi nào đơn được xác nhận tự động.
   *
   * Query: ?orderCode=CVF-1746450000000
   *
   * Response:
   * - orderStatus: PENDING_CONFIRMATION | CONFIRMED | CANCELED | ...
   * - paymentStatus: PENDING | SUCCESS | FAILED
   * - paidAt: timestamp khi thanh toán thành công (null nếu chưa)
   */
  @Get('status')
  async getPaymentStatus(@Query('orderCode') orderCode: string) {
    if (!orderCode) {
      return { found: false, message: 'orderCode query param is required' };
    }
    return this.sepayWebhookService.getOrderPaymentStatus(orderCode);
  }

  /**
   * SePay Payment Gateway IPN
   * Nhận kết quả giao dịch thanh toán qua SePay Gateway
   */
  @Post('ipn')
  @HttpCode(200)
  async handleIpn(@Body() payload: any) {
    this.logger.log(`SePay IPN received: ${JSON.stringify(payload)}`);
    if (payload && payload.notification_type === 'ORDER_PAID' && payload.order) {
      const invoiceNumber = payload.order.order_invoice_number; // e.g. INV-LK-1778211099340
      if (invoiceNumber) {
        const orderCode = invoiceNumber.replace(/^INV-/, '');
        await this.paymentService.confirmPaymentBySepay({
          orderCode,
          receivedAmount: Number(payload.transaction?.transaction_amount || payload.order.order_amount),
          externalTxnId: payload.transaction?.id || `ipn-${Date.now()}`,
          paidAt: new Date(),
          metadata: {
            ipn: true,
            gateway: payload.transaction?.payment_method || 'SEPAY_LINK',
          }
        });
      }
    }
    return { success: true };
  }

  /**
   * Tạo form checkout SePay
   */
  @Post('create-checkout')
  async createCheckout(
    @Body('orderId') orderId: string,
    @Body('returnUrl') returnUrl: string,
  ) {
    return this.paymentService.createSePayCheckout(orderId, returnUrl);
  }
}
