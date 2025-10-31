import { cookies } from "next/headers";
import { dehydrate } from "@tanstack/react-query";
import HydrateClient from "@/components/providers/HydrateClient";
import { createQueryClient } from "@/lib/queryClient";
import { prefetchAdminOrderList } from "@/cache/order.cache";
import OrdersAdminClient from "./OrdersAdminClient";
import type { Paginated } from "@/type/common";
import type { OrderSummary } from "@/type/order";

export default async function AdminOrdersPage() {
  const cookieHeader = (await cookies()).toString();
  const qc = createQueryClient();
  const page = 1;
  const limit = 10;
  const status: string | undefined = undefined;
  const search: string | undefined = undefined;
  await prefetchAdminOrderList(qc, { page, limit, status, search }, cookieHeader);
  const state = dehydrate(qc);
  const initial = qc.getQueryData<Paginated<OrderSummary>>(["orders", "list", page, limit, status ?? null, search ?? null]);
  return (
    <HydrateClient state={state}>
      <OrdersAdminClient initial={initial} />
    </HydrateClient>
  );
}
