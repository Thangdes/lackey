import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { BaseRepository } from '@/infrastructure/common/base/base.repository';
import { Post } from '@prisma/client';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor(prisma: PrismaService) {
    super(prisma, 'post');
  }

  async findBySlug(slug: string) {
    return this.model.findUnique({
      where: { slug },
    });
  }

  async findBySlugPublished(slug: string) {
    return this.model.findUnique({
      where: { slug, isPublished: true },
      include: { author: { select: { username: true } } },
    });
  }

  async findAllPublicPaginated(skip: number, take: number) {
    const where = { isPublished: true } as const;
    return this.prisma.$transaction([
      this.model.findMany({
        skip,
        take,
        where,
        select: {
          title: true,
          slug: true,
          excerpt: true,
          thumbnailUrl: true,
          createdAt: true,
          author: { select: { username: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.model.count({ where }),
    ]);
  }

  async findAllAdminPaginated(skip: number, take: number) {
    return this.prisma.$transaction([
      this.model.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.model.count(),
    ]);
  }

  async updateThumbnail(postId: string, thumbnailUrl: string) {
    return this.model.update({
      where: { id: postId },
      data: { thumbnailUrl },
    });
  }
}
