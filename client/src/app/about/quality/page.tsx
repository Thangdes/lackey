export const dynamic = "force-static";

export default function AboutQualityPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Chất lượng sản phẩm</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Nội dung giới thiệu về tiêu chuẩn chất lượng của LắcKey sẽ được bổ sung sớm.
      </p>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-4">
        <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
          <li>Quy trình tuyển chọn sản phẩm chất lượng</li>
          <li>Tiêu chuẩn đóng gói và bảo quản bàn phím</li>
          <li>Chứng nhận và kiểm định chất lượng</li>
        </ul>
      </div>
    </main>
  );
}
