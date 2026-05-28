"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthModalStore } from "@/store/authModal";
import { cartService } from "@/service/cart.service";
import { cartKeys } from "@/constant/key/cart";
import type { ServerCart } from "@/type/cart";

export default function CartBootstrap() {
  const openAuth = useAuthModalStore((s) => s.openWith);
  const qc = useQueryClient();
  useEffect(() => {
    (async () => {
      try {
        await qc.prefetchQuery({
          queryKey: cartKeys.root(),
          queryFn: async () => {
            const data = await cartService.getCart();
            return (data ?? ({ items: [] } as ServerCart));
          },
          staleTime: 30_000,
          gcTime: 5 * 60_000,
        });
      } catch {
      }
    })();

    const onUnauthorized = () => {
      toast.error("Bạn cần đăng nhập để thêm vào giỏ.", {
        description: "Vui lòng đăng nhập để tiếp tục.",
      });
      try { openAuth('signin'); } catch {}
    };

    window.addEventListener("cart:unauthorized", onUnauthorized as EventListener);
    return () => {
      window.removeEventListener("cart:unauthorized", onUnauthorized as EventListener);
    };
  }, [qc, openAuth]);

  return null;
}
