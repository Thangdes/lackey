import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CreateSiteContentDto } from './dto/create-site-content.dto';
import { ContentType, Prisma } from '@prisma/client';
import { CloudinaryService } from '@/integrations/cloudinary/cloudinary.service';
import { UpdateSiteContentDto } from './dto/update-site-content.dto';

@Injectable()
export class SiteContentService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) {}

  create(createSiteContentDto: CreateSiteContentDto) {
    return this.prisma.siteContent.create({
      data: createSiteContentDto,
    });
  }

  findAllAdmin(type?: ContentType) {
    const where: Prisma.SiteContentWhereInput = {};
    if (type) {
      where.type = type;
    }
    return this.prisma.siteContent.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findPublishedBanners() {
    try {
      return await this.prisma.siteContent.findMany({
        where: {
          type: ContentType.BANNER,
          isPublished: true,
        },
        orderBy: { displayOrder: 'asc' },
      });
    } catch {
      return [];
    }
  }

  async findPublishedTestimonials() {
    try {
      return await this.prisma.siteContent.findMany({
        where: {
          type: ContentType.TESTIMONIAL,
          isPublished: true,
        },
        orderBy: { displayOrder: 'asc' },
      });
    } catch {
      return [];
    }
  }

  async findPublishedGallery() {
    try {
      return await this.prisma.siteContent.findMany({
        where: {
          type: ContentType.GALLERY,
          isPublished: true,
        },
        orderBy: { displayOrder: 'asc' },
      });
    } catch {
      return [];
    }
  }

  async findOne(id: string) {
    const content = await this.prisma.siteContent.findUnique({
      where: { id },
    });
    if (!content) {
      throw new NotFoundException(`Site Content with ID '${id}' not found`);
    }
    return content;
  }

  async update(id: string, updateSiteContentDto: UpdateSiteContentDto) {
    await this.findOne(id);
    return this.prisma.siteContent.update({
      where: { id },
      data: updateSiteContentDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.siteContent.delete({
      where: { id },
    });
  }

  async updateThumbnail(id: string, thumbnailFile: Express.Multer.File) {
    await this.findOne(id);
    const uploaded = await this.cloudinary.uploadFile(thumbnailFile);
    const url = uploaded?.secure_url || uploaded?.url;
    return this.prisma.siteContent.update({
      where: { id },
      data: { thumbnailUrl: url },
    });
  }

}
