export function formatVND(n?: number | string | null): string {
  const num = Number(n ?? 0);
  if (!isFinite(num)) return "0₫";
  const parts = Math.floor(Math.abs(num)).toString().split("");
  const out: string[] = [];
  let count = 0;
  for (let i = parts.length - 1; i >= 0; i--) {
    out.push(parts[i]);
    count++;
    if (count % 3 === 0 && i !== 0) out.push(".");
  }
  const whole = out.reverse().join("");
  const sign = num < 0 ? "-" : "";
  return `${sign}${whole}₫`;
}

export function formatDate(dt?: string | Date | null): string {
  if (!dt) return "";
  try {
    const d = typeof dt === "string" ? new Date(dt) : dt;
    return d.toLocaleString("vi-VN");
  } catch {
    return String(dt ?? "");
  }
}
