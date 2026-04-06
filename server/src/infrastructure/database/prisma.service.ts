/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const buildDatasourceUrl = () => {
  const base = process.env.DATABASE_URL || '';
  if (!base) return base;
  try {
    const url = new URL(base);
    // Giảm server selection timeout: fail nhanh thay vì treo 30s
    if (!url.searchParams.has('serverSelectionTimeoutMS')) {
      url.searchParams.set('serverSelectionTimeoutMS', '10000');
    }
    // Heartbeat để giữ connection sống, tránh Atlas drop do idle
    if (!url.searchParams.has('heartbeatFrequencyMS')) {
      url.searchParams.set('heartbeatFrequencyMS', '10000');
    }
    // Socket timeout
    if (!url.searchParams.has('socketTimeoutMS')) {
      url.searchParams.set('socketTimeoutMS', '20000');
    }
    return url.toString();
  } catch {
    return base;
  }
};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasourceUrl: buildDatasourceUrl(),
      log: [],
    });
  }

  async onModuleInit() {
    let retries = 3;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('Database connected');
        return;
      } catch (err) {
        retries--;
        if (retries === 0) {
          this.logger.error('Failed to connect to database after 3 retries', err);
          throw err;
        }
        this.logger.warn(`DB connection failed, retrying... (${retries} left)`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
