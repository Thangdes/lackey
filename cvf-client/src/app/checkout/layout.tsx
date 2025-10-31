import { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { http } from "@/utils/http";
import { API } from "@/constant/api";
import type { ServerCart } from "@/type/cart";

export default async function CheckoutLayout({ children }: { children: ReactNode }) {
  const _allowEmpty = (typeof process !== "undefined") && (
    process.env.CHECKOUT_ALLOW_EMPTY_CART === "1" ||
    process.env.NEXT_PUBLIC_CHECKOUT_ALLOW_EMPTY_CART === "1"
  );
  if (_allowEmpty) {
    return <>{children}</>;
  }
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let _cart: ServerCart | null = null;
  try {
    _cart = await http.get<ServerCart>(API.cart.root, {
      withCredentials: true,
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });
  } catch {
  }
  void _cart;
  return <>{children}</>;
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
