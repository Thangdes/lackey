import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseRepository } from '../../common/base/base.repository';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomerRepository extends BaseRepository<Customer> {
  constructor(prisma: PrismaService) {
    super(prisma, 'customer');
  }

  async findByEmail(email: string) {
    return this.model.findUnique({
      where: { email },
    });
  }

  async findOneWithDetails(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, role: true } },
        addresses: true,
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async createCustomer(data: any) {
    return this.model.create({ data });
  }

  async updateCustomer(id: string, data: any) {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async deleteCustomer(id: string) {
    return this.model.delete({ where: { id } });
  }
}
