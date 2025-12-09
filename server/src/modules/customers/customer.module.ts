import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CustomerRepository } from './repositories/customer.repository';
import { AddressRepository } from './repositories/address.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository, AddressRepository],
})
export class CustomerModule {}
