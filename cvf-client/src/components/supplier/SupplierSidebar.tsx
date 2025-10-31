"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLogout } from "@/hook/useAuth";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  LogOut,
  User as UserIcon,
  User,
} from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const SupplierSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  const isActive = (href: string) => Boolean(pathname?.startsWith(href));

  return (
    <>
      <SidebarHeader>
        <div className="px-3 py-3 font-bold text-lg">Khu vực Nhà cung cấp</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel style={{ fontSize: 15 }}>Tổng quan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/supplier")} size="lg">
                  <Link href="/supplier">
                    <LayoutDashboard />
                    <span className="text-[16px]">Bảng điều khiển</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/supplier/chart")} size="lg">
                  <Link href="/supplier/chart">
                    <span className="inline-flex items-center justify-center w-4 h-4">📈</span>
                    <span className="text-[16px]">Biểu đồ doanh thu</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel style={{ fontSize: 15 }}>Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/supplier/orders")} size="lg">
                  <Link href="/supplier/orders">
                    <ShoppingCart />
                    <span className="text-[16px]">Đơn hàng</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/supplier/inventory")} size="lg">
                  <Link href="/supplier/inventory">
                    <Boxes />
                    <span className="text-[16px]">Tồn kho</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/supplier/profile")} size="lg">
                  <Link href="/supplier/profile">
                    <User />
                    <span className="text-[16px]">Hồ sơ nhà cung cấp</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/supplier/help")} size="lg">
                  <Link href="/supplier/help">
                    <span className="inline-flex items-center justify-center w-4 h-4">❓</span>
                    <span className="text-[16px]">Hướng dẫn</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="rounded-md border bg-neutral-50 p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[16px] font-medium truncate">{user?.name || user?.email || "Supplier"}</div>
              <div className="text-sm text-neutral-500 truncate">{user?.email || "—"}</div>
            </div>
          </div>
          <Button
            className="mt-3 w-full justify-center gap-2"
            size="sm"
            variant="secondary"
            disabled={isPending}
            onClick={() => logout(undefined, { onSuccess: () => router.push("/") })}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </>
  );
};

export default SupplierSidebar;
