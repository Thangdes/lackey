import {
  IsNotEmpty,
  IsString,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * SePay IPN (Instant Payment Notification)
 * SePay gọi POST tới endpoint này sau khi đơn hàng được thanh toán thành công.
 * Docs: https://docs.sepay.vn/payment-gateway/ipn.html
 */

export class SepayIpnOrderDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  order_id!: string;

  @IsNotEmpty()
  @IsString()
  order_status!: string;

  @IsOptional()
  @IsString()
  order_invoice_number?: string;

  @IsNotEmpty()
  @IsString()
  order_amount!: string;

  @IsOptional()
  @IsString()
  order_description?: string;
}

export class SepayIpnTransactionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsNotEmpty()
  @IsString()
  transaction_status!: string;

  @IsNotEmpty()
  @IsString()
  transaction_amount!: string;

  @IsNotEmpty()
  @IsString()
  transaction_id!: string;

  @IsOptional()
  @IsString()
  transaction_currency?: string;
}

export class SepayIpnDto {
  /** Loại thông báo — chỉ xử lý khi là "ORDER_PAID" */
  @IsNotEmpty()
  @IsString()
  notification_type!: string;

  @IsOptional()
  timestamp?: number;

  /** HMAC-SHA256 checksum để xác thực tính toàn vẹn dữ liệu */
  @IsOptional()
  @IsString()
  checksum?: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => SepayIpnOrderDto)
  order!: SepayIpnOrderDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => SepayIpnTransactionDto)
  transaction!: SepayIpnTransactionDto;
}
