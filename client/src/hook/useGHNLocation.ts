import { useQuery } from '@tanstack/react-query';
import { shippingService } from '@/service/shipping.service';
import type { GHNProvince, GHNDistrict, GHNWard, GHNResponse } from '@/type/ghn';

export function useProvinces() {
  return useQuery<GHNResponse<GHNProvince[]>>({
    queryKey: ['ghn', 'provinces'],
    queryFn: () => shippingService.getProvinces(),
    staleTime: 1000 * 60 * 60, 
    gcTime: 1000 * 60 * 60 * 24, 
  });
}

export function useDistricts(provinceId: number | null) {
  return useQuery<GHNResponse<GHNDistrict[]>>({
    queryKey: ['ghn', 'districts', provinceId],
    queryFn: () => shippingService.getDistricts(provinceId!),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60, 
    gcTime: 1000 * 60 * 60 * 24, 
  });
}

export function useWards(districtId: number | null) {
  return useQuery<GHNResponse<GHNWard[]>>({
    queryKey: ['ghn', 'wards', districtId],
    queryFn: () => shippingService.getWards(districtId!),
    enabled: !!districtId,
    staleTime: 1000 * 60 * 60, 
    gcTime: 1000 * 60 * 60 * 24, 
  });
}
