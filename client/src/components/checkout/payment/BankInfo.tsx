"use client";
import { Copy } from "lucide-react";
import { VIETQR_MODAL } from "@/constant/checkout";
import { formatVND } from "@/utils/currency";

export type BankInfoProps = {
  bankLabel: string; 
  accountNumber: string;
  accountName: string;
  amount: number;
  transferNote: string;
  onCopy: () => void;
};

export function BankInfo({ bankLabel, accountNumber, accountName, amount, transferNote, onCopy }: BankInfoProps) {
  return (
    <div className="rounded-lg bg-black/[0.03] p-3">
      <div className="flex items-center justify-between">
        <span className="text-black/60">{VIETQR_MODAL.labels.bank}</span>
        <span className="font-medium uppercase">{bankLabel}</span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-black/60">{VIETQR_MODAL.labels.accountNumber}</span>
        <span className="font-medium">{accountNumber}</span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-black/60">{VIETQR_MODAL.labels.accountName}</span>
        <span className="font-medium">{accountName}</span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-black/60">{VIETQR_MODAL.labels.amount}</span>
        <span className="font-semibold">{formatVND(amount)}</span>
      </div>
      <div className="mt-1">
        <div className="text-black/60">{VIETQR_MODAL.labels.transferNote}</div>
        <div className="mt-1 flex items-center gap-2">
          <code className="rounded-md border border-black/10 bg-white px-2 py-1 text-xs">{transferNote}</code>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-medium hover:bg-black/5"
          >
            <Copy size={14} />
            <span>{VIETQR_MODAL.actions.copy}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
