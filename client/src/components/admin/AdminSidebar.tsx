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
  Building2,
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
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return Boolean(pathname?.startsWith(href));
  };

  return (
    <>
      <SidebarHeader className="border-b">
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold tracking-tight">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Quản lý hệ thống</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin")}>
                  <Link href="/admin">
                    <LayoutDashboard className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sản phẩm & Danh mục</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/products")}>
                  <Link href="/admin/products">
                    <Package className="size-4" />
                    <span>Sản phẩm</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/categories")}>
                  <Link href="/admin/categories">
                    <Grid2X2 className="size-4" />
                    <span>Danh mục</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/discounts")}>
                  <Link href="/admin/discounts">
                    <Ticket className="size-4" />
                    <span>Giảm giá</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Đơn hàng & Khách hàng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/orders")}>
                  <Link href="/admin/orders">
                    <ShoppingCart className="size-4" />
                    <span>Đơn hàng</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/customers")}>
                  <Link href="/admin/customers">
                    <Users className="size-4" />
                    <span>Khách hàng</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/suppliers")}>
                  <Link href="/admin/suppliers">
                    <Building2 className="size-4" />
                    <span>Nhà cung cấp</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Nội dung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/blog")}>
                  <Link href="/admin/blog">
                    <Newspaper className="size-4" />
                    <span>Blog</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/ratings")}>
                  <Link href="/admin/ratings">
                    <Star className="size-4" />
                    <span>Đánh giá</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/site-content")}>
                  <Link href="/admin/site-content">
                    <FileText className="size-4" />
                    <span>Nội dung trang</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserIcon className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name || user?.email || "Admin"}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email || "—"}</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            disabled={isPending}
            className="w-full"
          >
            <LogOut className="size-4" />
            {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </>
  );
};

export default AdminSidebar;
