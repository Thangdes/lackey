"use client";
import React, { Suspense, useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Ticket, Plus } from "lucide-react";
import { DiscountTable } from "@/components/admin/discounts/DiscountTable";
import { DiscountDialog } from "@/components/admin/discounts/DiscountDialog";
import { useCreateDiscount, useDeleteDiscount, useDiscountList, useUpdateDiscount } from "@/hook/useDiscountAdmin";
import type { Discount } from "@/service/discount.service";

function toLocalDatetimeInputValue(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DiscountsAdminPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground p-2">Đang tải…</div>}>
      <DiscountsAdminClient />
    </Suspense>
  );
}

function DiscountsAdminClient() {
  const { data: items = [], isLoading } = useDiscountList();
  const createMutation = useCreateDiscount();
  const [editingId, setEditingId] = useState<string | null>(null);
  const updateMutation = useUpdateDiscount(editingId || "");
  const deleteMutation = useDeleteDiscount();

  const [query, setQuery] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"FIXED_AMOUNT" | "PERCENTAGE" | string>("FIXED_AMOUNT");
  const [value, setValue] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [perUserLimit, setPerUserLimit] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [stackable, setStackable] = useState(false);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((d) => d.code.toLowerCase().includes(q));
  }, [items, query]);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setDialogOpen(open);
  }, []);

  const resetForm = useCallback(() => {
    setCode("");
    setDescription("");
    setType("FIXED_AMOUNT");
    setValue("");
    setIsActive(true);
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setUsageLimit("");
    setPerUserLimit("");
    setMaxDiscountAmount("");
    setStackable(false);
    setSaving(false);
  }, []);

  const handleCreateClick = useCallback(() => {
    setDialogMode("create");
    setEditingId(null);
    resetForm();
    setDialogOpen(true);
  }, [resetForm]);

  const handleEdit = useCallback((id: string) => {
    const d = items.find((x) => x.id === id);
    if (!d) return;
    setDialogMode("edit");
    setEditingId(id);
    setCode(d.code || "");
    setDescription((d.description as string) || "");
    setType((d.type as string) || "FIXED_AMOUNT");
    setValue(String(d.value ?? ""));
    setIsActive(Boolean(d.isActive));
    setStartDate(toLocalDatetimeInputValue(d.startDate));
    setEndDate(toLocalDatetimeInputValue(d.endDate ?? undefined));
    setMinAmount(String(d.minAmount ?? ""));
    setUsageLimit(String((d as unknown as { usageLimit?: number | string })?.usageLimit ?? ""));
    setPerUserLimit(String((d as unknown as { perUserLimit?: number | string })?.perUserLimit ?? ""));
    setMaxDiscountAmount(String((d as unknown as { maxDiscountAmount?: number | string })?.maxDiscountAmount ?? ""));
    setStackable(Boolean((d as unknown as { stackable?: boolean })?.stackable));
    setDialogOpen(true);
  }, [items]);

  const handleDelete = useCallback((id: string) => {
    toast.promise(deleteMutation.mutateAsync(id), {
      loading: "Đang xóa mã giảm giá…",
      success: "Đã xóa mã giảm giá",
      error: "Xóa mã giảm giá thất bại",
    });
  }, [deleteMutation]);

  const handleFieldChange = useCallback((field: string, value: string | boolean) => {
    switch (field) {
      case "code": setCode(String(value || "")); break;
      case "description": setDescription(String(value || "")); break;
      case "type": setType(String(value || "FIXED_AMOUNT")); break;
      case "value": setValue(String(value || "")); break;
      case "isActive": setIsActive(Boolean(value)); break;
      case "startDate": setStartDate(String(value || "")); break;
      case "endDate": setEndDate(String(value || "")); break;
      case "minAmount": setMinAmount(String(value || "")); break;
      case "usageLimit": setUsageLimit(String(value || "")); break;
      case "perUserLimit": setPerUserLimit(String(value || "")); break;
      case "maxDiscountAmount": setMaxDiscountAmount(String(value || "")); break;
      case "stackable": setStackable(Boolean(value)); break;
    }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      if (!code.trim()) {
        toast.error("Vui lòng nhập mã giảm giá");
        return;
      }
      if (!startDate) {
        toast.error("Vui lòng chọn ngày bắt đầu");
        return;
      }
      const payload = {
        code: code.trim(),
        description: description.trim() || undefined,
        type,
        value: value ? Number(value) : 0,
        isActive,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        minAmount: minAmount ? Number(minAmount) : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        perUserLimit: perUserLimit ? Number(perUserLimit) : undefined,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
        stackable,
      } as Partial<Discount>;

      setSaving(true);
      if (dialogMode === "create") {
        await toast.promise(createMutation.mutateAsync(payload), {
          loading: "Đang tạo mã giảm giá…",
          success: "Tạo mã giảm giá thành công",
          error: (e) => (e instanceof Error ? e.message : "Tạo mã giảm giá thất bại"),
        });
      } else if (editingId) {
        await toast.promise(updateMutation.mutateAsync(payload), {
          loading: "Đang lưu thay đổi…",
          success: "Cập nhật mã giảm giá thành công",
          error: (e) => (e instanceof Error ? e.message : "Cập nhật mã giảm giá thất bại"),
        });
      }
      setDialogOpen(false);
      resetForm();
    } finally {
      setSaving(false);
    }
  }, [code, createMutation, description, dialogMode, editingId, endDate, isActive, minAmount, resetForm, startDate, type, updateMutation, value, usageLimit, perUserLimit, maxDiscountAmount, stackable]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold inline-flex items-center gap-2">
          <Ticket className="size-5 text-muted-foreground" aria-hidden />
          Mã giảm giá
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Input placeholder="Tìm theo mã" value={query} onChange={handleQueryChange} />
          <Button type="button" onClick={handleCreateClick} className="inline-flex items-center gap-2">
            <Plus className="size-4" aria-hidden />
            Thêm
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Đang tải…</div>
      ) : (
        <DiscountTable items={filtered as Discount[]} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <DiscountDialog
        open={dialogOpen}
        mode={dialogMode}
        code={code}
        description={description}
        type={type}
        value={value}
        isActive={isActive}
        startDate={startDate}
        endDate={endDate}
        minAmount={minAmount}
        usageLimit={usageLimit}
        perUserLimit={perUserLimit}
        maxDiscountAmount={maxDiscountAmount}
        stackable={stackable}
        saving={saving}
        onOpenChange={handleOpenChange}
        onChange={handleFieldChange}
        onSave={handleSave}
      />
    </div>
  );
}

export { DiscountsAdminClient };