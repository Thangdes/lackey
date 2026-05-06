import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GhnService } from '@/integrations/ghn/ghn.service';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { OrderShippedEvent } from '@/infrastructure/events/commerce.events';
import { OrderStatus } from '@prisma/client';

const DEFAULT_SHIPPING_FEE = 35000;
const DEFAULT_WEIGHT_PER_ITEM = 200;

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);

  constructor(
    private readonly ghnService: GhnService,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private normalizeString(str: string): string {
    if (!str) return '';
    return str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/\b(tp|thanh pho)\b/g, 'thanh pho')
      .replace(/\b(q|quan)\b/g, 'quan')
      .replace(/\b(p|phuong)\b/g, 'phuong')
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async createGhnShipmentForOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        shippingAddress: true,
        orderItems: { include: { productVariant: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.CONFIRMED && order.status !== OrderStatus.PREPARING_SHIPMENT) {
      throw new BadRequestException('Order must be CONFIRMED or PREPARING_SHIPMENT to create shipment');
    }

    if (order.deliveryCode) {
      return { success: true, message: 'Shipment already created', deliveryCode: order.deliveryCode };
    }

    const city = order.shippingAddress?.city;
    const district = order.shippingAddress?.district;
    const ward = order.shippingAddress?.ward;
    const street = order.shippingAddress?.street;
    const phoneNumber = order.shippingAddress?.phoneNumber;
    const recipientName = order.shippingAddress?.recipientName;

    if (!city || !district || !ward || !street || !phoneNumber || !recipientName) {
      throw new BadRequestException('Shipping address is incomplete for GHN shipment creation');
    }

    const provinces = await this.ghnService.getProvinces();
    const province = provinces.find((p) =>
      this.normalizeString(city).includes(this.normalizeString(p.ProvinceName)),
    );
    if (!province) {
      throw new BadRequestException(`Cannot map city to GHN province: ${city}`);
    }

    const districts = await this.ghnService.getDistricts(province.ProvinceID);
    const districtData = districts.find(
      (d) => this.normalizeString(d.DistrictName) === this.normalizeString(district),
    );
    if (!districtData) {
      throw new BadRequestException(`Cannot map district to GHN district: ${district}`);
    }

    const wards = await this.ghnService.getWards(districtData.DistrictID);
    const wardData = wards.find(
      (w) => this.normalizeString(w.WardName) === this.normalizeString(ward),
    );
    if (!wardData) {
      throw new BadRequestException(`Cannot map ward to GHN ward: ${ward}`);
    }

    const totalWeight = order.orderItems.reduce(
      (sum, item) => sum + (item.quantity || 0) * DEFAULT_WEIGHT_PER_ITEM,
      0,
    );

    const payload: Record<string, unknown> = {
      to_name: recipientName,
      to_phone: phoneNumber,
      to_address: street,
      to_ward_code: wardData.WardCode,
      to_district_id: districtData.DistrictID,
      weight: Math.max(1, totalWeight),
      insurance_value: Math.max(0, Math.floor(Number(order.subtotalAmount) || 0)),
      cod_amount: 0,
      payment_type_id: 1,
      required_note: 'KHONGCHOXEMHANG',
      note: `Order ${order.orderCode}`,
      client_order_code: order.orderCode,
      items: order.orderItems.map((item) => ({
        name: item.productVariant?.name || 'Item',
        quantity: item.quantity,
        weight: DEFAULT_WEIGHT_PER_ITEM,
      })),
    };

    const result = await this.ghnService.createShippingOrder(payload);
    const ghnOrderCode = result?.data?.order_code || result?.data?.orderCode;
    if (!ghnOrderCode) {
      throw new BadRequestException('GHN did not return order_code');
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        deliveryCode: String(ghnOrderCode),
        status: OrderStatus.PREPARING_SHIPMENT,
      },
      select: { id: true, orderCode: true, deliveryCode: true, status: true },
    });

    // Emit event để gửi email thông báo vận chuyển cho khách
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id: order.customerId },
        select: { email: true, fullName: true },
      });
      if (customer?.email) {
        this.eventEmitter.emit(
          'order.shipped',
          new OrderShippedEvent(
            customer.email,
            updated.orderCode,
            updated.deliveryCode,
            customer.fullName,
          ),
        );
      }
    } catch (emitErr) {
      this.logger.warn(`Could not emit order.shipped event for order ${orderId}: ${emitErr?.message}`);
    }

    return { success: true, message: 'GHN shipment created', data: updated, ghn: result };
  }

  async getGhnTracking(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, orderCode: true, deliveryCode: true },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (!order.deliveryCode) {
      throw new BadRequestException('Order has no deliveryCode yet');
    }

    const detail = await this.ghnService.getShippingOrderDetail(order.deliveryCode);
    return { success: true, order, ghn: detail };
  }

  async calculateFee(params: {
    city: string;
    district: string;
    ward: string;
    totalWeight?: number;
    subtotal?: number;
  }): Promise<number> {
    const { city, district, ward, totalWeight, subtotal } = params;

    this.logger.log(`[SHIPPING_DEBUG] Calculating fee for: ${JSON.stringify(params)}`);

    if (!city || !district || !ward) {
      this.logger.warn(
        'Incomplete address provided for fee calculation, returning default fee.',
      );
      return DEFAULT_SHIPPING_FEE;
    }

    try {
      const provinces = await this.ghnService.getProvinces();
      const normalizedCity = this.normalizeString(city);
      this.logger.log(`[SHIPPING_DEBUG] Normalized city: "${normalizedCity}"`);
      this.logger.log(`[SHIPPING_DEBUG] Available provinces: ${provinces.map(p => p.ProvinceName).join(', ')}`);
      
      const province = provinces.find((p) =>
        normalizedCity.includes(this.normalizeString(p.ProvinceName)),
      );
      if (!province) {
        this.logger.warn(
          `Province not found for "${city}" (normalized: "${normalizedCity}"), returning default fee.`,
        );
        return DEFAULT_SHIPPING_FEE;
      }
      
      this.logger.log(`[SHIPPING_DEBUG] Found province: ${province.ProvinceName} (ID: ${province.ProvinceID})`);

      const districts = await this.ghnService.getDistricts(province.ProvinceID);
      const normalizedDistrict = this.normalizeString(district);
      this.logger.log(`[SHIPPING_DEBUG] Normalized district: "${normalizedDistrict}"`);
      this.logger.log(`[SHIPPING_DEBUG] Available districts: ${districts.map(d => d.DistrictName).join(', ')}`);
      
      const districtData = districts.find(
        (d) => this.normalizeString(d.DistrictName) === normalizedDistrict,
      );
      if (!districtData) {
        this.logger.warn(
          `District not found for "${district}" (normalized: "${normalizedDistrict}") in province "${city}", returning default fee.`,
        );
        return DEFAULT_SHIPPING_FEE;
      }
      
      this.logger.log(`[SHIPPING_DEBUG] Found district: ${districtData.DistrictName} (ID: ${districtData.DistrictID})`);

      const wards = await this.ghnService.getWards(districtData.DistrictID);
      const normalizedWard = this.normalizeString(ward);
      this.logger.log(`[SHIPPING_DEBUG] Normalized ward: "${normalizedWard}"`);
      this.logger.log(`[SHIPPING_DEBUG] Available wards: ${wards.map(w => w.WardName).join(', ')}`);
      
      const wardData = wards.find(
        (w) => this.normalizeString(w.WardName) === normalizedWard,
      );
      if (!wardData) {
        this.logger.warn(
          `Ward not found for "${ward}" (normalized: "${normalizedWard}") in district "${district}", returning default fee.`,
        );
        return DEFAULT_SHIPPING_FEE;
      }
      
      this.logger.log(`[SHIPPING_DEBUG] Found ward: ${wardData.WardName} (Code: ${wardData.WardCode})`);

      const feeData = await this.ghnService.calculateFee({
        to_district_id: districtData.DistrictID,
        to_ward_code: wardData.WardCode,
        weight: totalWeight ?? DEFAULT_WEIGHT_PER_ITEM,
        insurance_value: subtotal ?? 0,
      });

      this.logger.log(`[SHIPPING_DEBUG] GHN API response: ${JSON.stringify(feeData)}`);
      const finalFee = feeData?.total || DEFAULT_SHIPPING_FEE;
      this.logger.log(`[SHIPPING_DEBUG] Final calculated fee: ${finalFee}`);
      
      return finalFee;
    } catch (error) {
      this.logger.error('An error occurred during fee calculation', error);
      return DEFAULT_SHIPPING_FEE;
    }
  }

  getDistrictShippingInfo() {
    this.logger.warn(
      'DEPRECATED API CALL: getDistrictShippingInfo() was called. Frontend should be updated to use new GHN location APIs.',
    );
    return {
      freeship: [],
      noFreeship: [],
      standardFee: 30000,
      otherProvincesFee: 35000,
      otherProvincesFarFee: 50000, 
      distanceThresholdKm: 100,
    };
  }

  async getProvinces() {
    try {
      const provinces = await this.ghnService.getProvinces();
      return {
        code: 200,
        message: 'Success',
        data: provinces.map(p => ({
          ProvinceID: p.ProvinceID,
          ProvinceName: p.ProvinceName,
          CountryID: p.CountryID,
          Code: p.Code,
          NameExtension: p.NameExtension || []
        }))
      };
    } catch (error) {
      this.logger.error('Error fetching provinces from GHN', error);
      throw error;
    }
  }

  async getDistricts(provinceId: number) {
    try {
      const districts = await this.ghnService.getDistricts(provinceId);
      return {
        code: 200,
        message: 'Success',
        data: districts.map(d => ({
          DistrictID: d.DistrictID,
          ProvinceID: d.ProvinceID,
          DistrictName: d.DistrictName,
          Code: d.Code,
          Type: d.Type,
          SupportType: d.SupportType,
          NameExtension: d.NameExtension || [],
          IsEnable: d.IsEnable,
          CanUpdateCOD: d.CanUpdateCOD,
          Status: d.Status
        }))
      };
    } catch (error) {
      this.logger.error(`Error fetching districts for province ${provinceId}`, error);
      throw error;
    }
  }

  async getWards(districtId: number) {
    try {
      const wards = await this.ghnService.getWards(districtId);
      return {
        code: 200,
        message: 'Success',
        data: wards.map(w => ({
          WardCode: w.WardCode,
          DistrictID: w.DistrictID,
          WardName: w.WardName,
          NameExtension: w.NameExtension || [],
          CanUpdateCOD: w.CanUpdateCOD,
          SupportType: w.SupportType,
          Status: w.Status
        }))
      };
    } catch (error) {
      this.logger.error(`Error fetching wards for district ${districtId}`, error);
      throw error;
    }
  }
}
