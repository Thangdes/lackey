import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CartIdentifier {
  customerId?: string;
  guestCartId?: string;
}

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCartItems(identifier: CartIdentifier) {
    const whereClause = identifier.customerId
      ? { customerId: identifier.customerId }
      : { guestCartId: identifier.guestCartId || null };

    return this.prisma.cartItem.findMany({
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
  }

  async findCartItem(identifier: CartIdentifier, productVariantId: string) {
    const whereClause = identifier.customerId
      ? { customerId: identifier.customerId, productVariantId }
      : { guestCartId: identifier.guestCartId, productVariantId };

    return this.prisma.cartItem.findFirst({
      where: whereClause,
    });
  }

  async createCartItem(
    identifier: CartIdentifier,
    productVariantId: string,
    quantity: number,
  ) {
    return this.prisma.cartItem.create({
      data: {
        customerId: identifier.customerId || null,
        guestCartId: identifier.customerId ? null : identifier.guestCartId,
        productVariantId,
        quantity,
      },
    });
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async deleteCartItem(cartItemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(identifier: CartIdentifier) {
    const whereClause = identifier.customerId
      ? { customerId: identifier.customerId }
      : { guestCartId: identifier.guestCartId };

    return this.prisma.cartItem.deleteMany({
      where: whereClause,
    });
  }

  async deleteGuestCartItems(guestCartId: string, itemIds: string[]) {
    return this.prisma.cartItem.deleteMany({
      where: {
        guestCartId,
        id: { in: itemIds },
        customerId: null,
      },
    });
  }
}
