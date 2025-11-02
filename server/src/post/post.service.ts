import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import {
  PaginatedResult,
  buildPagination,
  buildPaginationMeta,
} from 'src/common/pagination';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(authorId: string, createPostDto: CreatePostDto) {
    const existingPost = await this.prisma.post.findUnique({
      where: { slug: createPostDto.slug },
    });
    if (existingPost) {
      throw new ConflictException(
        `Post with slug '${createPostDto.slug}' already exists.`,
      );
    }
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: authorId,
      },
    });
  }

  async updateThumbnail(postId: string, file: Express.Multer.File) {
    await this.findOne(postId);
    const uploadResult = await this.cloudinaryService.uploadFile(file);
    return this.prisma.post.update({
      where: { id: postId },
      data: { thumbnailUrl: uploadResult.secure_url },
    });
  }

  async findAllPublic(query: { page?: number; limit?: number }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const where = { isPublished: true } as const;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
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
      this.prisma.post.count({ where }),
    ]);
    return {
      data: items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findAllAdmin(query: { page?: number; limit?: number }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query?.page ?? 1, query?.limit ?? 20);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count(),
    ]);
    return {
      data: items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug: slug, isPublished: true },
      include: { author: { select: { username: true } } },
    });
    if (!post) {
      throw new NotFoundException(`Post with slug '${slug}' not found.`);
    }
    return post;
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID '${id}' not found.`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findOne(id);
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.post.delete({ where: { id } });
  }
}
