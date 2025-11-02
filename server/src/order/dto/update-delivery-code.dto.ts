import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDeliveryCodeDto {
  @IsString()
  @IsNotEmpty()
  deliveryCode: string;
}
