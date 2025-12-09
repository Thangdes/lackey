import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { v4 as uuidv4 } from 'uuid';
import { CartRepository, CartIdentifier } from './repositories/cart.repository';
import { CartCalculator } from './calculators/cart.calculator';
import { DiscountCalculator } from '@/infrastructure/common/utils/discount.calculator';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartRepository: CartRepository,
  ) {}


  private async computeDiscount(subtotal: number, code?: string, requireValid = false) {
    if (!code) return { amount: 0, applied: null };
    
    const discount = await this.prisma.discount.findUnique({ where: { code } });
    return DiscountCalculator.computeDiscount(discount, subtotal, requireValid);
  }

  async getCart({ customerId, guestCartId }: CartIdentifier, discountCode?: string, requireValidDiscount = false) {
    if (!customerId && !guestCartId) {
      return {
        cartId: undefined,
        items: [],
        totals: { subtotal: 0, totalItems: 0, totalUniqueItems: 0 },
      };
    }
    const cartItems = await this.cartRepository.findCartItems({ customerId, guestCartId });

    const items = cartItems.map((i) => CartCalculator.normalizeCartItem(i));
    const totals = CartCalculator.calculateTotals(items);
    const { amount: discount, applied } = await this.computeDiscount(
      totals.subtotal,
      discountCode,
      requireValidDiscount,
    );
    const totalAfterDiscount = Math.max(0, totals.subtotal - discount);

    return {
      cartId: customerId || guestCartId,
      items,
      totals: {
        ...totals,
        discount,
        totalAfterDiscount,
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

    const existingItem = await this.cartRepository.findCartItem(
      { customerId, guestCartId: finalGuestCartId },
      productVariantId,
    );

    const currentQty = existingItem ? existingItem.quantity : 0;
    const desiredQty = currentQty + quantity;
    const finalQty = Math.min(desiredQty, variant.stockQuantity);
    if (finalQty <= 0) {
      throw new BadRequestException('Requested quantity is not available');
    }
    if (existingItem) {
      await this.cartRepository.updateCartItemQuantity(existingItem.id, finalQty);
    } else {
      await this.cartRepository.createCartItem(
        { customerId, guestCartId: finalGuestCartId },
        productVariantId,
        finalQty,
      );
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
    await this.cartRepository.updateCartItemQuantity(cartItemId, finalQty);
    return this.getCart(identifier);
  }

  async removeItem(identifier: CartIdentifier, cartItemId: string) {
    await this.prisma.cartItem
      .findUniqueOrThrow({ where: { id: cartItemId } })
      .catch(() => {
        throw new NotFoundException('Cart item not found');
      });

    await this.cartRepository.deleteCartItem(cartItemId);
    return this.getCart(identifier);
  }

  async clearCart({ customerId, guestCartId }: CartIdentifier) {
    if (!customerId && !guestCartId) {
      return { message: 'Nothing to clear' };
    }

    await this.cartRepository.clearCart({ customerId, guestCartId });
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
      const existing = await this.cartRepository.findCartItem(
        { customerId, guestCartId: identifier.guestCartId },
        it.productVariantId,
      );
      if (it.quantity <= 0) {
        if (existing) {
          await this.cartRepository.deleteCartItem(existing.id);
        }
        continue;
      }
      const finalQty = Math.max(1, Math.min(it.quantity, variant.stockQuantity));
      if (existing) {
        await this.cartRepository.updateCartItemQuantity(existing.id, finalQty);
      } else {
        await this.cartRepository.createCartItem(
          { customerId, guestCartId: identifier.guestCartId },
          it.productVariantId,
          finalQty,
        );
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
        await this.cartRepository.updateCartItemQuantity(userItem.id, finalQty);
      } else {
        const finalQty = Math.max(1, Math.min(guestItem.quantity, stock));
        await this.cartRepository.updateCartItemQuantity(guestItem.id, finalQty);
        await this.prisma.cartItem.update({
          where: { id: guestItem.id },
          data: { customerId, guestCartId: null },
        });
      }
    }

    await this.cartRepository.deleteGuestCartItems(
      guestCartId,
      guestItems.map((i) => i.id),
    );
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
