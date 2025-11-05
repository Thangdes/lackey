import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, buildPaginationMeta, PaginatedResult } from '../pagination';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  protected get model() {
    return this.prisma[this.modelName];
  }

  async findById(id: string, include?: any): Promise<T> {
    const entity = await this.model.findUnique({
      where: { id },
      include,
    });

    if (!entity) {
      throw new NotFoundException(`${this.modelName} with ID '${id}' not found`);
    }

    return entity;
  }

  async findAll(where?: any, include?: any, orderBy?: any): Promise<T[]> {
    return this.model.findMany({
      where,
      include,
      orderBy,
    });
  }

  async findPaginated(
    page?: number,
    limit?: number,
    where?: any,
    include?: any,
    orderBy?: any,
  ): Promise<PaginatedResult<T>> {
    const { skip, take } = buildPagination(page, limit);

    const [items, total] = await this.prisma.$transaction([
      this.model.findMany({
        skip,
        take,
        where,
        include,
        orderBy,
      }),
      this.model.count({ where }),
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async create(data: any, include?: any): Promise<T> {
    return this.model.create({
      data,
      include,
    });
  }

  async update(id: string, data: any, include?: any): Promise<T> {
    await this.findById(id);
    return this.model.update({
      where: { id },
      data,
      include,
    });
  }

  async delete(id: string): Promise<T> {
    await this.findById(id);
    return this.model.delete({
      where: { id },
    });
  }

  async count(where?: any): Promise<number> {
    return this.model.count({ where });
  }

  async exists(where: any): Promise<boolean> {
    const count = await this.model.count({ where });
    return count > 0;
  }
}
