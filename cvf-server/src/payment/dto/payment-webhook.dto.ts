import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentWebhookDto {
  @IsString()
  @IsNotEmpty()
  orderCode: string;

  @IsString()
  @IsNotEmpty()
  transactionCode: string;

  @IsString()
  @IsNotEmpty()
  status: 'SUCCESS' | 'FAILED';

  @IsString()
  @IsNotEmpty()
  signature: string;
}
