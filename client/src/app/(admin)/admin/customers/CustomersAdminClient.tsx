"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCustomerList } from "@/hook/useCustomer";
import { useAuthProfile } from "@/hook/useAuth";
import type { Customer } from "@/type/customer";
import CustomersToolbar from "@/components/admin/customers/CustomersToolbar";
import { Button } from "@/components/ui/button";
import CustomersTable from "@/components/admin/customers/CustomersTable";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function CustomersAdminClient() {
  const { data: me, isLoading: authLoading } = useAuthProfile();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useCustomerList({ page, limit: PAGE_SIZE, search });
  const customers: Customer[] = data?.data || [];
  const meta = data?.meta || { page, limit: PAGE_SIZE, total: undefined as number | undefined };
  const isAdmin = !!me && String(me.role || "").toUpperCase() === "ADMIN";

  const totalPages = useMemo(() => {
    if (!meta?.total || !meta?.limit) return undefined;
    return Math.max(1, Math.ceil((meta.total as number) / (meta.limit as number)));
  }, [meta?.total, meta?.limit]);
  const canGoPrev = useMemo(() => page > 1, [page]);
  const canGoNext = useMemo(() => (typeof totalPages === "number" ? page < totalPages : customers.length === PAGE_SIZE), [page, totalPages, customers.length]);

  const handleSearchChange = useCallback((value: string) => {
    setPage(1);
    setSearch(value);
  }, []);

  const handlePrevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  useEffect(() => {
    if (error) {
      const raw = (error as unknown as { message?: string })?.message || String(error);
      toast.error("Không thể tải danh sách khách hàng", { description: raw });
    }
  }, [error]);

  if (authLoading) return <div>Đang kiểm tra quyền truy cập...</div>;
  if (!isAdmin) return <div>403 - Bạn không có quyền truy cập trang quản trị.</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold inline-flex items-center gap-2">
            <Users className="size-6 text-muted-foreground" aria-hidden />
            Khách hàng (Admin)
          </h1>
          <p className="text-sm text-muted-foreground">Quản lý danh sách khách hàng và thông tin cơ bản</p>
        </div>
      </div>

      <CustomersToolbar search={search} onSearchChange={handleSearchChange} />

      {isLoading && <div>Đang tải...</div>}
      {error && <div className="text-red-600">Không thể tải danh sách khách hàng.</div>}

      {!isLoading && !error && (
        <CustomersTable customers={customers} emptyText={customers.length === 0 ? "Không có khách hàng." : undefined} />
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-black/60">Trang {page}{typeof totalPages === "number" ? ` / ${totalPages}` : ""}</div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" disabled={!canGoPrev} onClick={handlePrevPage} className="inline-flex items-center gap-2">
            <ChevronLeft className="size-4" aria-hidden />
            Trước
          </Button>
          <Button type="button" variant="outline" disabled={!canGoNext} onClick={handleNextPage} className="inline-flex items-center gap-2">
            Sau
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
