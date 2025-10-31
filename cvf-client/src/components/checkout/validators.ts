import { CHECKOUT_ERROR } from "@/constant/checkout";
import { cartService } from "@/service/cart.service";
import { cartKeys } from "@/constant/key/cart";
import type { QueryClient } from "@tanstack/react-query";

export function validate(params: {
  fullName: string;
  user: unknown;
  email: string;
  phone: string;
  city: string;
  street: string;
  shipToDifferent: boolean;
  altFullName: string;
  altPhone: string;
  altCity: string;
  altStreet: string;
  canChooseDistrict: (city: string) => boolean;
  isCartLoading: boolean;
  itemsLength: number;
}): string | null {
  const {
    fullName,
    user,
    email,
    phone,
    city,
    street,
    shipToDifferent,
    altFullName,
    altPhone,
    altStreet,
  } = params;

  if (!fullName.trim()) return CHECKOUT_ERROR.fullNameRequired;
  // Email is not required - will use default email if empty
  // Phone is always required
  if (!phone.trim()) return CHECKOUT_ERROR.phoneRequired;
  // If authenticated, username is required
  if (user && typeof user === 'object' && user !== null) {
    const u = user as { username?: string };
    if (!u.username || !String(u.username).trim()) {
      return "Vui lòng cập nhật Username trong hồ sơ tài khoản";
    }
  }
  if (!city) return CHECKOUT_ERROR.cityRequired;
  if (!street.trim()) return CHECKOUT_ERROR.streetRequired;
  if (shipToDifferent) {
    if (!altFullName.trim()) return CHECKOUT_ERROR.altFullNameRequired;
    if (!altPhone.trim()) return CHECKOUT_ERROR.altPhoneRequired;
    if (!altStreet.trim()) return CHECKOUT_ERROR.altStreetRequired;
  }
  return null;
}

export function validateForVietQR(params: {
  fullName: string;
  user: unknown;
  email: string;
  phone: string;
  city?: string;
  district?: string;
  ward?: string;
  street?: string;
}): string | null {
  const { fullName, phone, email, user, city, district, ward, street } = params;
  if (!fullName.trim()) return CHECKOUT_ERROR.fullNameRequired;
  if (!phone.trim()) return CHECKOUT_ERROR.phoneRequired;
  
  if (!city || city.trim() === "") {
    return "Vui lòng chọn Tỉnh/Thành phố";
  }
  if (!district || district.trim() === "") {
    return "Vui lòng chọn Quận/Huyện";
  }
  if (!ward || ward.trim() === "") {
    return "Vui lòng chọn Phường/Xã";
  }
  if (!street || street.trim() === "") {
    return "Vui lòng nhập Địa chỉ (số nhà, tên đường)";
  }
  
  if (user && typeof user === 'object' && user !== null) {
    const u = user as { username?: string };
    if (!u.username || !String(u.username).trim()) {
      return "Vui lòng cập nhật Username trong hồ sơ tài khoản";
    }
  }
  return null;
}

export async function validateCartServerSide(qc: QueryClient): Promise<{
  blockedError?: string;
  globalWarnings: string[];
  itemWarnings: Record<string, string[]>;
}>
 {
  const gWarns: string[] = [];
  const iWarns: Record<string, string[]> = {};
  try {
    const serverCart = await cartService.getCart();
    const serverItems = Array.isArray(serverCart?.items) ? serverCart.items : [];
    for (const it of serverItems) {
      const qty = Math.floor(Number(it.quantity ?? 0));
      const price = Number(it?.productVariant?.price ?? 0);
      const sku = it.productVariant?.sku || it.productVariantId;
      if (!Number.isFinite(qty) || qty <= 0) {
        try {
          await cartService.updateItem(it.id, { quantity: 1 });
        } catch {}
        if (!iWarns[sku]) iWarns[sku] = [];
        iWarns[sku].push("Số lượng tối thiểu là 1. Hệ thống đã tự điều chỉnh.");
      }
      if (!Number.isFinite(price) || price <= 0) {
        if (!iWarns[sku]) iWarns[sku] = [];
        iWarns[sku].push("Giá sản phẩm chưa khả dụng. Vui lòng kiểm tra lại.");
        if (!gWarns.includes("Một số sản phẩm có giá chưa khả dụng."))
          gWarns.push("Một số sản phẩm có giá chưa khả dụng.");
      }
    }
    if (Object.keys(iWarns).length > 0) {
      try {
        qc.invalidateQueries({ queryKey: cartKeys.root() });
        qc.invalidateQueries({ queryKey: cartKeys.items() });
      } catch {}
    }
    return { globalWarnings: gWarns, itemWarnings: iWarns };
  } catch {
    return {
      globalWarnings: ["Không thể xác thực giỏ hàng ngay lúc này. Hãy kiểm tra lại sau."],
      itemWarnings: {},
    };
  }
}
