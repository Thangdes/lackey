import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import * as dotenv from 'dotenv';
import { OwnershipGuard } from './ownership.guard';
import { CartModule } from 'src/cart/cart.module';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    PrismaModule,
    CartModule,
  ],
  providers: [AuthService, JwtStrategy, OwnershipGuard],
  controllers: [AuthController],
  exports: [OwnershipGuard, JwtStrategy],
})
export class AuthModule {}
