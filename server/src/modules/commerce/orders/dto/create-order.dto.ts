import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsMongoId,
  ValidateIf,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  @IsEmail()
  @ValidateIf((o) => !o.customerId)
  @IsOptional()
  email?: string;

  @IsString()
  @ValidateIf((o) => !o.customerId)
  @IsOptional()
  fullName?: string;

  @IsString()
  @ValidateIf((o) => !o.customerId)
  @IsOptional()
  phone?: string;

  @IsMongoId()
  @IsOptional()
  shippingAddressId?: string;

  @IsString()
  @ValidateIf((o) => !o.shippingAddressId)
  @IsOptional()
  recipientName?: string;

  @IsString()
  @ValidateIf((o) => !o.shippingAddressId)
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @ValidateIf((o) => !o.shippingAddressId)
  @IsOptional()
  street?: string;

  @IsString()
  @ValidateIf((o) => !o.shippingAddressId)
  @IsOptional()
  ward?: string;

  @IsString()
  @ValidateIf((o) => !o.shippingAddressId)
  @IsOptional()
  district?: string;

  @IsString()
  @ValidateIf((o) => !o.shippingAddressId)
  @IsOptional()
  city?: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  notes?: string;

  customerId?: string;

  @IsString()
  @IsOptional()
  discountCode?: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  shippingFee: number;
}
