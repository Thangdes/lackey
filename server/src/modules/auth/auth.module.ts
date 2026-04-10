import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import * as dotenv from 'dotenv';
import { OwnershipGuard } from './ownership.guard';
import { CartModule } from '@/modules/commerce/cart/cart.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
dotenv.config();

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      // expiresIn is intentionally omitted here; each token is signed with its
      // own expiry in AuthService.generateTokens (accessToken: 1d, refreshToken: 7d)
      secret: process.env.JWT_SECRET,
    }),
    PrismaModule,
    CartModule,
  ],
  providers: [AuthService, JwtStrategy, OwnershipGuard, ConfigService],
  controllers: [AuthController],
  exports: [OwnershipGuard, JwtStrategy],
})
export class AuthModule {}
