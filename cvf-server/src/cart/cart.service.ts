import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, DiscountType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { v4 as uuidv4 } from 'uuid';

interface CartIdentifier {
  customerId?: string;
  guestCartId?: string;
}

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private normalizeCartItem(item: any) {
    const price = Number(item.productVariant.price);
    const discountPrice = item.productVariant.discountPrice
      ? Number(item.productVariant.discountPrice)
      : null;
    const effectivePrice = discountPrice ?? price;
    const lineTotal = effectivePrice * item.quantity;
    const isOutOfStock = item.productVariant.stockQuantity <= 0;
    const canIncrease = item.quantity < item.productVariant.stockQuantity;
    const canDecrease = item.quantity > 1;
    const maxAddable = Math.max(0, item.productVariant.stockQuantity - item.quantity);
    return {
      id: item.id,
      productVariantId: item.productVariantId,
      name: item.productVariant.name,
      sku: item.productVariant.sku,
      price,
      discountPrice,
      effectivePrice,
      stockQuantity: item.productVariant.stockQuantity,
      quantity: item.quantity,
      lineTotal,
      isOutOfStock,
      canIncrease,
      canDecrease,
      maxAddable,
      product: {
        id: item.productVariant.product.id,
        name: item.productVariant.product.name,
        slug: item.productVariant.product.slug,
        thumbnailUrl: item.productVariant.product.thumbnailUrl,
      },
    };
  }

  private async computeDiscount(subtotal: number, code?: string, requireValid = false) {
    if (!code) return { amount: 0, applied: null as null | any };
    const now = new Date();
    const discount = await this.prisma.discount.findUnique({ where: { code } });
    const active =
      !!discount &&
      discount.isActive &&
      (!discount.startDate || discount.startDate <= now) &&
      (!discount.endDate || discount.endDate >= now);
    const meetsMin = !!discount && (!discount.minAmount || Number(discount.minAmount) <= subtotal);
    if (!active || !meetsMin) {
      if (requireValid) {
        throw new BadRequestException('Discount code is invalid or not applicable');
      }
      return { amount: 0, applied: null };
    }
    let amount = 0;
    if (discount.type === DiscountType.PERCENTAGE) {
      amount = (subtotal * Number(discount.value)) / 100;
    } else {
      amount = Number(discount.value);
    }
    amount = Math.max(0, Math.min(subtotal, amount));
    const applied = { code: discount.code, type: discount.type, value: Number(discount.value) };
    return { amount, applied };
  }

  async getCart({ customerId, guestCartId }: CartIdentifier, discountCode?: string, requireValidDiscount = false) {
    if (!customerId && !guestCartId) {
      return {
        cartId: undefined,
        items: [],
        totals: { subtotal: 0, totalItems: 0, totalUniqueItems: 0 },
      };
    }
    const whereClause = customerId
      ? { customerId }
      : { guestCartId: guestCartId || null };

    const cartItems = await this.prisma.cartItem.findMany({
      where: whereClause,
      include: {
        productVariant: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, thumbnailUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const items = cartItems.map((i) => this.normalizeCartItem(i));
    const subtotal = items.reduce((acc, it) => acc + it.lineTotal, 0);
    const totalSavings = items.reduce((acc, it) => acc + Math.max(0, (it.price - it.effectivePrice)) * it.quantity, 0);
    const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);
    const { amount: discount, applied } = await this.computeDiscount(subtotal, discountCode, requireValidDiscount);
    const totalAfterDiscount = Math.max(0, subtotal - discount);

    return {
      cartId: customerId || guestCartId,
      items,
      totals: {
        subtotal,
        discount,
        totalAfterDiscount,
        totalItems,
        totalUniqueItems: items.length,
        savings: totalSavings,
      },
      appliedDiscount: applied,
    };
  }

  async addItemToCart(
    { customerId, guestCartId }: CartIdentifier,
    addToCartDto: AddToCartDto,
  ) {
    const { productVariantId, quantity } = addToCartDto;

    const variant = await this.prisma.productVariant
      .findUniqueOrThrow({
        where: { id: productVariantId },
        select: { id: true, stockQuantity: true },
      })
      .catch(() => {
        throw new NotFoundException('Product variant not found');
      });

    let finalGuestCartId = guestCartId;
    if (!customerId && !guestCartId) {
      finalGuestCartId = uuidv4();
    }
    const whereClause = customerId
      ? { customerId, productVariantId }
      : { guestCartId: finalGuestCartId, productVariantId };

    const existingItem = await this.prisma.cartItem.findFirst({
      where: whereClause,
    });

    const currentQty = existingItem ? existingItem.quantity : 0;
    const desiredQty = currentQty + quantity;
    const finalQty = Math.min(desiredQty, variant.stockQuantity);
    if (finalQty <= 0) {
      throw new BadRequestException('Requested quantity is not available');
    }
    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: finalQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          customerId: customerId,
          guestCartId: customerId ? null : finalGuestCartId,
          productVariantId,
          quantity: finalQty,
        },
      });
    }

    return this.getCart({ customerId, guestCartId: finalGuestCartId });
  }

  async updateItemQuantity(
    identifier: CartIdentifier,
    cartItemId: string,
    updateDto: UpdateCartItemDto,
  ) {
    const item = await this.prisma.cartItem
      .findUniqueOrThrow({
        where: { id: cartItemId },
        include: { productVariant: { select: { stockQuantity: true } } },
      })
      .catch(() => {
        throw new NotFoundException('Cart item not found');
      });

    const finalQty = Math.max(1, Math.min(updateDto.quantity, item.productVariant.stockQuantity));
    await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: finalQty },
    });
    return this.getCart(identifier);
  }

  async removeItem(identifier: CartIdentifier, cartItemId: string) {
    await this.prisma.cartItem
      .findUniqueOrThrow({ where: { id: cartItemId } })
      .catch(() => {
        throw new NotFoundException('Cart item not found');
      });

    await this.prisma.cartItem.delete({ where: { id: cartItemId } });
    return this.getCart(identifier);
  }

  async clearCart({ customerId, guestCartId }: CartIdentifier) {
    if (!customerId && !guestCartId) {
      return { message: 'Nothing to clear' };
    }
    const whereClause = customerId
      ? { customerId }
      : { guestCartId: guestCartId };

    await this.prisma.cartItem.deleteMany({ where: whereClause });
    return this.getCart({ customerId, guestCartId });
  }

  async bulkSetCart(
    identifier: CartIdentifier,
    items: Array<{ productVariantId: string; quantity: number }>,
  ) {
    const { customerId, guestCartId } = identifier;
    if (!customerId && !guestCartId) {
      identifier.guestCartId = uuidv4();
    }
    for (const it of items) {
      const variant = await this.prisma.productVariant
        .findUniqueOrThrow({
          where: { id: it.productVariantId },
          select: { id: true, stockQuantity: true },
        })
        .catch(() => {
          throw new NotFoundException(`Product variant ${it.productVariantId} not found`);
        });
      const whereClause = customerId
        ? { customerId, productVariantId: it.productVariantId }
        : { guestCartId: identifier.guestCartId, productVariantId: it.productVariantId };
      const existing = await this.prisma.cartItem.findFirst({ where: whereClause });
      if (it.quantity <= 0) {
        if (existing) {
          await this.prisma.cartItem.delete({ where: { id: existing.id } });
        }
        continue;
      }
      const finalQty = Math.max(1, Math.min(it.quantity, variant.stockQuantity));
      if (existing) {
        await this.prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: finalQty } });
      } else {
        await this.prisma.cartItem.create({
          data: {
            customerId: customerId || null,
            guestCartId: customerId ? null : identifier.guestCartId,
            productVariantId: it.productVariantId,
            quantity: finalQty,
          },
        });
      }
    }
    return this.getCart(identifier);
  }

  async mergeCarts(customerId: string, guestCartId: string, discountCode?: string) {
    const guestItems = await this.prisma.cartItem.findMany({
      where: { guestCartId },
    });
    if (guestItems.length === 0) return this.getCart({ customerId });

    const userItems = await this.prisma.cartItem.findMany({
      where: { customerId },
    });
    const userItemMap = new Map(
      userItems.map((item) => [item.productVariantId, item]),
    );

    for (const guestItem of guestItems) {
      const userItem = userItemMap.get(guestItem.productVariantId);
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: guestItem.productVariantId },
        select: { stockQuantity: true },
      });
      const stock = variant?.stockQuantity ?? 0;
      if (userItem) {
        const finalQty = Math.max(1, Math.min(userItem.quantity + guestItem.quantity, stock));
        await this.prisma.cartItem.update({
          where: { id: userItem.id },
          data: { quantity: finalQty },
        });
      } else {
        const finalQty = Math.max(1, Math.min(guestItem.quantity, stock));
        await this.prisma.cartItem.update({
          where: { id: guestItem.id },
          data: { customerId: customerId, guestCartId: null, quantity: finalQty },
        });
      }
    }

    await this.prisma.cartItem.deleteMany({
      where: {
        guestCartId,
        id: { in: guestItems.map((i) => i.id) },
        customerId: null,
      },
    });
    return this.getCart({ customerId }, discountCode);
  }

  async applyDiscount(identifier: CartIdentifier, code: string) {
    const baseCart = await this.getCart(identifier);
    await this.computeDiscount(baseCart.totals.subtotal, code, true);
    return this.getCart(identifier, code, true);
  }

  async removeDiscount(identifier: CartIdentifier) {
    return this.getCart(identifier);
  }
}
