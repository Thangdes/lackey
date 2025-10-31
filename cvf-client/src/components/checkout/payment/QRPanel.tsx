"use client";
import { VIETQR_MODAL } from "@/constant/checkout";

export type QRPanelProps = {
  qrUrl: string;
  total: number;
  transferNote: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
};

export function QRPanel({ qrUrl, total, transferNote, bankCode, accountNumber, accountName }: QRPanelProps) {
  const fallbackQrUrl = (() => {
    if (!bankCode || !accountNumber) return undefined;
    const info = encodeURIComponent(transferNote || "");
    const name = encodeURIComponent(accountName || "");
    const amt = Math.max(0, Math.floor(Number(total) || 0));
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amt}&addInfo=${info}&accountName=${name}`;
  })();

  return (
    <>
      <div className="mx-auto rounded-lg border border-black/10 bg-white p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl || (fallbackQrUrl ?? "")}
          alt={VIETQR_MODAL.imageAlt}
          width={224}
          height={224}
          className="h-auto w-56"
          loading="eager"
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
      <div className="text-center text-xs text-black/60">
        <a href={fallbackQrUrl || qrUrl} target="_blank" rel="noopener noreferrer" className="underline">Mở QR trong tab mới</a>
      </div>
    </>
  );
}
