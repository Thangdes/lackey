export const PAYMENT_QR = {
  bankCode: "vcb", // Vietcombank
  accountNumber: "0123456789",
  accountName: "EXAMPLE COMPANY",
  transferNotePrefix: "LACKEY", // e.g., LACKEY LK-<order_code>
} as const;

export function buildVietQRUrl(params: { amount: number; note: string }) {
  const { bankCode, accountNumber, accountName } = PAYMENT_QR;
  const amount = Math.max(0, Math.floor(params.amount || 0));
  const info = encodeURIComponent(params.note || "Thanh toan don hang");
  const name = encodeURIComponent(accountName);
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amount}&addInfo=${info}&accountName=${name}`;
}
