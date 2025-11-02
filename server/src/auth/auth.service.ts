import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import dayjs = require('dayjs');
import { CartService } from '../cart/cart.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private cartService: CartService,
  ) {}

  async signup(data: { username: string; email: string; password: string }) {
    const { username, email, password } = data;

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

    const hashedPassword = await bcrypt.hash(password, 10);

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
    const { email, password, guestCartId } = data;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ customer: { email: email } }, { supplier: { email: email } }],
      },
      include: {
        customer: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    if (guestCartId && user.role === UserRole.CUSTOMER && user.customerId) {
      await this.cartService.mergeCarts(user.customerId, guestCartId);
    }

    return this.generateTokens(user.id);
  }

  async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '1d' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d' },
    );

    await this.prisma.token.deleteMany({
      where: { userId },
    });

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
          fullName: typeof body.fullName !== 'undefined' ? body.fullName : undefined,
          phone: typeof body.phone !== 'undefined' ? body.phone : undefined,
        },
      });
    }
    const updated = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { customer: true, supplier: true },
    });
    const { password, ...secureUser } = (updated as any) || {};
    return secureUser;
  }
}