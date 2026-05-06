import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';

/**
 * DTO cho SePay Báo Có Webhook
 * SePay gửi payload này khi nhận được tiền chuyển khoản vào tài khoản.
 * Docs: https://docs.sepay.vn/bao-co-webhook.html
 */
export class SepayWebhookDto {
  /** ID giao dịch nội bộ của SePay */
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  /** Tên ngân hàng / cổng nhận tiền (VD: "VCB", "MB", "TPBank") */
  @IsNotEmpty()
  @IsString()
  gateway!: string;

  /** Thời điểm giao dịch (VD: "2026-05-05 21:00:00") */
  @IsNotEmpty()
  @IsString()
  transactionDate!: string;

  /** Số tài khoản ngân hàng nhận tiền */
  @IsNotEmpty()
  @IsString()
  accountNumber!: string;

  /** Mã giao dịch ngắn (nếu có) */
  @IsOptional()
  @IsString()
  code?: string | null;

  /** Nội dung chuyển khoản do người gửi nhập — dùng để match đơn hàng */
  @IsNotEmpty()
  @IsString()
  content!: string;

  /** Chiều giao dịch: "in" = tiền vào, "out" = tiền ra */
  @IsNotEmpty()
  @IsEnum(['in', 'out'])
  transferType!: 'in' | 'out';

  /** Số tiền giao dịch (VND) */
  @IsNotEmpty()
  @IsNumber()
  transferAmount!: number;

  /** Số dư lũy kế (nếu có) */
  @IsOptional()
  @IsNumber()
  accumulated?: number | null;

  /** Tài khoản phụ (nếu có) */
  @IsOptional()
  @IsString()
  subAccount?: string | null;

  /** Mã tham chiếu giao dịch ngân hàng */
  @IsOptional()
  @IsString()
  referenceCode?: string | null;

  /** Mô tả thêm (nếu có) */
  @IsOptional()
  @IsString()
  description?: string | null;
}

/** Kết quả parse nội dung chuyển khoản */
export interface ParsedOrderContent {
  /** Mã đơn hàng trích xuất từ nội dung (VD: "CVF-1746450000000") */
  orderCode: string;
}
