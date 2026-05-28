import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Request, Response } from 'express';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { BulkSetCartDto } from './dto/bulk-set-cart.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';

interface UserPayload {
  id: string;
}

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private prisma: PrismaService,
  ) {}

  private async getCustomerId(userPayload: UserPayload): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userPayload.id },
      select: { customerId: true },
    });
    if (!user?.customerId) {
      throw new BadRequestException('Only customer accounts can use the cart.');
    }
    return user.customerId;
  }

  @Get()
  async getCart(@CurrentUser() user: UserPayload, @Req() req: Request) {
    const customerId = await this.getCustomerId(user);
    const discountCode = req.cookies?.discountCode as string | undefined;
    return this.cartService.getCart(customerId, discountCode);
  }

  @Post('/items')
  @HttpCode(HttpStatus.OK)
  async addItemToCart(
    @CurrentUser() user: UserPayload,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const customerId = await this.getCustomerId(user);
    return this.cartService.addItemToCart(customerId, addToCartDto);
  }

  @Patch('/items/:itemId')
  async updateItemQuantity(
    @CurrentUser() user: UserPayload,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const customerId = await this.getCustomerId(user);
    return this.cartService.updateItemQuantity(
      customerId,
      itemId,
      updateCartItemDto,
    );
  }

  @Delete('/items/:itemId')
  async removeItem(
    @CurrentUser() user: UserPayload,
    @Param('itemId') itemId: string,
  ) {
    const customerId = await this.getCustomerId(user);
    return this.cartService.removeItem(customerId, itemId);
  }

  @Post('/clear')
  async clearCart(@CurrentUser() user: UserPayload) {
    const customerId = await this.getCustomerId(user);
    return this.cartService.clearCart(customerId);
  }

  @Post('/items/bulk-set')
  @HttpCode(HttpStatus.OK)
  async bulkSet(@CurrentUser() user: UserPayload, @Body() dto: BulkSetCartDto) {
    const customerId = await this.getCustomerId(user);
    return this.cartService.bulkSetCart(customerId, dto.items);
  }

  @Post('/apply-discount')
  @HttpCode(HttpStatus.OK)
  async applyDiscount(
    @CurrentUser() user: UserPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: ApplyDiscountDto,
  ) {
    const customerId = await this.getCustomerId(user);
    const result = await this.cartService.applyDiscount(customerId, dto.code);
    const originHeader = (req.headers?.origin as string | undefined) || '';
    const hostToTest = originHeader || `http://${req.hostname || ''}`;
    const isLocalhost =
      /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(hostToTest);
    res.cookie('discountCode', dto.code, {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: isLocalhost ? 'lax' : 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @Post('/remove-discount')
  @HttpCode(HttpStatus.OK)
  async removeDiscount(
    @CurrentUser() user: UserPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const customerId = await this.getCustomerId(user);
    const originHeader = (req.headers?.origin as string | undefined) || '';
    const hostToTest = originHeader || `http://${req.hostname || ''}`;
    const isLocalhost =
      /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(hostToTest);
    res.clearCookie('discountCode', {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: isLocalhost ? 'lax' : 'none',
      path: '/',
    });
    return this.cartService.removeDiscount(customerId);
  }
}
