"use client";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supplierAdminService, type SupplierDetails } from "@/service/supplier-admin.service";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
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

export default function AdminSupplierDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supplierId = useMemo(() => String(params?.id || ""), [params]);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<SupplierDetails>({
    queryKey: ["admin", "suppliers", supplierId],
    queryFn: () => supplierAdminService.getById(supplierId),
    enabled: Boolean(supplierId),
    staleTime: 0,
  });

  const [emailLogin, setEmailLogin] = useState("");
  const [usernameLogin, setUsernameLogin] = useState("");
  const [password, setPassword] = useState("");

  const createUser = useMutation({
    mutationFn: () => supplierAdminService.createUser({
      supplierId,
      email: emailLogin.trim(),
      username: (usernameLogin || emailLogin).trim(),
      password,
    }),
    onSuccess: () => {
      setEmailLogin("");
      setUsernameLogin("");
      setPassword("");
      refetch();
      toast.success("Tạo tài khoản nhà cung cấp thành công");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Tạo tài khoản thất bại"),
  });

  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"deactivate" | "reactivate" | "delete" | "reset" | null>(null);

  const deactivate = useMutation({
    mutationFn: (userId: string) => supplierAdminService.deactivateUser(userId),
    onMutate: async (userId: string) => {
      setPendingUserId(userId);
      setPendingAction("deactivate");
      await queryClient.cancelQueries({ queryKey: ["admin", "suppliers", supplierId] });
      const previous = queryClient.getQueryData(["admin", "suppliers", supplierId]);
      queryClient.setQueryData(["admin", "suppliers", supplierId], (old: SupplierDetails | undefined) => {
        if (!old) return old;
        const users = Array.isArray(old.users) ? old.users.map((u) => u.id === userId ? { ...u, isActive: false } : u) : old.users;
        return { ...old, users } as SupplierDetails;
      });
      return { previous };
    },
    onError: (e: unknown, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["admin", "suppliers", supplierId], ctx.previous as SupplierDetails);
      toast.error(e instanceof Error ? e.message : "Thao tác thất bại");
    },
    onSuccess: () => {
      toast.success("Đã vô hiệu tài khoản nhà cung cấp");
    },
    onSettled: () => {
      setPendingUserId(null);
      setPendingAction(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "suppliers", supplierId] });
    },
  });
  const reactivate = useMutation({
    mutationFn: (userId: string) => supplierAdminService.reactivateUser(userId),
    onMutate: async (userId: string) => {
      setPendingUserId(userId);
      setPendingAction("reactivate");
      await queryClient.cancelQueries({ queryKey: ["admin", "suppliers", supplierId] });
      const previous = queryClient.getQueryData(["admin", "suppliers", supplierId]);
      queryClient.setQueryData(["admin", "suppliers", supplierId], (old: SupplierDetails | undefined) => {
        if (!old) return old;
        const users = Array.isArray(old.users) ? old.users.map((u) => u.id === userId ? { ...u, isActive: true } : u) : old.users;
        return { ...old, users } as SupplierDetails;
      });
      return { previous };
    },
    onError: (e: unknown, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["admin", "suppliers", supplierId], ctx.previous as SupplierDetails);
      toast.error(e instanceof Error ? e.message : "Thao tác thất bại");
    },
    onSuccess: () => {
      toast.success("Đã kích hoạt tài khoản nhà cung cấp");
    },
    onSettled: () => {
      setPendingUserId(null);
      setPendingAction(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "suppliers", supplierId] });
    },
  });

  const resetPassword = useMutation({
    mutationFn: ({ userId, password }: { userId: string; password: string }) => supplierAdminService.resetUserPassword(userId, password),
    onMutate: async ({ userId }: { userId: string; password: string }) => {
      setPendingUserId(userId);
      setPendingAction("reset");
    },
    onSuccess: (_d, vars) => {
      setPasswordChanged((m) => ({ ...m, [vars.userId]: true }));
      setNewPasswords((m) => ({ ...m, [vars.userId]: "" }));
      setTimeout(() => setPasswordChanged((m) => ({ ...m, [vars.userId]: false })), 5000);
      refetch();
      toast.success("Đặt lại mật khẩu thành công");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Đặt lại mật khẩu thất bại"),
    onSettled: () => {
      setPendingUserId(null);
      setPendingAction(null);
    },
  });
  const deleteUser = useMutation({
    mutationFn: (userId: string) => supplierAdminService.deleteUser(userId),
    onMutate: async (userId: string) => {
      setPendingUserId(userId);
      setPendingAction("delete");
      await queryClient.cancelQueries({ queryKey: ["admin", "suppliers", supplierId] });
      const previous = queryClient.getQueryData(["admin", "suppliers", supplierId]);
      queryClient.setQueryData(["admin", "suppliers", supplierId], (old: SupplierDetails | undefined) => {
        if (!old) return old;
        const users = Array.isArray(old.users) ? old.users.filter((u) => u.id !== userId) : old.users;
        return { ...old, users } as SupplierDetails;
      });
      return { previous };
    },
    onError: (e: unknown, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["admin", "suppliers", supplierId], ctx.previous as SupplierDetails);
      toast.error(e instanceof Error ? e.message : "Xoá tài khoản thất bại");
    },
    onSuccess: () => { toast.success("Đã xoá tài khoản nhà cung cấp"); },
    onSettled: () => {
      setPendingUserId(null);
      setPendingAction(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "suppliers", supplierId] });
    },
  });

  const s = data;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [newPasswords, setNewPasswords] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [passwordChanged, setPasswordChanged] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (s) {
      setName(s.name || "");
      setEmail(s.email || "");
      setContactName(s.contactName || "");
      setPhone(s.phone || "");
      setAddress(s.address || "");
    }
  }, [s]);

  const updateSupplier = useMutation({
    mutationFn: () => supplierAdminService.update(supplierId, { name: name.trim(), email: email.trim(), contactName: contactName.trim() || undefined, phone: phone.trim() || undefined, address: address.trim() || undefined }),
    onSuccess: () => { refetch(); toast.success("Đã lưu thông tin nhà cung cấp"); },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Lưu thất bại"),
  });
  const deactivateSupplier = useMutation({
    mutationFn: () => supplierAdminService.delete(supplierId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["admin", "suppliers", supplierId] });
      const previous = queryClient.getQueryData(["admin", "suppliers", supplierId]);
      queryClient.setQueryData(["admin", "suppliers", supplierId], (old: SupplierDetails | undefined) => old ? ({ ...old, isActive: false } as SupplierDetails) : old);
      return { previous };
    },
    onError: (e: unknown, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["admin", "suppliers", supplierId], ctx.previous as SupplierDetails);
      toast.error(e instanceof Error ? e.message : "Thao tác thất bại");
    },
    onSuccess: () => { toast.success("Đã vô hiệu nhà cung cấp"); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ["admin", "suppliers", supplierId] }); },
  });

  const generateRandomPassword = () => {
    const part = () => Math.random().toString(36).slice(-6);
    return (part() + part()).slice(0, 12);
  };

  const MIN_PASSWORD_LENGTH = 12; 
  const validateStrongPassword = (pwd: string) => {
    if (pwd.length < MIN_PASSWORD_LENGTH) return `Mật khẩu tối thiểu ${MIN_PASSWORD_LENGTH} ký tự`;
    if (!/[a-z]/.test(pwd)) return "Phải chứa ít nhất 1 chữ thường";
    if (!/[A-Z]/.test(pwd)) return "Phải chứa ít nhất 1 chữ hoa";
    if (!/[0-9]/.test(pwd)) return "Phải chứa ít nhất 1 chữ số";
    if (!/[^A-Za-z0-9]/.test(pwd)) return "Phải chứa ít nhất 1 ký tự đặc biệt";
    return "";
  };

  const activateSupplier = useMutation({
    mutationFn: () => supplierAdminService.activate(supplierId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["admin", "suppliers", supplierId] });
      const previous = queryClient.getQueryData(["admin", "suppliers", supplierId]);
      queryClient.setQueryData(["admin", "suppliers", supplierId], (old: SupplierDetails | undefined) => old ? ({ ...old, isActive: true } as SupplierDetails) : old);
      return { previous };
    },
    onError: (e: unknown, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["admin", "suppliers", supplierId], ctx.previous as SupplierDetails);
      toast.error(e instanceof Error ? e.message : "Thao tác thất bại");
    },
    onSuccess: () => { toast.success("Đã kích hoạt nhà cung cấp"); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ["admin", "suppliers", supplierId] }); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/suppliers")}>Quay lại</Button>
        <div className="text-neutral-400">/</div>
        <h1 className="text-2xl font-semibold tracking-tight">Chi tiết nhà cung cấp</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <span>{s?.name || (isLoading ? "Đang tải…" : error ? "Lỗi tải dữ liệu" : "Không có dữ liệu")}</span>
              {typeof s?.isActive === 'boolean' && (
                s.isActive ? <Badge className="text-[10px]" variant="secondary">Đang hoạt động</Badge> : <Badge className="text-[10px]" variant="destructive">Đã vô hiệu</Badge>
              )}
            </CardTitle>
            <div className="text-sm text-muted-foreground">{s?.email || ""}</div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-base font-medium">Chỉnh sửa thông tin nhà cung cấp</h2>
            <form
              className="mt-3 space-y-4"
              onSubmit={(e) => { e.preventDefault(); updateSupplier.mutate(); }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="name">Tên</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="contactName">Người liên hệ</Label>
                  <Input id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit" disabled={updateSupplier.isPending}>
                  {updateSupplier.isPending ? "Đang lưu…" : "Lưu thay đổi"}
                </Button>

                {s?.isActive ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={deactivateSupplier.isPending}>
                        Vô hiệu nhà cung cấp
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận vô hiệu hoá</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này sẽ vô hiệu hoá nhà cung cấp. Bạn có chắc chắn muốn tiếp tục?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deactivateSupplier.mutate()}>Xác nhận</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button variant="secondary" disabled={activateSupplier.isPending} onClick={() => activateSupplier.mutate()}>
                    {activateSupplier.isPending ? "Đang kích hoạt…" : "Kích hoạt nhà cung cấp"}
                  </Button>
                )}

                {!!updateSupplier.error && <div className="text-sm text-red-600">{(updateSupplier.error as Error).message}</div>}
                {updateSupplier.isSuccess && <Badge variant="secondary">Đã lưu</Badge>}
              </div>
            </form>
          </div>

          <div>
            <h2 className="text-base font-medium">Tạo tài khoản nhà cung cấp</h2>
            <p className="text-sm text-muted-foreground">Tài khoản đăng nhập bằng Email và Username. Vui lòng nhập cả hai trường.</p>
            <form className="mt-3 space-y-4" onSubmit={(e) => { e.preventDefault(); createUser.mutate(); }}>
              <div className="space-y-1.5">
                <Label htmlFor="supplier-login-email">Email đăng nhập</Label>
                <Input id="supplier-login-email" type="email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} placeholder="name@example.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="supplier-username">Username</Label>
                <Input id="supplier-username" type="text" value={usernameLogin} onChange={(e) => setUsernameLogin(e.target.value)} placeholder="username" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tempPass">Mật khẩu tạm thời (≥ 8 ký tự)</Label>
                <Input id="tempPass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={8} required />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit" disabled={createUser.isPending}>
                  {createUser.isPending ? "Đang tạo…" : "Tạo tài khoản"}
                </Button>
                {!!createUser.error && (
                  <div className="text-sm text-red-600">{(createUser.error as Error).message}</div>
                )}
                {createUser.isSuccess && (
                  <Badge variant="secondary">Tạo tài khoản thành công</Badge>
                )}
              </div>
            </form>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-base font-medium">Tài khoản đã cấp</h2>
            {isLoading ? (
              <div className="mt-3 text-sm text-muted-foreground">Đang tải…</div>
            ) : error ? (
              <div className="mt-3 text-sm text-red-600">Không tải được danh sách tài khoản.</div>
            ) : !s?.users?.length ? (
              <div className="mt-3 text-sm text-muted-foreground">Chưa có tài khoản.</div>
            ) : (
              <div className="mt-3 divide-y rounded border">
                {s.users.map((u) => (
                  <div key={u.id} className="p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{u.username}</div>
                        <div className="text-xs text-muted-foreground">Tạo lúc: {u.createdAt ? new Date(u.createdAt).toLocaleString("vi-VN") : "—"}</div>
                      </div>

                      {typeof u.isActive === 'boolean' ? (
                        u.isActive ? (
                          <Badge variant="secondary" className="text-[10px]">Hoạt động</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">Vô hiệu</Badge>
                        )
                      ) : null}
                      {(u.isActive !== false) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={pendingUserId === u.id && pendingAction !== null}
                              title="Deactivate"
                            >
                              {pendingUserId === u.id && pendingAction === 'deactivate' ? 'Đang vô hiệu…' : 'Vô hiệu'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận vô hiệu tài khoản</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn vô hiệu tài khoản &quot;{u.username}&quot;?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Huỷ</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deactivate.mutate(u.id)}>Xác nhận</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      {(u.isActive === false) && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => reactivate.mutate(u.id)}
                          disabled={pendingUserId === u.id && pendingAction !== null}
                          title="Reactivate"
                        >
                          {pendingUserId === u.id && pendingAction === 'reactivate' ? 'Đang kích hoạt…' : 'Kích hoạt'}
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={pendingUserId === u.id && pendingAction !== null}
                            title="Xóa tài khoản"
                          >
                            {pendingUserId === u.id && pendingAction === 'delete' ? 'Đang xóa…' : 'Xóa'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này không thể hoàn tác. Xoá tài khoản &quot;{u.username}&quot;?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Huỷ</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteUser.mutate(u.id)}>Xác nhận</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <div className="w-full md:w-auto md:flex-1" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            disabled={(pendingUserId === u.id && pendingAction !== null) || resetPassword.isPending}
                          >
                            {resetPassword.isPending && pendingUserId === u.id ? "Đang cập nhật…" : "Đổi/Lấy lại mật khẩu"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Đổi/Lấy lại mật khẩu</AlertDialogTitle>
                            <AlertDialogDescription>
                              Nhập mật khẩu mới hoặc tạo mật khẩu tạm đáp ứng chính sách: tối thiểu {MIN_PASSWORD_LENGTH} ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="flex items-center gap-2">
                            <Input
                              type={showPasswords[u.id] ? "text" : "password"}
                              value={newPasswords[u.id] || ""}
                              onChange={(e) => setNewPasswords((m) => ({ ...m, [u.id]: e.target.value }))}
                              placeholder={`Mật khẩu mới (≥ ${MIN_PASSWORD_LENGTH} ký tự, A-z, 0-9, ký tự đặc biệt)`}
                              minLength={MIN_PASSWORD_LENGTH}
                              className="flex-1"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label={showPasswords[u.id] ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                              onClick={() => setShowPasswords((m) => ({ ...m, [u.id]: !m[u.id] }))}
                            >
                              {showPasswords[u.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={async () => {
                                const pwd = generateRandomPassword();
                                setNewPasswords((m) => ({ ...m, [u.id]: pwd }));
                                try {
                                  await navigator.clipboard.writeText(pwd);
                                  toast.success("Đã tạo và sao chép mật khẩu tạm");
                                } catch {
                                  toast.success("Đã tạo mật khẩu tạm");
                                }
                              }}
                            >
                              Tạo mật khẩu tạm
                            </Button>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Huỷ</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                const pwd = (newPasswords[u.id] || "").trim();
                                const err = validateStrongPassword(pwd);
                                if (err) { toast.error(err); return; }
                                resetPassword.mutate({ userId: u.id, password: pwd });
                              }}
                              disabled={resetPassword.isPending}
                            >
                              Xác nhận
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {passwordChanged[u.id] && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Đã đổi mật khẩu
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
