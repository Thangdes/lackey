import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  PaginatedResult,
  buildPagination,
  buildPaginationMeta,
} from 'src/common/pagination';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email: createCustomerDto.email },
    });
    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists.');
    }
    return this.prisma.customer.create({ data: createCustomerDto });
  }

  async findAll(query: { page?: number; limit?: number; search?: string }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const where = query.search
      ? {
          OR: [
            { email: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
            { fullName: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
            { phone: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : undefined;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);
    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
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
    if (!customer) {
      throw new NotFoundException(`Customer with ID '${id}' not found`);
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    const orderCount = await this.prisma.order.count({
      where: { customerId: id },
    });
    if (orderCount > 0) {
      throw new ConflictException(
        'Cannot delete customer with existing orders.',
      );
    }
    await this.findOne(id);
    return this.prisma.customer.delete({ where: { id } });
  }

  async addAddress(customerId: string, createAddressDto: CreateAddressDto) {
    await this.findOne(customerId);
    if (createAddressDto.isDefault) {
      await this.prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }
    const fullAddress = `${createAddressDto.street}, ${createAddressDto.ward}, ${createAddressDto.district}, ${createAddressDto.city}`;
    return this.prisma.address.create({
      data: {
        ...createAddressDto,
        customerId,
        fullAddress,
      },
    });
  }

  async findAllAddresses(customerId: string) {
    await this.findOne(customerId);
    return this.prisma.address.findMany({
      where: { customerId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async updateAddress(
    customerId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    await this.prisma.address
      .findFirstOrThrow({
        where: { id: addressId, customerId },
      })
      .catch(() => {
        throw new NotFoundException(
          `Address not found or does not belong to this customer.`,
        );
      });
    if (updateAddressDto.isDefault) {
      await this.prisma.address.updateMany({
        where: { customerId, NOT: { id: addressId } },
        data: { isDefault: false },
      });
    }
    let fullAddress: string | undefined = undefined;
    if (
      updateAddressDto.street ||
      updateAddressDto.ward ||
      updateAddressDto.district ||
      updateAddressDto.city
    ) {
      const currentAddress = await this.prisma.address.findUnique({
        where: { id: addressId },
      });
      fullAddress = `${updateAddressDto.street || currentAddress.street}, ${updateAddressDto.ward || currentAddress.ward}, ${updateAddressDto.district || currentAddress.district}, ${updateAddressDto.city || currentAddress.city}`;
    }
    return this.prisma.address.update({
      where: { id: addressId },
      data: { ...updateAddressDto, fullAddress },
    });
  }

  async removeAddress(customerId: string, addressId: string) {
    await this.prisma.address
      .findFirstOrThrow({
        where: { id: addressId, customerId },
      })
      .catch(() => {
        throw new NotFoundException(
          `Address not found or does not belong to this customer.`,
        );
      });
    const orderCount = await this.prisma.order.count({
      where: { shippingAddressId: addressId },
    });
    if (orderCount > 0) {
      throw new ConflictException(
        'Cannot delete address that is being used in orders.',
      );
    }
    return this.prisma.address.delete({ where: { id: addressId } });
  }
}
