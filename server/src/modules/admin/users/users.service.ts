import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { buildPagination, buildPaginationMeta } from '@/infrastructure/common/pagination';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (existing) throw new ConflictException('Username already exists');

    if (dto.customerId && dto.supplierId) {
      throw new BadRequestException('A user cannot be linked to both customer and supplier.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const created = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        role: dto.role || UserRole.CUSTOMER,
        isActive: dto.isActive ?? true,
        customer: dto.customerId ? { connect: { id: dto.customerId } } : undefined,
        supplier: dto.supplierId ? { connect: { id: dto.supplierId } } : undefined,
      },
      include: { customer: true, supplier: true },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...secure } = created;
    return secure;
  }

  async findAll(params: { page?: number; limit?: number; search?: string; role?: UserRole; isActive?: string }) {
    const { page, limit, skip, take } = buildPagination(params.page, params.limit);

    const where: Prisma.UserWhereInput = {};

    if (params.search) {
      where.OR = [
        { username: { contains: params.search, mode: 'insensitive' } },
        { customer: { email: { contains: params.search, mode: 'insensitive' } } },
        { supplier: { email: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    if (params.role) where.role = params.role;
    if (params.isActive === '1') where.isActive = true;
    if (params.isActive === '0') where.isActive = false;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { customer: true, supplier: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    const mapped = items.map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...secure } = u;
      return secure;
    });

    return { data: mapped, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const u = await this.prisma.user.findUnique({ where: { id }, include: { customer: true, supplier: true } });
    if (!u) throw new NotFoundException('User not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...secure } = u;
    return secure;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.prisma.user.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException('User not found');
    });

    if (dto.customerId && dto.supplierId) {
      throw new BadRequestException('A user cannot be linked to both customer and supplier.');
    }

    const data: Prisma.UserUpdateInput = {
      username: dto.username,
      role: dto.role,
      isActive: dto.isActive,
      customer:
        dto.customerId === null
          ? { disconnect: true }
          : dto.customerId
            ? { connect: { id: dto.customerId } }
            : undefined,
      supplier:
        dto.supplierId === null
          ? { disconnect: true }
          : dto.supplierId
            ? { connect: { id: dto.supplierId } }
            : undefined,
    };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      include: { customer: true, supplier: true },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...secure } = updated;
    return secure;
  }

  async deactivate(id: string) {
    await this.prisma.user.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException('User not found');
    });
    const updated = await this.prisma.user.update({ where: { id }, data: { isActive: false } });
    return { ok: true, id: updated.id };
  }
}
