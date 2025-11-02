"use client";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supplierAdminService, type Supplier, type CreateSupplierDto } from "@/service/supplier-admin.service";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { IoReload } from "react-icons/io5";

export default function AdminSuppliersPage() {
  const { data, isLoading, error, refetch, isFetching } = useQuery<Supplier[]>({
    queryKey: ["admin", "suppliers", "list"],
    queryFn: () => supplierAdminService.list(),
    staleTime: 0,
  });

  const suppliers = Array.isArray(data) ? data : [];

  const [form, setForm] = useState<CreateSupplierDto>({ name: "", email: "", contactName: "", phone: "", address: "" });
  const createMutation = useMutation({
    mutationFn: () => supplierAdminService.create({
      name: form.name.trim(),
      email: form.email.trim(),
      contactName: form.contactName?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      address: form.address?.trim() || undefined,
    }),
    onSuccess: () => { setForm({ name: "", email: "", contactName: "", phone: "", address: "" }); refetch(); toast.success("Tạo nhà cung cấp thành công"); },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Tạo nhà cung cấp thất bại"),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => supplierAdminService.delete(id),
    onSuccess: () => { refetch(); toast.success("Đã vô hiệu nhà cung cấp"); },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Thao tác thất bại"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nhà cung cấp</h1>
        <p className="text-sm text-muted-foreground">Danh sách nhà cung cấp hiện có trong hệ thống.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Quản lý nhà cung cấp</CardTitle>
            <CardDescription>
              {isLoading ? "Đang tải…" : error ? "Có lỗi khi tải danh sách" : `${suppliers.length} nhà cung cấp`}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2">
            {isFetching ? <IoReload className="h-4 w-4 animate-spin" /> : <IoReload className="h-4 w-4" />}
            Tải lại
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-medium">Tạo nhà cung cấp mới</h2>
              <form
                className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }}
              >
                <div className="space-y-1">
                  <Label htmlFor="name">Tên nhà cung cấp</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="VD: Công ty ABC"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email liên hệ</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contactName">Tên người liên hệ (tuỳ chọn)</Label>
                  <Input
                    id="contactName"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.contactName}
                    onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Số điện thoại (tuỳ chọn)</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="0901 234 567"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="address">Địa chỉ (tuỳ chọn)</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-3">
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Đang tạo…" : "Tạo nhà cung cấp"}
                  </Button>
                  {!!createMutation.error && (
                    <div className="text-sm text-red-600">{(createMutation.error as Error).message}</div>
                  )}
                  {createMutation.isSuccess && (
                    <div className="text-sm text-green-700">Tạo nhà cung cấp thành công</div>
                  )}
                </div>
              </form>
            </div>

            <Separator />

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : error ? (
              <div className="text-sm text-red-600">Không tải được danh sách. Vui lòng thử lại.</div>
            ) : suppliers.length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có nhà cung cấp.</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Tên</TableHead>
                      <TableHead className="w-[40%]">Email</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium truncate">{s.name}</TableCell>
                        <TableCell className="truncate">{s.email}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/suppliers/${s.id}`}>Chi tiết</Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" disabled={deleteMutation.isPending}>
                                Vô hiệu
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Vô hiệu nhà cung cấp?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Xác nhận vô hiệu nhà cung cấp &quot;{s.name}&quot;. Hành động này có thể ảnh hưởng đến quyền truy cập.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMutation.mutate(s.id)}>Vô hiệu</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
}

