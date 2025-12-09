import { DiscountType } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

export interface DiscountData {
  code: string;
  type: DiscountType;
  value: number | any;
  isActive: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  minAmount?: number | any | null;
}

export interface DiscountResult {
  amount: number;
  applied: { code: string; type: DiscountType; value: number } | null;
}

export class DiscountCalculator {
  static validateDiscount(
    discount: DiscountData | null,
    subtotal: number,
    requireValid: boolean = false,
  ): boolean {
    if (!discount) {
      if (requireValid) {
        throw new BadRequestException('Discount code not found');
      }
      return false;
    }

    const now = new Date();

    const isActive =
      discount.isActive &&
      (!discount.startDate || discount.startDate <= now) &&
      (!discount.endDate || discount.endDate >= now);

    if (!isActive) {
      if (requireValid) {
        throw new BadRequestException('Discount code is invalid or expired');
      }
      return false;
    }

    const meetsMin =
      !discount.minAmount || Number(discount.minAmount) <= subtotal;

    if (!meetsMin) {
      if (requireValid) {
        throw new BadRequestException(
          `Order subtotal must be at least ${discount.minAmount} to use this code`,
        );
      }
      return false;
    }

    return true;
  }

  static calculateDiscountAmount(
    discount: DiscountData,
    subtotal: number,
  ): number {
    let amount = 0;

    if (discount.type === DiscountType.PERCENTAGE) {
      amount = (subtotal * Number(discount.value)) / 100;
    } else if (discount.type === DiscountType.FIXED_AMOUNT) {
      amount = Number(discount.value);
    }

    return Math.max(0, Math.min(subtotal, amount));
  }

  static computeDiscount(
    discount: DiscountData | null,
    subtotal: number,
    requireValid: boolean = false,
  ): DiscountResult {
    if (!this.validateDiscount(discount, subtotal, requireValid)) {
      return { amount: 0, applied: null };
    }

    const amount = this.calculateDiscountAmount(discount, subtotal);

    return {
      amount,
      applied: {
        code: discount.code,
        type: discount.type,
        value: Number(discount.value),
      },
    };
  }
}
