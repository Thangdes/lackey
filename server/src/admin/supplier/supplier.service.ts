import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreateSupplierUserDto } from './dto/create-supplier-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { MailService } from '../../mail/mail.service';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async createSupplier(dto: CreateSupplierDto) {
    const existingSupplier = await this.prisma.supplier.findFirst({
      where: { OR: [{ name: dto.name }, { email: dto.email }] },
    });

    if (existingSupplier) {
      throw new ConflictException('Supplier name or email already exists.');
    }

    return this.prisma.supplier.create({
      data: dto,
    });
  }

  async updateSupplier(id: string, dto: UpdateSupplierDto) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found.');
    }

    if (dto.name || dto.email) {
      const conflict = await this.prisma.supplier.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                dto.name ? { name: dto.name } : undefined,
                dto.email ? { email: dto.email } : undefined,
              ].filter(Boolean) as any,
            },
          ],
        },
      });
      if (conflict) {
        throw new ConflictException('Supplier name or email already exists.');
      }
    }

    return this.prisma.supplier.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSupplier(id: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found.');
    }
    await this.prisma.user.updateMany({
      where: { supplierId: id },
      data: { isActive: false },
    });
    await this.prisma.supplier.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'Supplier deactivated successfully.' };
  }

  async createSupplierUser(dto: CreateSupplierUserDto) {
    const supplier = await this.prisma.supplier
      .findUniqueOrThrow({ where: { id: dto.supplierId } })
      .catch(() => {
        throw new NotFoundException(
          `Supplier with ID ${dto.supplierId} not found.`,
        );
      });

    const loginEmailRaw = (dto.email ?? dto.username)?.trim();
    if (!loginEmailRaw) {
      throw new BadRequestException('Email is required');
    }
    const loginEmail = loginEmailRaw.toLowerCase();
    const desiredUsername = (dto.username?.trim() || loginEmail).toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { username: desiredUsername },
    });
    if (existingUser) {
      throw new ConflictException('Email already taken by another user.');
    }

    if (supplier.email !== loginEmail) {
      await this.prisma.supplier.update({
        where: { id: supplier.id },
        data: { email: loginEmail },
      });
    }

    await this.mailService.sendSupplierWelcomeEmail(loginEmail, {
      supplierName: supplier.contactName || supplier.name,
      username: desiredUsername,
      temporaryPassword: dto.password,
    });

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username: desiredUsername,
        password: hashedPassword,
        role: UserRole.SUPPLIER,
        supplier: {
          connect: { id: dto.supplierId },
        },
      },
      select: {
        id: true,
        username: true,
        role: true,
        supplierId: true,
      },
    });

    return newUser;
  }

  findAllSuppliers() {
    return this.prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    });
  }

  findSupplierDetails(id: string) {
    return this.prisma.supplier.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            createdAt: true,
            isActive: true,
          },
        },
      },
    });
  }

  async deactivateSupplierUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== UserRole.SUPPLIER) {
      throw new NotFoundException('Supplier user not found.');
    }

    const supplier = await this.prisma.supplier.findUnique({
      where: { id: user.supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Associated supplier not found.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    await this.prisma.supplier.update({
      where: { id: supplier.id },
      data: { isActive: false },
    });
    return { message: 'Supplier user deactivated successfully.' };
  }

  async reactivateSupplierUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== UserRole.SUPPLIER) {
      throw new NotFoundException('Supplier user not found.');
    }

    const supplier = await this.prisma.supplier.findUnique({
      where: { id: user.supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Associated supplier not found.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    await this.prisma.supplier.update({
      where: { id: supplier.id },
      data: { isActive: true },
    });
    return { message: 'Supplier user reactivated successfully.' };
  }

  async resetSupplierUserPassword(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== UserRole.SUPPLIER) {
      throw new NotFoundException('Supplier user not found.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return { message: 'Password reset successfully.' };
  }

  async deleteSupplierUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== UserRole.SUPPLIER) {
      throw new NotFoundException('Supplier user not found.');
    }
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'Supplier user deleted successfully.' };
  }

  async activateSupplier(id: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found.');
    }
    await this.prisma.supplier.update({ where: { id }, data: { isActive: true } });
    return { message: 'Supplier activated successfully.' };
  }
}
