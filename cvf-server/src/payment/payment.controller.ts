import { Controller, Post, Body, UseGuards, Param, ParseUUIDPipe, Get, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

interface UserPayload {
  id: string;
}

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-link')
  async createPaymentLink(@Body() createPaymentLinkDto: CreatePaymentLinkDto) {
    return this.paymentService.createPaymentLink(createPaymentLinkDto.orderId);
  }

  @Post(':orderId/confirm-manual')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async confirmPaymentManually(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.paymentService.confirmPaymentManually(orderId, user.id);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async listPending(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.paymentService.listPendingPayments({ page: Number(page), limit: Number(limit) });
  }

  @Post('reconcile-csv')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async reconcileCsv(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserPayload,
  ) {
    if (!file || !file.buffer) {
      throw new Error('Missing CSV file');
    }
    return this.paymentService.reconcileCsv(file.buffer, user.id);
  }
}
