"use client";
import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATUSES, statusLabel } from "@/constant/order-status";
import { Search } from "lucide-react";

export type OrdersToolbarProps = {
  code: string;
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

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onCodeChange(e.target.value);
  }, [onCodeChange]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onEmailChange(e.target.value);
  }, [onEmailChange]);

  const handleDeliveryCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDeliveryCodeChange(e.target.value);
  }, [onDeliveryCodeChange]);

  const handleStatusChange = useCallback((value: string) => {
    onStatusChange(value === "all" ? undefined : value);
  }, [onStatusChange]);

  const handleCustomerTypeChange = useCallback((value: string) => {
    if (onCustomerTypeChange) {
      onCustomerTypeChange(value === "all" ? undefined : (value as "guest" | "registered"));
    }
  }, [onCustomerTypeChange]);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs mb-1">Mã đơn hàng</label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
          <Input className="pl-8" placeholder="Tìm theo mã đơn hàng" value={code} onChange={handleCodeChange} />
        </div>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs mb-1">Email khách hàng</label>
        <Input placeholder="Tìm theo email" value={email} onChange={handleEmailChange} />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs mb-1">Mã vận chuyển</label>
        <Input placeholder="Tìm theo mã vận chuyển" value={deliveryCode} onChange={handleDeliveryCodeChange} />
      </div>
      <div className="w-[180px]">
        <label className="block text-xs mb-1">Trạng thái</label>
        <Select value={status || "all"} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-[180px]">
        <label className="block text-xs mb-1">Loại khách</label>
        <Select value={customerType || "all"} onValueChange={handleCustomerTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="registered">Đã đăng ký</SelectItem>
            <SelectItem value="guest">Khách vãng lai</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
