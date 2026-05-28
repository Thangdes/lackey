export function mapBinToShortCode(binOrCode: string | undefined): string | undefined {
  if (!binOrCode) return undefined;
  const map: Record<string, string> = {
    "970436": "vcb", 
    "970418": "bidv", 
    "970407": "agribank", 
    "970423": "vtb", 
    "970400": "sacombank", 
    "970448": "acb", 
    "970422": "mbbank", 
    "970428": "techcombank", 
    "970415": "vpbank", 
    "970416": "tpb", 
  };
  return /^\d{6}$/.test(binOrCode) ? map[binOrCode] || binOrCode : binOrCode;
}

export function buildImgVietQrUrl(params: {
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  amount?: number;
  note?: string;
}): string | null {
  const bk = mapBinToShortCode(params.bankCode);
  const acc = params.accountNumber;
  if (!bk || !acc) return null;
  const amt = Math.max(0, Math.floor(Number(params.amount || 0)));
  const info = encodeURIComponent(params.note || "");
  const accName = encodeURIComponent(params.accountName || "");
  return `https://img.vietqr.io/image/${bk}-${acc}-compact.png?amount=${amt}&addInfo=${info}&accountName=${accName}`;
}

export function resolveFinalQrUrlFromApi(res: unknown, total: number, note: string): string | null {
  type PaymentLinkResp = {
    orderId: string;
    orderCode: string;
    amount: number;
    qrCodeImageUrl: string;
    url: string;
    paymentId: string;
    bankCode?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    transferNote?: string;
  };
  const resp = (res || null) as PaymentLinkResp | null;
  const raw = resp?.url || resp?.qrCodeImageUrl;
  let url: string | undefined = typeof raw === "string" ? raw : undefined;
  if (!url || /api\.vietqr\.io\//.test(url)) {
    url =
      buildImgVietQrUrl({
        bankCode: resp?.bankCode,
        accountNumber: resp?.accountNumber,
        accountName: resp?.accountName,
        amount: Number(resp?.amount ?? total) || total,
        note,
      }) || undefined;
  }
  return url || null;
}
export { toLocalCartItem } from "@/selector/cart.selectors";
