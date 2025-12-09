import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CreateCmspageDto } from './dto/create-cmspage.dto';
import { UpdateCmspageDto } from './dto/update-cmspage.dto';

@Injectable()
export class CmspageService {
  constructor(private prisma: PrismaService) {}

  async create(createCmspageDto: CreateCmspageDto) {
    const existingPage = await this.prisma.cmsPage.findUnique({
      where: { slug: createCmspageDto.slug },
    });
    if (existingPage) {
      throw new NotFoundException(
        `Page with slug '${createCmspageDto.slug}' already exists.`,
      );
    }
    return this.prisma.cmsPage.create({
      data: createCmspageDto,
    });
  }

  findAll() {
    return this.prisma.cmsPage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const page = await this.prisma.cmsPage.findUnique({
      where: { id },
    });
    if (!page) {
      throw new NotFoundException(`CMS Page with ID '${id}' not found`);
    }
    return page;
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.cmsPage.findUnique({
      where: { slug },
    });
    if (!page) {
      throw new NotFoundException(`CMS Page with slug '${slug}' not found`);
    }
    return page;
  }

  async update(id: string, updateCmspageDto: UpdateCmspageDto) {
    await this.findOne(id);
    if (updateCmspageDto.slug) {
      const existingPage = await this.prisma.cmsPage.findUnique({
        where: { slug: updateCmspageDto.slug },
      });
      if (existingPage && existingPage.id !== id) {
        throw new NotFoundException(
          `Page with slug '${updateCmspageDto.slug}' already exists.`,
        );
      }
    }
    return this.prisma.cmsPage.update({
      where: { id },
      data: updateCmspageDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cmsPage.delete({
      where: { id },
    });
  }
}
