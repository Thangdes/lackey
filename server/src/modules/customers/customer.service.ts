import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { Prisma } from '@prisma/client';
import {
  PaginatedResult,
  buildPagination,
  buildPaginationMeta,
} from '@/infrastructure/common/pagination';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CustomerRepository } from './repositories/customer.repository';
import { AddressRepository } from './repositories/address.repository';

@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customerRepository: CustomerRepository,
    private readonly addressRepository: AddressRepository,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const existingCustomer = await this.customerRepository.findByEmail(
      createCustomerDto.email,
    );
    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists.');
    }
    return this.customerRepository.createCustomer(createCustomerDto);
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
    const customer = await this.customerRepository.findOneWithDetails(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID '${id}' not found`);
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.customerRepository.updateCustomer(id, updateCustomerDto);
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
    return this.customerRepository.deleteCustomer(id);
  }

  async addAddress(customerId: string, createAddressDto: CreateAddressDto) {
    await this.findOne(customerId);
    if (createAddressDto.isDefault) {
      await this.addressRepository.unsetDefaultForCustomer(customerId);
    }
    const fullAddress = `${createAddressDto.street}, ${createAddressDto.ward}, ${createAddressDto.district}, ${createAddressDto.city}`;
    return this.addressRepository.create({
      ...createAddressDto,
      customerId,
      fullAddress,
    });
  }

  async findAllAddresses(customerId: string) {
    await this.findOne(customerId);
    return this.addressRepository.findByCustomerId(customerId);
  }

  async updateAddress(
    customerId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    const address = await this.addressRepository.findOneByCustomer(
      addressId,
      customerId,
    );
    if (!address) {
      throw new NotFoundException(
        `Address not found or does not belong to this customer.`,
      );
    }
    if (updateAddressDto.isDefault) {
      await this.addressRepository.unsetDefaultForCustomer(customerId, addressId);
    }
    let fullAddress: string | undefined = undefined;
    if (
      updateAddressDto.street ||
      updateAddressDto.ward ||
      updateAddressDto.district ||
      updateAddressDto.city
    ) {
      fullAddress = `${updateAddressDto.street || address.street}, ${updateAddressDto.ward || address.ward}, ${updateAddressDto.district || address.district}, ${updateAddressDto.city || address.city}`;
    }
    return this.addressRepository.update(addressId, {
      ...updateAddressDto,
      fullAddress,
    });
  }

  async removeAddress(customerId: string, addressId: string) {
    const address = await this.addressRepository.findOneByCustomer(
      addressId,
      customerId,
    );
    if (!address) {
      throw new NotFoundException(
        `Address not found or does not belong to this customer.`,
      );
    }
    const orderCount = await this.addressRepository.countOrdersWithAddress(
      addressId,
    );
    if (orderCount > 0) {
      throw new ConflictException(
        'Cannot delete address that is being used in orders.',
      );
    }
    return this.addressRepository.delete(addressId);
  }
}
