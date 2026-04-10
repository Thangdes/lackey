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

interface UserPayload {
  id: string;
}

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private prisma: PrismaService,
  ) { }

  private async getCartIdentifier(
    userPayload: UserPayload | null,
    req: Request,
  ) {
    if (userPayload) {
      const user = await this.prisma.user.findUnique({
        where: { id: userPayload.id },
        select: { customerId: true },
      });
      return { customerId: user?.customerId };
    }
    if (!req.cookies.guestCartId) {
      return { guestCartId: undefined };
    }
    return { guestCartId: req.cookies.guestCartId };
  }

  @Get()
  async getCart(@CurrentUser() user: UserPayload | null, @Req() req: Request) {
    const identifier = await this.getCartIdentifier(user, req);
    const discountCode = req.cookies?.discountCode as string | undefined;
    return this.cartService.getCart(identifier, discountCode);
  }

  @Post('/items')
  @HttpCode(HttpStatus.OK)
  async addItemToCart(
    @CurrentUser() user: UserPayload | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const identifier = await this.getCartIdentifier(user, req);
    const updatedCart = await this.cartService.addItemToCart(
      identifier,
      addToCartDto,
    );

    if (!identifier.customerId && !req.cookies.guestCartId) {
      const isProduction = process.env.NODE_ENV === 'production';
      const secureFlag = isProduction;
      res.cookie('guestCartId', updatedCart.cartId, {
        httpOnly: true,
        secure: secureFlag,
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }
    return updatedCart;
  }

  @Patch('/items/:itemId')
  async updateItemQuantity(
    @CurrentUser() user: UserPayload | null,
    @Req() req: Request,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const identifier = await this.getCartIdentifier(user, req);
    return this.cartService.updateItemQuantity(identifier, itemId, updateCartItemDto);
  }

  @Delete('/items/:itemId')
  async removeItem(
    @CurrentUser() user: UserPayload | null,
    @Req() req: Request,
    @Param('itemId') itemId: string,
  ) {
    const identifier = await this.getCartIdentifier(user, req);
    return this.cartService.removeItem(identifier, itemId);
  }

  @Post('/clear')
  async clearCart(
    @CurrentUser() user: UserPayload | null,
    @Req() req: Request,
  ) {
    const identifier = await this.getCartIdentifier(user, req);
    return this.cartService.clearCart(identifier);
  }

  @Post('/items/bulk-set')
  @HttpCode(HttpStatus.OK)
  async bulkSet(
    @CurrentUser() user: UserPayload | null,
    @Req() req: Request,
    @Body() dto: BulkSetCartDto,
  ) {
    const identifier = await this.getCartIdentifier(user, req);
    return this.cartService.bulkSetCart(identifier, dto.items);
  }

  @Post('/apply-discount')
  @HttpCode(HttpStatus.OK)
  async applyDiscount(
    @CurrentUser() user: UserPayload | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: ApplyDiscountDto,
  ) {
    const identifier = await this.getCartIdentifier(user, req);
    const result = await this.cartService.applyDiscount(identifier, dto.code);
    const originHeader = (req.headers?.origin as string | undefined) || '';
    const hostToTest = originHeader || `http://${req.hostname || ''}`;
    const isLocalhost = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(hostToTest);
    res.cookie('discountCode', dto.code, {
      httpOnly: true,
      secure: isLocalhost ? false : true,
      sameSite: isLocalhost ? 'lax' : 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @Post('/remove-discount')
  @HttpCode(HttpStatus.OK)
  async removeDiscount(
    @CurrentUser() user: UserPayload | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const identifier = await this.getCartIdentifier(user, req);
    const originHeader = (req.headers?.origin as string | undefined) || '';
    const hostToTest = originHeader || `http://${req.hostname || ''}`;
    const isLocalhost = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(hostToTest);
    res.clearCookie('discountCode', {
      httpOnly: true,
      secure: isLocalhost ? false : true,
      sameSite: isLocalhost ? 'lax' : 'none',
      path: '/',
    });
    return this.cartService.removeDiscount(identifier);
  }
}
