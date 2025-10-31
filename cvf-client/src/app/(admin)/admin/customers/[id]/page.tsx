"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { useAuthProfile } from "@/hook/useAuth";
import { useCustomerById } from "@/hook/useCustomer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { User, ArrowLeft, Mail, Phone } from "lucide-react";

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const { data: me, isLoading: authLoading } = useAuthProfile();
  const { data, isLoading, error } = useCustomerById(id);

  const c = data;
  const isAdmin = me?.role === "admin";

  const createdAtText = useMemo(() => (c?.createdAt ? new Date(c.createdAt).toLocaleString("vi-VN") : "-"), [c?.createdAt]);

  if (!id) return <div className="">Không tìm thấy mã khách hàng.</div>;
  if (authLoading) return <div className="">Đang kiểm tra quyền truy cập...</div>;
  if (!isAdmin) return <div className="">403 - Bạn không có quyền truy cập trang quản trị.</div>;

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-36" />
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  if (error) return <div className="">Không thể tải chi tiết khách hàng.</div>;
  if (!c) return <div className="">Không tìm thấy khách hàng.</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold inline-flex items-center gap-2">
            <User className="size-6 text-muted-foreground" aria-hidden />
            Admin: Khách hàng {c.fullName || c.email || id}
          </h1>
          <div className="mt-1 text-xs text-black/60">Tạo lúc: {createdAtText}</div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm rounded-full border border-black/15 px-3 py-1.5 hover:bg-black/5">
            <ArrowLeft className="size-4" aria-hidden />
            Quay lại
          </Link>
          <Button asChild variant="outline" className="h-8 inline-flex items-center gap-1">
            <Link href={`mailto:${c.email}`}>
              <Mail className="size-4" aria-hidden />
              Gửi email
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-4 space-y-2">
          <div className="font-medium">Thông tin liên hệ</div>
          <div className="text-sm"><span className="text-black/60">Họ tên:</span> <span className="font-medium">{c.fullName || "-"}</span></div>
          <div className="text-sm"><span className="text-black/60">Email:</span> <span className="font-medium">{c.email}</span></div>
          <div className="text-sm"><span className="text-black/60">SĐT:</span> <span className="font-medium">{c.phone || "-"}</span></div>
          <div className="text-sm"><span className="text-black/60">Mã KH:</span> <span className="font-mono">{c.id}</span></div>
        </div>

        <aside className="rounded-2xl border border-black/10 bg-white p-4 space-y-3 md:sticky md:top-20">
          <div className="font-medium">Hành động</div>
          <div className="flex gap-2">
            <Button asChild size="sm" className="inline-flex items-center gap-1">
              <Link href={`mailto:${c.email}`}>
                <Mail className="size-4" aria-hidden />
                Gửi email
              </Link>
            </Button>
            {c.phone ? (
              <Button asChild size="sm" variant="secondary" className="inline-flex items-center gap-1">
                <Link href={`tel:${c.phone}`}>
                  <Phone className="size-4" aria-hidden />
                  Gọi
                </Link>
              </Button>
            ) : null}
          </div>
          <Separator className="my-2" />
          <div className="text-xs text-black/60">Đã tạo: {createdAtText}</div>
        </aside>
      </div>
    </div>
  );
}
