import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import dayjs = require('dayjs');
import { UserRole } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private coerceJwtExpiresIn(value: string): number | StringValue {
    const trimmed = value.trim();
    if (trimmed.length === 0) return trimmed as StringValue;
    if (/^\d+$/.test(trimmed)) return Number(trimmed);
    return trimmed as StringValue;
  }

  private _bcryptRoundsCache: number | null = null;
  private get bcryptRounds(): number {
    if (this._bcryptRoundsCache !== null) return this._bcryptRoundsCache;
    const raw = this.configService.get<string | number>('BCRYPT_ROUNDS', 10);
    if (typeof raw === 'number') {
      this._bcryptRoundsCache = raw;
      return raw;
    }
    const parsed = Number.parseInt(String(raw).trim(), 10);
    this._bcryptRoundsCache = Number.isFinite(parsed) ? parsed : 10;
    return this._bcryptRoundsCache;
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

  /** Derive a unique username from the email local-part + short random suffix. */
  private async generateUsername(email: string): Promise<string> {
    const base = email
      .split('@')[0]
      .replace(/[^a-z0-9_]/gi, '_')
      .slice(0, 24);
    let candidate = base;
    let attempt = 0;
    while (true) {
      const existing = await this.prisma.user.findUnique({
        where: { username: candidate },
      });
      if (!existing) return candidate;
      attempt++;
      candidate = `${base}_${Math.random().toString(36).slice(2, 6)}`;
      if (attempt > 10)
        throw new ConflictException('Could not generate a unique username');
    }
  }

  async signup(data: { fullName?: string; email: string; password: string }) {
    const { fullName, password } = data;
    const email = this.normalizeEmail(data.email);

    const customer = await this.prisma.customer.findUnique({
      where: { email },
      include: { user: true },
    });

    if (customer && customer.user) {
      throw new ConflictException('Email already registered');
    }

    const [hashedPassword, username] = await Promise.all([
      bcrypt.hash(password, this.bcryptRounds),
      this.generateUsername(email),
    ]);

    if (!customer) {
      const newUser = await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          customer: {
            create: {
              email,
              fullName: fullName ?? null,
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
            connect: { id: customer.id },
          },
        },
      });
      if (fullName) {
        await this.prisma.customer.update({
          where: { id: customer.id },
          data: { fullName },
        });
      }
      return this.generateTokens(newUser.id);
    }
  }

  async login(data: { email: string; password: string }) {
    const { password } = data;
    const email = this.normalizeEmail(data.email);

    // Single query: tìm customer (chỉ lấy field cần thiết)
    const customer = await this.prisma.customer.findUnique({
      where: { email },
      select: {
        id: true,
        user: {
          select: { id: true, password: true, role: true, customerId: true },
        },
      },
    });

    let user: {
      id: string;
      password: string;
      role: UserRole;
      customerId: string | null;
    } | null = customer?.user ?? null;

    // Chỉ query supplier nếu customer không có user
    if (!user) {
      const supplier = await this.prisma.supplier.findUnique({
        where: { email },
        select: {
          users: {
            take: 1,
            select: { id: true, password: true, role: true, customerId: true },
          },
        },
      });
      user = supplier?.users?.[0] ?? null;
    }

    if (!user) {
      throw new UnauthorizedException('Sai email hoặc mật khẩu');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Sai email hoặc mật khẩu');
    }

    return this.generateTokens(user.id);
  }

  async generateTokens(userId: string) {
    // Tạo cả 2 token song song (không phụ thuộc nhau)
    const [accessToken, refreshToken] = await Promise.all([
      Promise.resolve(
        this.jwtService.sign(
          { sub: userId },
          { expiresIn: this.jwtAccessExpires },
        ),
      ),
      Promise.resolve(
        this.jwtService.sign(
          { sub: userId },
          { expiresIn: this.jwtRefreshExpires },
        ),
      ),
    ]);

    // Query sessions + tạo token mới song song
    const existingSessions = await this.prisma.token.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });

    const ops: Promise<unknown>[] = [];

    if (existingSessions.length >= this.maxSessionsPerUser) {
      const toDelete = existingSessions
        .slice(0, existingSessions.length - this.maxSessionsPerUser + 1)
        .map((t) => t.id);
      ops.push(
        this.prisma.token.deleteMany({ where: { id: { in: toDelete } } }),
      );
    }

    ops.push(
      this.prisma.token.create({
        data: {
          refreshToken,
          userId,
          expiresAt: dayjs().add(7, 'day').toDate(),
        },
      }),
    );

    await Promise.all(ops);

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
