import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;

  const accessToken = cookies.get("accessToken")?.value;
  const refreshToken = cookies.get("refreshToken")?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken);

  const protectedPrefixes = ["/profile", "/orders", "/admin", "/supplier"];

  const path = nextUrl.pathname;
  if (path === "/orders/lookup") {
    return NextResponse.next();
  }
  const isSupplierLogin = path === "/supplier/login";
  if (path === "/supplier/settings" || path === "/supplier/restock") {
    const url = new URL("/supplier/help", nextUrl);
    return NextResponse.redirect(url);
  }
  const requiresAuth = protectedPrefixes.some(
    (prefix) => path === prefix || path.startsWith(prefix + "/"),
  );

  if (requiresAuth && !isAuthenticated) {
    if (isSupplierLogin) {
      return NextResponse.next();
    }
    if (path === "/supplier" || path.startsWith("/supplier/")) {
      const url = new URL("/supplier/login", nextUrl);
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }
    const url = new URL("/", nextUrl);
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*", "/admin/:path*", "/supplier/:path*"],
};

