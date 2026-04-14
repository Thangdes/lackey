import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreatePaymentLinkDto {
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;
}
