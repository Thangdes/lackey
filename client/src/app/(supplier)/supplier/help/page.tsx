"use client";
import React from "react";
import Link from "next/link";

export default function SupplierHelpPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Hướng dẫn khu vực Nhà cung cấp</h1>
        <Link href="/supplier" className="text-sm underline">Về Bảng điều khiển</Link>
      </div>

      <section className="rounded-md border p-4 space-y-2">
        <div className="font-medium">1) Xem đơn hàng</div>
        <div className="text-sm text-neutral-700">Vào mục Đơn hàng để theo dõi trạng thái, xem chi tiết từng đơn, doanh thu của bạn trong đơn.</div>
      </section>

      <section className="rounded-md border p-4 space-y-2">
        <div className="font-medium">2) Tồn kho</div>
        <div className="text-sm text-neutral-700">Trang Tồn kho hiển thị danh sách biến thể (SKU) và số lượng tồn. Bạn có thể lọc nhanh bằng ô tìm kiếm.</div>
      </section>

      <section className="rounded-md border p-4 space-y-2">
        <div className="font-medium">3) Biểu đồ doanh thu</div>
        <div className="text-sm text-neutral-700">Bảng điều khiển có biểu đồ doanh thu theo ngày. Bạn có thể chọn 7 hoặc 30 ngày để xem.</div>
      </section>

      <section className="rounded-md border p-4 space-y-2">
        <div className="font-medium">4) Nên nhập lại</div>
        <div className="text-sm text-neutral-700">Phần &quot;Nên nhập lại&quot; gợi ý những biến thể bán chạy nhưng tồn kho thấp để bạn ưu tiên nhập hàng.</div>
      </section>

      <section className="rounded-md border p-4 space-y-2">
        <div className="font-medium">5) Mẹo</div>
        <ul className="list-disc pl-6 text-sm text-neutral-700 space-y-1">
          <li>Dùng sidebar để chuyển nhanh giữa các mục.</li>
          <li>Nhấn vào dòng đơn hàng để mở chi tiết nhanh.</li>
          <li>Dùng ô tìm kiếm trong Tồn kho để lọc theo SKU hoặc tên biến thể.</li>
        </ul>
      </section>
    </div>
  );
}
