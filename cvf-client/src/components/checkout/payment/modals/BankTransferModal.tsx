"use client";

import { X, Copy } from "lucide-react";
import { PAYMENT_QR } from "@/config/payment";

type Props = {
  open: boolean;
  total: number;
  transferNote: string;
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  onClose: () => void;
  onCopyNote: () => void;
  onCopyAccount?: () => void;
};

export const BankTransferModal = ({
  open,
  total,
  transferNote,
  bankCode,
  bankName,
  accountNumber,
  accountName,
  onClose,
  onCopyNote,
  onCopyAccount,
}: Props) => {
  if (!open) return null;
  const bk = bankName || (bankCode ? bankCode.toUpperCase() : "-");
  const accNo = accountNumber || PAYMENT_QR.accountNumber;
  const accName = accountName || PAYMENT_QR.accountName;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="w-full max-w-md rounded-xl sm:rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm sm:text-base font-semibold line-clamp-2 pr-2">Thông tin chuyển khoản ngân hàng</h4>
          <button onClick={onClose} className="shrink-0 rounded-full p-2 text-black/60 hover:bg-black/5" aria-label="Đóng">
            <X size={18} className="sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 space-y-2">
            <div className="flex items-center justify-between"><span className="text-black/60">Ngân hàng</span><span className="font-medium">{bk}</span></div>
            <div className="flex items-center justify-between">
              <span className="text-black/60">Số tài khoản</span>
              <span className="font-medium flex items-center gap-2">
                {accNo}
                {onCopyAccount && (
                  <button onClick={onCopyAccount} className="rounded-md border border-black/10 px-2 py-1 text-xs hover:bg-black/5" title="Sao chép STK">
                    <Copy size={14} />
                  </button>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between"><span className="text-black/60">Chủ tài khoản</span><span className="font-medium">{accName}</span></div>
            <div className="flex items-center justify-between"><span className="text-black/60">Số tiền</span><span className="font-semibold">{total.toLocaleString("vi-VN")} đ</span></div>
            <div className="flex items-center justify-between">
              <span className="text-black/60">Nội dung chuyển khoản</span>
              <span className="font-medium flex items-center gap-2">
                {transferNote}
                <button onClick={onCopyNote} className="rounded-md border border-black/10 px-2 py-1 text-xs hover:bg-black/5" title="Sao chép nội dung">
                  <Copy size={14} />
                </button>
              </span>
            </div>
          </div>
          <p className="text-xs text-black/60">Vui lòng chuyển khoản đúng số tiền và nội dung để hệ thống tự động đối soát nhanh hơn.</p>
          <div className="flex items-center justify-end gap-2">
            <button onClick={onClose} className="rounded-full border border-black/15 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-black/5">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
};
