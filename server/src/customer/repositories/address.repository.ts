import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCustomerId(customerId: string) {
    return this.prisma.address.findMany({
      where: { customerId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async findOneByCustomer(addressId: string, customerId: string) {
    return this.prisma.address.findFirst({
      where: { id: addressId, customerId },
    });
  }

  async create(data: any) {
    return this.prisma.address.create({ data });
  }

  async update(addressId: string, data: any) {
    return this.prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async delete(addressId: string) {
    return this.prisma.address.delete({
      where: { id: addressId },
    });
  }

  async unsetDefaultForCustomer(customerId: string, excludeId?: string) {
    const where: any = { customerId };
    if (excludeId) {
      where.NOT = { id: excludeId };
    }
    return this.prisma.address.updateMany({
      where,
      data: { isDefault: false },
    });
  }

  async countOrdersWithAddress(addressId: string) {
    return this.prisma.order.count({
      where: { shippingAddressId: addressId },
    });
  }
}
