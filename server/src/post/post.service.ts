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
import { PostRepository } from './repositories/post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postRepository: PostRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(authorId: string, createPostDto: CreatePostDto) {
    const existingPost = await this.postRepository.findBySlug(createPostDto.slug);
    if (existingPost) {
      throw new ConflictException(
        `Post with slug '${createPostDto.slug}' already exists.`,
      );
    }
    return this.postRepository.create({
      ...createPostDto,
      author: { connect: { id: authorId } },
    });
  }

  async updateThumbnail(postId: string, file: Express.Multer.File) {
    await this.findOne(postId);
    const uploadResult = await this.cloudinaryService.uploadFile(file);
    return this.postRepository.updateThumbnail(postId, uploadResult.secure_url);
  }

  async findAllPublic(query: { page?: number; limit?: number }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const [items, total] = await this.postRepository.findAllPublicPaginated(skip, take);
    return {
      data: items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findAllAdmin(query: { page?: number; limit?: number }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query?.page ?? 1, query?.limit ?? 20);
    const [items, total] = await this.postRepository.findAllAdminPaginated(skip, take);
    return {
      data: items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findBySlug(slug: string) {
    const post = await this.postRepository.findBySlugPublished(slug);
    if (!post) {
      throw new NotFoundException(`Post with slug '${slug}' not found.`);
    }
    return post;
  }

  async findOne(id: string) {
    const post = await this.postRepository.findById(id).catch(() => null);
    if (!post) {
      throw new NotFoundException(`Post with ID '${id}' not found.`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findOne(id);
    return this.postRepository.update(id, updatePostDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.postRepository.delete(id);
  }
}
