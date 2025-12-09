import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseUUIDPipe,
  applyDecorators,
  Delete,
  Query,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AdminGuard } from '@/modules/auth/admin.gaurd';
import { PaginationQueryDto } from '@/infrastructure/common/dto/pagination-query.dto';

interface UserPayload {
  id: string;
}

const AdminAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));

@Controller('ratings')
export class RatingController {
  constructor(
    private readonly ratingService: RatingService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: UserPayload,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    const customer = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { customerId: true },
    });
    return this.ratingService.create(customer.customerId, createRatingDto);
  }

  @Get('product/:productId')
  findForProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query() query: PaginationQueryDto,
    @Query('minRating') minRating?: string,
    @Query('sort') sort?: 'newest' | 'highest' | 'lowest',
  ) {
    const min = minRating ? Number(minRating) : undefined;
    return this.ratingService.findForProductPaginated(productId, {
      page: query.page,
      limit: query.limit,
      minRating: min,
      sort,
    });
  }

  @Get('product/:productId/all')
  findForProductAll(
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.ratingService.findForProduct(productId);
  }

  @Get('admin')
  @AdminAccess()
  findAllAdmin(@Query() query: PaginationQueryDto, @Query('search') search?: string) {
    return this.ratingService.findAllAdmin({ page: query.page, limit: query.limit, search: search || '' });
  }

  @Delete(':id')
  @AdminAccess()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ratingService.remove(id);
  }
}
