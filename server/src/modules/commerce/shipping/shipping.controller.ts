import { Controller, Post, Body, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CalculateFeeDto } from './dto/calculate-fee.dto';
import { GetDistrictsDto } from './dto/get-districts.dto';
import { GetWardsDto } from './dto/get-wards.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { AdminGuard } from '@/modules/auth/admin.gaurd';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate-fee')
  async calculateShippingFee(@Body() calculateFeeDto: CalculateFeeDto) {
    const fee = await this.shippingService.calculateFee(calculateFeeDto);
    return { shippingFee: fee };
  }

  @Get('districts-info')
  getDistrictShippingInfo() {
    return this.shippingService.getDistrictShippingInfo();
  }

  @Get('provinces')
  async getProvinces() {
    return this.shippingService.getProvinces();
  }

  @Post('districts')
  async getDistricts(@Body() getDistrictsDto: GetDistrictsDto) {
    return this.shippingService.getDistricts(getDistrictsDto.province_id);
  }

  @Post('wards')
  async getWards(@Body() getWardsDto: GetWardsDto) {
    return this.shippingService.getWards(getWardsDto.district_id);
  }

  @Post('ghn/:orderId/create')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createGhnShipment(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.shippingService.createGhnShipmentForOrder(orderId);
  }

  @Get('ghn/:orderId/tracking')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getGhnTracking(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.shippingService.getGhnTracking(orderId);
  }
}
