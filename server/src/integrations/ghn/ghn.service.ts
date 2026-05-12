import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GhnService {
  private readonly logger = new Logger(GhnService.name);
  private readonly apiUrl: string;
  private readonly token: string;
  private readonly shopId: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.apiUrl = this.configService.get<string>('GHN_API_URL');
    this.token = this.configService.get<string>('GHN_TOKEN');
    this.shopId = +this.configService.get<number>('GHN_SHOP_ID');
  }

  private ensureConfigured() {
    if (!this.apiUrl || !this.token || !this.shopId) {
      throw new Error(
        'GHN configuration (GHN_API_URL, GHN_TOKEN, GHN_SHOP_ID) is missing in .env file',
      );
    }
  }

  private getHeaders() {
    this.ensureConfigured();
    return {
      'Content-Type': 'application/json',
      Token: this.token,
      ShopId: this.shopId.toString(),
    };
  }

  async getProvinces(): Promise<any[]> {
    const cacheKey = 'ghn_provinces';
    const cachedData = await this.cacheManager.get<any[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    try {
      this.ensureConfigured();
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/master-data/province`, {
          headers: { Token: this.token },
        }),
      );
      const provinces = response.data.data;
      // Cache for 1 hour instead of 7 days to reduce Redis storage
      await this.cacheManager.set(cacheKey, provinces, 3600);
      return provinces;
    } catch (error) {
      this.logger.error('Failed to fetch GHN provinces', error.response?.data);
      return [];
    }
  }

  async getDistricts(provinceId: number): Promise<any[]> {
    const cacheKey = `ghn_districts_${provinceId}`;
    const cachedData = await this.cacheManager.get<any[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    try {
      this.ensureConfigured();
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/master-data/district`, {
          headers: { Token: this.token },
          params: { province_id: provinceId },
        }),
      );
      const districts = response.data.data;
      // Cache for 1 hour instead of 7 days to reduce Redis storage
      await this.cacheManager.set(cacheKey, districts, 3600);
      return districts;
    } catch (error) {
      this.logger.error(
        `Failed to fetch GHN districts for province ${provinceId}`,
        error.response?.data,
      );
      return [];
    }
  }

  async getWards(districtId: number): Promise<any[]> {
    const cacheKey = `ghn_wards_${districtId}`;
    const cachedData = await this.cacheManager.get<any[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    try {
      this.ensureConfigured();
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/master-data/ward`, {
          headers: { Token: this.token },
          params: { district_id: districtId },
        }),
      );
      const wards = response.data.data;
      // Cache for 1 hour instead of 7 days to reduce Redis storage
      await this.cacheManager.set(cacheKey, wards, 3600);
      return wards;
    } catch (error) {
      this.logger.error(
        `Failed to fetch GHN wards for district ${districtId}`,
        error.response?.data,
      );
      return [];
    }
  }

  async calculateFee(payload: {
    to_district_id: number;
    to_ward_code: string;
    weight: number;
    insurance_value: number;
    service_type_id?: number;
  }): Promise<{ total: number; [key: string]: any } | null> {
    const fromDistrictId = +this.configService.get<number>(
      'GHN_FROM_DISTRICT_ID',
    );
    if (!fromDistrictId) {
      this.logger.error('GHN_FROM_DISTRICT_ID is not configured in .env');
      return null;
    }
    const requestBody = {
      from_district_id: fromDistrictId,
      to_district_id: payload.to_district_id,
      to_ward_code: payload.to_ward_code,
      weight: payload.weight,
      insurance_value: payload.insurance_value,
      service_type_id: payload.service_type_id || 2,
      height: 15,
      length: 15,
      width: 15,
    };
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/v2/shipping-order/fee`,
          requestBody,
          { headers: this.getHeaders() },
        ),
      );
      return response.data.data;
    } catch (error) {
      this.logger.error(
        'Failed to calculate GHN shipping fee',
        error.response?.data,
      );
      return null;
    }
  }

  async createShippingOrder(payload: Record<string, unknown>) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/v2/shipping-order/create`,
          payload,
          { headers: this.getHeaders() },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to create GHN shipping order',
        error.response?.data,
      );
      throw error;
    }
  }

  async getShippingOrderDetail(orderCode: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/v2/shipping-order/detail`,
          { order_code: orderCode },
          { headers: this.getHeaders() },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch GHN order detail for ${orderCode}`,
        error.response?.data,
      );
      throw error;
    }
  }
}
