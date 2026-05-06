import { IsNotEmpty, IsString } from 'class-validator';

/** DTO để tạo SePay PG checkout cho một đơn hàng */
export class CreateSepayCheckoutDto {
  @IsNotEmpty()
  @IsString()
  orderId!: string;
}
