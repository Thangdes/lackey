import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCartItems(customerId: string) {
    return this.prisma.cartItem.findMany({
      where: { customerId },
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

  async findCartItem(customerId: string, productVariantId: string) {
    return this.prisma.cartItem.findFirst({
      where: { customerId, productVariantId },
    });
  }

  async createCartItem(
    customerId: string,
    productVariantId: string,
    quantity: number,
  ) {
    return this.prisma.cartItem.create({
      data: {
        customerId,
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

  async clearCart(customerId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { customerId },
    });
  }
}
