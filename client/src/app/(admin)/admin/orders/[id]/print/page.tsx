"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useOrderById } from "@/hook/useOrder";
import { formatDate, formatVND } from "@/utils/format";
import type { OrderDetail } from "@/type/order";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constant/site";
import { ArrowLeft, FileDown, Printer } from "lucide-react";
import { OrderItemPrintRow } from "@/components/admin/orders/OrderItemPrintRow";

type LooseOrderPrint = Partial<OrderDetail> & {
  customer?: {
    id?: string;
    _id?: string;
    name?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    profile?: {
      fullName?: string;
      name?: string;
      email?: string;
      phone?: string;
    };
  };
  user?: LooseOrderPrint["customer"];
  recipientPhone?: string;
  phone?: string;
  email?: string;
  shippingAddress?: {
    line1?: string;
    address1?: string;
    street?: string;
    ward?: string;
    wardName?: string;
    district?: string;
    districtName?: string;
    province?: string;
    provinceName?: string;
  };
  address?: LooseOrderPrint["shippingAddress"];
  recipientName?: string;
  receiverName?: string;
  name?: string;
  shippingAddressText?: string;
};

export default function AdminOrderPrintPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const { data, isLoading, error } = useOrderById(id);
  const o: OrderDetail | undefined = data;

  
  useEffect(() => {
    const prevTitle = document.title;
    
    document.title = ""; 
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const items = Array.isArray(o?.orderItems) ? o!.orderItems : [];
  const subtotal = o?.subtotalAmount ?? o?.subtotal ?? 0;
  const shipping = o?.shippingFee ?? 0;
  const total = o?.totalAmount ?? o?.total ?? subtotal + shipping;

  const derived = useMemo(() => {
    const r = (o as unknown as LooseOrderPrint) || {};
    const customer = r.customer || r.user || {};
    const profile = customer.profile || {};
    const name = customer.name || profile.fullName || profile.name || customer.fullName || "-";
    const phone = customer.phone || profile.phone || r.recipientPhone || r.phone || "";
    const email = customer.email || profile.email || r.email || "";
    const addr = r.shippingAddress || r.address || {};
    const recipient = r.recipientName || r.receiverName || r.name || name;
    const line1 = addr.line1 || addr.address1 || addr.street || r.shippingAddressText || "";
    const ward = addr.ward || addr.wardName || "";
    const district = addr.district || addr.districtName || "";
    const province = addr.province || addr.provinceName || "";
    const full = [line1, ward, district, province].filter(Boolean).join(", ");
    return { name, phone, email, recipient, full };
  }, [o]);

  const [vatEnabled, setVatEnabled] = useState(false);
  const [buyerCompanyName, setBuyerCompanyName] = useState("");
  const [buyerTaxId, setBuyerTaxId] = useState("");
  const [buyerCompanyAddress, setBuyerCompanyAddress] = useState("");
  const [buyerRepresentative, setBuyerRepresentative] = useState("");
  const [vatRate, setVatRate] = useState<number>(10); 
  const [pricesIncludeVAT, setPricesIncludeVAT] = useState<boolean>(true);

  const vatCalc = useMemo(() => {
    const rate = Math.max(0, Number(vatRate) || 0) / 100;
    const gross = Number(total) || 0; 
    if (!vatEnabled || rate === 0) {
      return { base: gross, vat: 0, gross };
    }
    if (pricesIncludeVAT) {
      const base = gross / (1 + rate);
      const vat = gross - base;
      return { base, vat, gross };
    } else {
      const vat = gross * rate;
      const base = gross;
      return { base, vat, gross: base + vat };
    }
  }, [total, vatEnabled, vatRate, pricesIncludeVAT]);

  const rootRef = useRef<HTMLDivElement>(null);
  const handleExportPDF = async () => {
    if (!rootRef.current) return;
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas-pro"),
      import("jspdf"),
    ]);
    const node = rootRef.current;
    const scale = 2; 
    const canvas = await html2canvas(node, {
      backgroundColor: "#ffffff",
      scale,
      useCORS: true,
      logging: false,
      windowWidth: node.scrollWidth,
      windowHeight: node.scrollHeight,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }
    const code = o?.orderCode || o?.code || id;
    pdf.save(`invoice_${code}.pdf`);
  };

  return (
    <div className="print:mt-0">
      {}
      <div className="print:hidden mb-4 space-y-3">
        <div className="flex gap-2 items-center">
          <Link
            href={`/admin/orders/${id}`}
            className="text-sm rounded-full border border-black/15 px-3 py-1.5 hover:bg-black/5 flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Quay lại
          </Link>
          <Button type="button" variant="outline" className="text-sm" onClick={() => window.print()}>
            <Printer className="size-4" />
            In
          </Button>
          <Button type="button" variant="default" className="text-sm" onClick={handleExportPDF}>
            <FileDown className="size-4" />
            Xuất PDF
          </Button>
        </div>
        <div className="rounded-lg border p-3 bg-white/70">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4" checked={vatEnabled} onChange={(e) => setVatEnabled(e.target.checked)} />
              Bật chế độ Hóa đơn VAT (doanh nghiệp)
            </label>
            <div className="text-xs text-black/60">Không lưu vào hệ thống, chỉ dùng để in</div>
          </div>
          {vatEnabled && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs text-black/60">Tên doanh nghiệp (Bên mua)</label>
                <input
                  className="mt-1 w-full rounded border px-2 py-1.5"
                  value={buyerCompanyName}
                  onChange={(e) => setBuyerCompanyName(e.target.value)}
                  placeholder="CÔNG TY TNHH ABC"
                />
              </div>
              <div>
                <label className="block text-xs text-black/60">Mã số thuế (MST)</label>
                <input
                  className="mt-1 w-full rounded border px-2 py-1.5"
                  value={buyerTaxId}
                  onChange={(e) => setBuyerTaxId(e.target.value)}
                  placeholder="0100xxxxxxx"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-black/60">Địa chỉ doanh nghiệp</label>
                <input
                  className="mt-1 w-full rounded border px-2 py-1.5"
                  value={buyerCompanyAddress}
                  onChange={(e) => setBuyerCompanyAddress(e.target.value)}
                  placeholder="Số, đường, phường/xã, quận/huyện, tỉnh/thành"
                />
              </div>
              <div>
                <label className="block text-xs text-black/60">Người mua hàng (đại diện)</label>
                <input
                  className="mt-1 w-full rounded border px-2 py-1.5"
                  value={buyerRepresentative}
                  onChange={(e) => setBuyerRepresentative(e.target.value)}
                  placeholder={derived.name || "Họ tên"}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-black/60">Thuế suất VAT (%)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded border px-2 py-1.5"
                    min={0}
                    step={1}
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={pricesIncludeVAT}
                      onChange={(e) => setPricesIncludeVAT(e.target.checked)}
                    />
                    Giá đã bao gồm VAT
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div>Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-red-600">Không thể tải dữ liệu đơn.</div>
      ) : !o ? (
        <div>Không tìm thấy đơn hàng.</div>
      ) : (
        <div ref={rootRef} className="print-area bg-white p-6 rounded-xl border border-black/10 print:border-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xl font-semibold">
                {vatEnabled ? "HÓA ĐƠN GIÁ TRỊ GIA TĂNG (VAT)" : "HÓA ĐƠN BÁN HÀNG"}
              </div>
              <div className="text-sm text-black/60">
                Mã đơn: <span className="font-medium">{o.orderCode || o.code || id}</span>
              </div>
              {o.createdAt && (
                <div className="text-sm text-black/60">Ngày tạo: {formatDate(o.createdAt)}</div>
              )}
            </div>
            <div className="text-right text-sm">
              <div className="font-medium">{siteConfig?.company?.legalName || "Cửa hàng"}</div>
              <div className="text-black/60">{siteConfig?.company?.address || "cvf.vn"}</div>
              {siteConfig?.company?.taxId && (
                <div className="text-black/60">MST: {siteConfig.company.taxId}</div>
              )}
            </div>
          </div>

          <div className="h-px bg-black/10 my-4" />

          {vatEnabled ? (
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-medium mb-1">Bên bán</div>
                <div>Tên đơn vị: <span className="font-medium">{siteConfig?.company?.legalName || "LắcKey"}</span></div>
                {siteConfig?.company?.taxId && (
                  <div>Mã số thuế: <span className="font-medium">{siteConfig.company.taxId}</span></div>
                )}
                {siteConfig?.company?.address && (
                  <div>Địa chỉ: <span className="font-medium">{siteConfig.company.address}</span></div>
                )}
                {siteConfig?.contact?.email && (
                  <div>Email: <span className="font-medium">{siteConfig.contact.email}</span></div>
                )}
                {siteConfig?.contact?.telephone && (
                  <div>Điện thoại: <span className="font-medium">{siteConfig.contact.telephone}</span></div>
                )}
              </div>
              <div>
                <div className="font-medium mb-1">Bên mua</div>
                <div>Tên đơn vị: <span className="font-medium">{buyerCompanyName || "(Điền tên doanh nghiệp)"}</span></div>
                {buyerTaxId && <div>Mã số thuế: <span className="font-medium">{buyerTaxId}</span></div>}
                {buyerCompanyAddress && <div>Địa chỉ: <span className="font-medium">{buyerCompanyAddress}</span></div>}
                {(buyerRepresentative || derived.name) && (
                  <div>Người mua hàng: <span className="font-medium">{buyerRepresentative || derived.name}</span></div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-medium mb-1">Khách hàng</div>
                <div>Họ tên: <span className="font-medium">{derived.name}</span></div>
                {derived.phone && <div>Điện thoại: <span className="font-medium">{derived.phone}</span></div>}
                {derived.email && <div>Email: <span className="font-medium">{derived.email}</span></div>}
              </div>
              <div>
                <div className="font-medium mb-1">Giao hàng</div>
                {derived.recipient && <div>Người nhận: <span className="font-medium">{derived.recipient}</span></div>}
                {derived.full && <div>Địa chỉ: <span className="font-medium">{derived.full}</span></div>}
              </div>
            </div>
          )}

          <div className="h-px bg-black/10 my-4" />

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-black/10">
                <th className="py-2 pr-2">Sản phẩm</th>
                <th className="py-2 pr-2">SKU</th>
                <th className="py-2 pr-2 text-right">Đơn giá</th>
                <th className="py-2 pr-2 text-right">SL</th>
                <th className="py-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <OrderItemPrintRow key={it.id} item={it} />
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-4 text-sm">
            <div className="w-full md:w-1/2 lg:w-1/3">
              {!vatEnabled ? (
                <>
                  <div className="flex justify-between py-1">
                    <span>Tạm tính</span>
                    <span className="font-medium">{formatVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium">{formatVND(shipping)}</span>
                  </div>
                  <div className="h-px bg-black/10 my-2" />
                  <div className="flex justify-between py-1 text-base">
                    <span className="font-semibold">Tổng cộng</span>
                    <span className="font-semibold">{formatVND(total)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between py-1">
                    <span>Cộng tiền hàng (chưa VAT)</span>
                    <span className="font-medium">{formatVND(vatCalc.base)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Thuế GTGT ({vatRate}%)</span>
                    <span className="font-medium">{formatVND(vatCalc.vat)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium">{formatVND(shipping)}</span>
                  </div>
                  <div className="h-px bg-black/10 my-2" />
                  <div className="flex justify-between py-1 text-base">
                    <span className="font-semibold">Tổng thanh toán</span>
                    <span className="font-semibold">{formatVND(vatCalc.gross)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 gap-6 mt-10 text-sm">
            <div className="text-center">
              <div className="font-medium">Người mua hàng</div>
              <div className="text-xs text-black/60">(Ký, ghi rõ họ tên)</div>
              <div className="h-24" />
              <div className="text-sm font-medium">{vatEnabled ? (buyerRepresentative || derived.name) : derived.name}</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Người bán hàng</div>
              <div className="text-xs text-black/60">(Ký, ghi rõ họ tên)</div>
              <div className="h-24" />
              <div className="text-sm font-medium">{siteConfig?.company?.legalName || "LắcKey"}</div>
            </div>
          </div>

          <div className="mt-10 text-xs text-black/60">
            Cảm ơn quý khách đã mua hàng!
          </div>
        </div>
      )}
    </div>
  );
}
