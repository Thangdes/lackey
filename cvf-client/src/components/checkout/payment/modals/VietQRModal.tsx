"use client";

import { X } from "lucide-react";
import { VIETQR_MODAL } from "@/constant/checkout";
import { QRPanel } from "../QRPanel";
import { BankInfo } from "../BankInfo";

type Props = {
  open: boolean;
  qrUrl: string;
  total: number;
  transferNote: string;
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  onClose: () => void;
  onCopy: () => void;
};

export const VietQRModal = ({ open, qrUrl, total, transferNote, bankCode, bankName, accountNumber, accountName, onClose, onCopy }: Props) => {
  if (!open) return null;
  const bk = bankName || (bankCode ? bankCode.toUpperCase() : "-");
  const accNo = accountNumber || "-";
  const accName = accountName || "-";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="w-full max-w-md rounded-xl sm:rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm sm:text-base font-semibold truncate">{VIETQR_MODAL.title}</h4>
          <button onClick={onClose} className="shrink-0 rounded-full p-2 text-black/60 hover:bg-black/5" aria-label={VIETQR_MODAL.closeAria}><X size={18} className="sm:w-4 sm:h-4" /></button>
        </div>
        <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
          <QRPanel
            qrUrl={qrUrl}
            total={total}
            transferNote={transferNote}
            bankCode={bankCode}
            accountNumber={accountNumber}
            accountName={accountName}
          />
          <BankInfo
            bankLabel={bk}
            accountNumber={accNo}
            accountName={accName}
            amount={total}
            transferNote={transferNote}
            onCopy={onCopy}
          />
          <p className="text-xs text-black/60">{VIETQR_MODAL.note}</p>
          <div className="flex items-center justify-end gap-2">
            <button onClick={onClose} className="rounded-full border border-black/15 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-black/5">{VIETQR_MODAL.actions.close}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
