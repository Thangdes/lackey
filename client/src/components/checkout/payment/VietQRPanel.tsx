"use client";

import React from "react";

export type VietQRBankInfo = {
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
};

export type VietQRPanelProps = {
  qrUrl: string;
  transferNote: string;
  bank: VietQRBankInfo;
  onCopyNote: () => void;
  onCancel: () => void;
};

export function VietQRPanel({ qrUrl, transferNote, bank, onCopyNote, onCancel }: VietQRPanelProps) {
  // Build a fallback QR URL from bank/account info if provided
  const fallbackQrUrl = (() => {
    const bankCode = bank.bankCode;
    const accountNumber = bank.accountNumber;
    const accountName = bank.accountName;
    if (!bankCode || !accountNumber) return undefined;
    const info = encodeURIComponent(transferNote || "");
    const name = encodeURIComponent(accountName || "");
    // amount is optional here as this panel doesn't receive it; keep default 0
    const amt = 0;
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amt}&addInfo=${info}&accountName=${name}`;
  })();

  return (
    <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="shrink-0 rounded-lg border border-black/10 bg-white p-3 md:sticky md:top-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl || (fallbackQrUrl ?? "")}
            alt="VietQR"
            className="h-48 w-48 md:h-56 md:w-56 object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              try {
                const el = e.currentTarget as HTMLImageElement;
                if (fallbackQrUrl && el.src !== fallbackQrUrl) {
                  el.src = fallbackQrUrl;
                  return;
                }
                const u = new URL(el.src);
                u.searchParams.set("t", String(Date.now()));
                el.src = u.toString();
              } catch {
                if (fallbackQrUrl) {
                  (e.currentTarget as HTMLImageElement).src = fallbackQrUrl;
                }
              }
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm text-black/70">Vui lòng chuyển khoản với nội dung:</div>
          <div className="mt-1 font-mono text-base bg-white rounded-md border border-black/10 px-2 py-1 select-all overflow-x-auto">
            {transferNote}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {bank.bankName && (
              <div><span className="text-black/60">Ngân hàng:</span> <span className="font-medium">{bank.bankName}</span></div>
            )}
            {bank.bankCode && (
              <div><span className="text-black/60">Mã NH:</span> <span className="font-medium">{String(bank.bankCode).toUpperCase()}</span></div>
            )}
            {bank.accountName && (
              <div><span className="text-black/60">Chủ TK:</span> <span className="font-medium">{bank.accountName}</span></div>
            )}
            {bank.accountNumber && (
              <div><span className="text-black/60">Số TK:</span> <span className="font-medium">{bank.accountNumber}</span></div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm hover:bg-black/[0.03]"
              onClick={onCopyNote}
            >
              <span className="inline-flex items-center gap-1.5">Sao chép nội dung</span>
            </button>
            <button
              type="button"
              className="rounded-md border border-red-600 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
              onClick={onCancel}
            >
              <span className="inline-flex items-center gap-1.5">Hủy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
