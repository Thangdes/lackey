import { Controller, Post, Body, UseGuards, Param, Get, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentReconciliationService } from './payment-reconciliation.service';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { AdminGuard } from '@/modules/auth/admin.gaurd';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '@/infrastructure/common/pipes/parse-object-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

interface UserPayload {
  id: string;
}

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentReconciliationService: PaymentReconciliationService,
  ) {}

  @Post('create-link')
  async createPaymentLink(@Body() createPaymentLinkDto: CreatePaymentLinkDto) {
    return this.paymentService.createPaymentLink(createPaymentLinkDto.orderId);
  }

  @Post(':orderId/confirm-manual')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async confirmPaymentManually(
    @Param('orderId', ParseObjectIdPipe) orderId: string,
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
    return this.paymentReconciliationService.reconcileCsv(file.buffer, user.id);
  }
}
