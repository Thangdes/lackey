import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import dayjs = require('dayjs');
import { CartService } from '@/modules/commerce/cart/cart.service';
import { UserRole } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private cartService: CartService,
    private configService: ConfigService,
  ) { }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private coerceJwtExpiresIn(value: string): number | StringValue {
    const trimmed = value.trim();
    if (trimmed.length === 0) return trimmed as StringValue;
    if (/^\d+$/.test(trimmed)) return Number(trimmed);
    return trimmed as StringValue;
  }

  private get bcryptRounds(): number {
    const raw = this.configService.get<string | number>('BCRYPT_ROUNDS', 10);
    if (typeof raw === 'number') return raw;
    const parsed = Number.parseInt(String(raw).trim(), 10);
    return Number.isFinite(parsed) ? parsed : 10;
  }

  private get jwtAccessExpires(): number | StringValue {
    const value = this.configService.get<string>('JWT_ACCESS_EXPIRES', '1d');
    return this.coerceJwtExpiresIn(value);
  }

  private get jwtRefreshExpires(): number | StringValue {
    const value = this.configService.get<string>('JWT_REFRESH_EXPIRES', '7d');
    return this.coerceJwtExpiresIn(value);
  }

  private get maxSessionsPerUser(): number {
    return this.configService.get<number>('MAX_SESSIONS_PER_USER', 5);
  }

  async signup(data: { username: string; email: string; password: string }) {
    const { username, password } = data;
    const email = this.normalizeEmail(data.email);

    const customer = await this.prisma.customer.findUnique({
      where: { email },
      include: { user: true },
    });

    if (customer && customer.user) {
      throw new ConflictException('Email already registered');
    }

    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, this.bcryptRounds);

    if (!customer) {
      const newUser = await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          customer: {
            create: {
              email,
            },
          },
        },
      });
      return this.generateTokens(newUser.id);
    } else {
      const newUser = await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          customer: {
            connect: {
              id: customer.id,
            },
          },
        },
      });
      return this.generateTokens(newUser.id);
    }
  }

  async login(data: { email: string; password: string; guestCartId?: string }) {
    const { password, guestCartId } = data;
    const email = this.normalizeEmail(data.email);

    const customer = await this.prisma.customer.findUnique({
      where: { email },
      include: { user: true },
    });

    const supplier = customer?.user
      ? null
      : await this.prisma.supplier.findUnique({
          where: { email },
          include: { users: true },
        });

    const user = customer?.user ?? supplier?.users?.[0] ?? null;

    if (!user) {
      throw new UnauthorizedException('Sai email hoặc mật khẩu');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Sai email hoặc mật khẩu');
    }

    if (guestCartId && user.role === UserRole.CUSTOMER && user.customerId) {
      await this.cartService.mergeCarts(user.customerId, guestCartId);
    }

    return this.generateTokens(user.id);
  }

  async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: this.jwtAccessExpires },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: this.jwtRefreshExpires },
    );

    const existingSessions = await this.prisma.token.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });

    if (existingSessions.length >= this.maxSessionsPerUser) {
      const toDelete = existingSessions
        .slice(0, existingSessions.length - this.maxSessionsPerUser + 1)
        .map((t) => t.id);
      await this.prisma.token.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    await this.prisma.token.create({
      data: {
        refreshToken,
        userId,
        expiresAt: dayjs().add(7, 'day').toDate(),
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const tokenData = await this.prisma.token.findUnique({
      where: { refreshToken },
    });

    if (!tokenData || dayjs(tokenData.expiresAt).isBefore(dayjs())) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.token.delete({ where: { id: tokenData.id } });

    return this.generateTokens(tokenData.userId);
  }

  async logout(refreshToken: string) {
    const token = await this.prisma.token.findUnique({
      where: { refreshToken },
    });

    if (token) {
      await this.prisma.token.delete({
        where: { refreshToken },
      });
    }

    return { message: 'Logout successful' };
  }

  async updateProfile(
    userId: string,
    body: { fullName?: string; phone?: string },
  ) {
    const u = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!u) throw new UnauthorizedException('User not found');
    if (u.customerId) {
      await this.prisma.customer.update({
        where: { id: u.customerId },
        data: {
          fullName: body.fullName,
          phone: body.phone,
        },
      });
    }
    const updated = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { customer: true, supplier: true },
    });
    if (!updated) throw new UnauthorizedException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...secureUser } = updated;
    return secureUser;
  }
}