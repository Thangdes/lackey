"use client";
import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATUSES, statusLabel } from "@/constant/order-status";
import { Search } from "lucide-react";

export type OrdersToolbarProps = {
  code: string; // order code search
  email: string;
  deliveryCode: string;
  status?: string;
  customerType?: "guest" | "registered";
  onCodeChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onDeliveryCodeChange: (value: string) => void;
  onStatusChange: (value?: string) => void;
  onCustomerTypeChange?: (value?: "guest" | "registered") => void;
};

export default function OrdersToolbar(props: OrdersToolbarProps) {
  const { code, email, deliveryCode, status, customerType, onCodeChange, onEmailChange, onDeliveryCodeChange, onStatusChange, onCustomerTypeChange } = props;
  const ALL = "_ALL_";
  const ALL_CUSTOMER = "_ALL_CUSTOMER_";

  const handleCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onCodeChange(e.target.value);
  }, [onCodeChange]);
  const handleEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onEmailChange(e.target.value);
  }, [onEmailChange]);
  const handleDeliveryCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDeliveryCodeChange(e.target.value);
  }, [onDeliveryCodeChange]);

  const handleStatus = useCallback((v: string) => {
    onStatusChange(v === ALL ? undefined : v);
  }, [onStatusChange]);

  const handleCustomerType = useCallback((v: string) => {
    if (!onCustomerTypeChange) return;
    if (v === ALL_CUSTOMER) return onCustomerTypeChange(undefined);
    return onCustomerTypeChange(v as "guest" | "registered");
  }, [onCustomerTypeChange]);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative w-full sm:w-[200px]">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
        <Input placeholder="Mã đơn" value={code} onChange={handleCode} className="pl-8" />
      </div>
      <div className="relative w-full sm:w-[220px]">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
        <Input placeholder="Email" value={email} onChange={handleEmail} className="pl-8" />
      </div>
      <div className="relative w-full sm:w-[220px]">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
        <Input placeholder="Mã vận chuyển" value={deliveryCode} onChange={handleDeliveryCode} className="pl-8" />
      </div>
      <Select value={status ?? ALL} onValueChange={handleStatus}>
        <SelectTrigger className="min-w-[220px]">
          <SelectValue placeholder="Tất cả trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Tất cả trạng thái</SelectItem>
          {ORDER_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={customerType ?? ALL_CUSTOMER} onValueChange={handleCustomerType}>
        <SelectTrigger className="min-w-[220px]">
          <SelectValue placeholder="Tất cả loại khách" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_CUSTOMER}>Tất cả loại khách</SelectItem>
          <SelectItem value="registered">Thành viên (đã đăng ký)</SelectItem>
          <SelectItem value="guest">Khách vãng lai (Guest)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
