import {
  Controller,
  Delete,
  Get,
  ForbiddenException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PaginationQueryDto } from '@/infrastructure/common/dto/pagination-query.dto';
import { ParseObjectIdPipe } from '@/infrastructure/common/pipes/parse-object-id.pipe';

interface UserPayload {
  id: string;
}

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
    private readonly prisma: PrismaService,
  ) {}

  private async getCustomerIdFromUser(user: UserPayload) {
    const u = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { customerId: true },
    });
    if (!u?.customerId) {
      throw new ForbiddenException('Only customer accounts can use wishlist.');
    }
    return u.customerId;
  }

  @Get()
  async list(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationQueryDto,
  ) {
    const customerId = await this.getCustomerIdFromUser(user);
    return this.wishlistService.list(customerId, {
      page: query.page,
      limit: query.limit,
    });
  }

  @Post(':productId')
  async add(
    @CurrentUser() user: UserPayload,
    @Param('productId', ParseObjectIdPipe) productId: string,
  ) {
    const customerId = await this.getCustomerIdFromUser(user);
    return this.wishlistService.add(customerId, productId);
  }

  @Delete(':productId')
  async remove(
    @CurrentUser() user: UserPayload,
    @Param('productId', ParseObjectIdPipe) productId: string,
  ) {
    const customerId = await this.getCustomerIdFromUser(user);
    return this.wishlistService.remove(customerId, productId);
  }

  @Get(':productId')
  async isWishlisted(
    @CurrentUser() user: UserPayload,
    @Param('productId', ParseObjectIdPipe) productId: string,
  ) {
    const customerId = await this.getCustomerIdFromUser(user);
    return this.wishlistService.isWishlisted(customerId, productId);
  }
}
