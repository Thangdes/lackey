import { http } from "@/utils/http";
import { API } from "@/constant/api";
import type { GHNProvince, GHNDistrict, GHNWard, GHNResponse } from "@/type/ghn";

const LS_KEY = "shipping_fee_fixed_v1";

export const shippingService = {
  // Call BE to calculate fee by city, district, and ward (updated API)
  calculateFee: async (payload: { city: string; district: string; ward: string; totalWeight?: number; subtotal?: number }): Promise<number> => {
    const res = await http.post<{ shippingFee: number }>(API.shipping.calculateFee, payload);
    return Number(res?.shippingFee || 0);
  },

  // Fetch HCMC district shipping info from BE
  getDistrictsInfo: async (): Promise<{ freeship: string[]; noFreeship: string[]; standardFee: number; otherProvincesFee: number; }> => {
    return http.get(API.shipping.districtsInfo);
  },

  // Get a fixed fee on FE: cache first value in localStorage and reuse
  getFixedFee: async (fallbackCity = "Tp. Hồ Chí Minh", fallbackDistrict = "Quận 1", fallbackWard = "Phường Bến Nghé"): Promise<number> => {
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(LS_KEY);
        if (raw != null) {
          const val = Number(raw);
          if (Number.isFinite(val)) return val;
        }
      }
    } catch {}

    const fee = await shippingService.calculateFee({ 
      city: fallbackCity, 
      district: fallbackDistrict, 
      ward: fallbackWard 
    });
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LS_KEY, String(fee));
      }
    } catch {}
    return fee;
  },

  // Get provinces from GHN API
  getProvinces: async (): Promise<GHNResponse<GHNProvince[]>> => {
    return http.get<GHNResponse<GHNProvince[]>>(API.shipping.provinces);
  },

  // Get districts by province ID
  getDistricts: async (provinceId: number): Promise<GHNResponse<GHNDistrict[]>> => {
    return http.post<GHNResponse<GHNDistrict[]>>(API.shipping.districts, { province_id: provinceId });
  },

  // Get wards by district ID
  getWards: async (districtId: number): Promise<GHNResponse<GHNWard[]>> => {
    return http.post<GHNResponse<GHNWard[]>>(API.shipping.wards, { district_id: districtId });
  },
};
