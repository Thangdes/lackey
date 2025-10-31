import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/auth.gaurd';
import { AdminGuard } from 'src/auth/admin.gaurd';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { applyDecorators } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

const AdminAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));

interface UserPayload {
  id: string;
}

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @AdminAccess()
  create(
    @CurrentUser() user: UserPayload,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(user.id, createPostDto);
  }

  @Post(':id/thumbnail')
  @AdminAccess()
  @UseInterceptors(FileInterceptor('thumbnail'))
  @HttpCode(HttpStatus.OK)
  updateThumbnail(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.postService.updateThumbnail(id, file);
  }

  @Get('admin')
  @AdminAccess()
  findAllAdmin(@Query() query: PaginationQueryDto) {
    return this.postService.findAllAdmin({ page: query.page, limit: query.limit ?? 20 });
  }

  @Get('admin/:id')
  @AdminAccess()
  findOneAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @AdminAccess()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @AdminAccess()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.remove(id);
  }

  @Get()
  findAllPublic(@Query() query: PaginationQueryDto) {
    return this.postService.findAllPublic({ page: query.page, limit: query.limit });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }
}
