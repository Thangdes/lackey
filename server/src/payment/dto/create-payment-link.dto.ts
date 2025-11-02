import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePaymentLinkDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;
}
