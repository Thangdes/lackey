export const dynamic = "force-static";

export default function AboutShippingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Vận chuyển & giao hàng</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Thông tin chi tiết về phí và thời gian giao hàng sẽ được bổ sung sớm. Tạm thời, vui lòng tham khảo tại trang thanh toán.
      </p>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-4">
        <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
          <li>Khu vực giao hàng</li>
          <li>Phí vận chuyển</li>
          <li>Thời gian xử lý & giao nhận</li>
        </ul>
      </div>
    </main>
  );
}
