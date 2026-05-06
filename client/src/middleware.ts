import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type JsonResponse = Record<string, unknown>;

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;

  const accessToken = cookies.get("accessToken")?.value;
  const refreshToken = cookies.get("refreshToken")?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken);

  const protectedPrefixes = ["/profile", "/orders", "/admin", "/supplier"];

  const path = nextUrl.pathname;
  const rawPrefix = process.env.NEXT_INTERNAL_API_PREFIX || "/api/v1";
  const apiPrefix = `/${rawPrefix.replace(/^\/+/g, "").replace(/\/$/, "")}`;
  const internalBase = (process.env.NEXT_INTERNAL_API_BASE || "http://localhost:8000").replace(/\/$/, "");
  const profileUrl = `${internalBase}${apiPrefix}/auth/profile`;
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

  if (path === "/admin" || path.startsWith("/admin/")) {
    try {
      const cookieHeader = req.cookies
        .getAll()
        .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
        .join("; ");
      
      const profileRes = await fetch(profileUrl, {
        method: "GET",
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        cache: "no-store",
      });
      if (!profileRes.ok) {
        const url = new URL("/", nextUrl);
        url.searchParams.set("redirect", path);
        return NextResponse.redirect(url);
      }
      const json = await profileRes.json() as JsonResponse;
      const user = (json && typeof json === 'object' && 'data' in json) ? (json.data as JsonResponse) : json;
      const role = typeof user?.role === "string" ? user.role.toUpperCase() : undefined;
      if (role !== "ADMIN") {
        const url = new URL("/", nextUrl);
        url.searchParams.set("redirect", path);
        return NextResponse.redirect(url);
      }
    } catch {
      const url = new URL("/", nextUrl);
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }
  }

  if (path === "/supplier" || path.startsWith("/supplier/")) {
    try {
      const cookieHeader = req.cookies
        .getAll()
        .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
        .join("; ");

      const profileRes = await fetch(profileUrl, {
        method: "GET",
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        cache: "no-store",
      });

      if (!profileRes.ok) {
        const url = new URL("/", nextUrl);
        url.searchParams.set("redirect", path);
        return NextResponse.redirect(url);
      }
      const json = await profileRes.json() as JsonResponse;
      const user = (json && typeof json === 'object' && 'data' in json) ? (json.data as JsonResponse) : json;
      const role = typeof user?.role === "string" ? user.role.toUpperCase() : undefined;
      if (role !== "SUPPLIER" && role !== "ADMIN") {
        const url = new URL("/", nextUrl);
        url.searchParams.set("redirect", path);
        return NextResponse.redirect(url);
      }
    } catch {
      const url = new URL("/supplier/login", nextUrl);
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }
  }

  if (isSupplierLogin && isAuthenticated) {
    try {
      const cookieHeader = req.cookies
        .getAll()
        .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
        .join("; ");

      const profileRes = await fetch(profileUrl, {
        method: "GET",
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
        cache: "no-store",
      });

      let to = "/";
      if (profileRes.ok) {
        const json = await profileRes.json() as JsonResponse;
        const user = (json && typeof json === 'object' && 'data' in json) ? (json.data as JsonResponse) : json;
        const role = typeof user?.role === "string" ? user.role.toUpperCase() : undefined;
        if (role === "SUPPLIER" || role === "ADMIN") {
          to = "/supplier";
        }
      }
      return NextResponse.redirect(new URL(to, nextUrl));
    } catch {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*", "/admin/:path*", "/supplier/:path*"],
};
