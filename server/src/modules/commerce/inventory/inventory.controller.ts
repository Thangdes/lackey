import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { AdminGuard } from '@/modules/auth/admin.gaurd';
import { InventoryService } from './inventory.service';
import { CreateInventoryMovementDto } from './dto/create-movement.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { PaginationQueryDto } from '@/infrastructure/common/dto/pagination-query.dto';
import { ParseObjectIdPipe } from '@/infrastructure/common/pipes/parse-object-id.pipe';

interface UserPayload {
  id: string;
}

const AdminAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('movements')
  @AdminAccess()
  createMovement(
    @Body() dto: CreateInventoryMovementDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.inventoryService.createMovement(dto, user.id);
  }

  @Get('movements')
  @AdminAccess()
  listMovements(
    @Query() query: PaginationQueryDto,
    @Query('productVariantId') productVariantId?: string,
  ) {
    return this.inventoryService.listMovements({
      page: query.page,
      limit: query.limit,
      productVariantId,
    });
  }

  @Get('variants/:variantId/reserved')
  @AdminAccess()
  reserved(@Param('variantId', ParseObjectIdPipe) variantId: string) {
    return this.inventoryService.getReservedStock(variantId);
  }

  @Get('variants/:variantId/summary')
  @AdminAccess()
  summary(@Param('variantId', ParseObjectIdPipe) variantId: string) {
    return this.inventoryService.getVariantSummary(variantId);
  }
}
