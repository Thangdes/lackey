"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLogout } from "@/hook/useAuth";
import {
  LayoutDashboard,
  Package,
  Grid2X2,
  ShoppingCart,
  Users,
  User as UserIcon,
  LogOut,
  Newspaper,
  Ticket,
  Star,
  FileText,
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

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  const isActive = (href: string) => Boolean(pathname?.startsWith(href));

  return (
    <>
      <SidebarHeader>
        <div className="px-2 py-2 font-bold text-base">Bảng điều khiển</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin")}>
                  <Link href="/admin">
                    <LayoutDashboard />
                    <span>Tổng quan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/products")}>
                  <Link href="/admin/products">
                    <Package />
                    <span>Sản phẩm</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/categories")}>
                  <Link href="/admin/categories">
                    <Grid2X2 />
                    <span>Danh mục</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/discounts")}>
                  <Link href="/admin/discounts">
                    <Ticket />
                    <span>Giảm giá</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/orders")}>
                  <Link href="/admin/orders">
                    <ShoppingCart />
                    <span>Đơn hàng</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/customers")}>
                  <Link href="/admin/customers">
                    <Users />
                    <span>Khách hàng</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/suppliers")}>
                  <Link href="/admin/suppliers">
                    <Users />
                    <span>Nhà cung cấp</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/blog")}>
                  <Link href="/admin/blog">
                    <Newspaper />
                    <span>Blog</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/ratings")}>
                  <Link href="/admin/ratings">
                    <Star />
                    <span>Đánh giá</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/site-content")}>
                  <Link href="/admin/site-content">
                    <FileText />
                    <span>Nội dung trang</span>
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
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{user?.name || user?.email || "Admin"}</div>
              <div className="text-xs text-neutral-500 truncate">{user?.email || "—"}</div>
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

export default AdminSidebar;
