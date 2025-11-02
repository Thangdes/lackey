"use client"

import React, { useCallback, useMemo } from "react"
import type { OrderSummary } from "@/type/order"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Inbox } from "lucide-react"
import OrderRow from "./OrderRow"

export type OrdersTableProps = {
  orders: OrderSummary[]
  selected: Record<string, boolean>
  onToggleOne: (id: string, on: boolean) => void
  onToggleAll: (on: boolean) => void
}

export default function OrdersTable(props: OrdersTableProps) {
  const { orders, selected, onToggleOne, onToggleAll } = props

  const allIds = useMemo(() => orders.map((o) => o.id), [orders])
  const selectedCount = useMemo(() => allIds.filter((id) => !!selected[id]).length, [allIds, selected])
  const allSelected = useMemo(() => allIds.length > 0 && selectedCount === allIds.length, [allIds.length, selectedCount])

  const handleToggleAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleAll(e.target.checked)
  }, [onToggleAll])

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded border p-8 text-sm text-muted-foreground text-center">
        <div className="flex flex-col items-center gap-2">
          <Inbox className="size-6 text-muted-foreground" aria-hidden />
          <span>Không có đơn hàng nào.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="p-3">
              <input type="checkbox" checked={allSelected} onChange={handleToggleAll} title="Chọn tất cả" />
            </TableHead>
            <TableHead className="p-3">Đơn hàng</TableHead>
            <TableHead className="p-3">Thanh toán</TableHead>
            <TableHead className="p-3">Khách hàng</TableHead>
            <TableHead className="p-3">Trạng thái</TableHead>
            <TableHead className="p-3 text-right">Tổng cộng</TableHead>
            <TableHead className="p-3">Cập nhật trạng thái</TableHead>
            <TableHead className="p-3">Mã vận chuyển</TableHead>
            <TableHead className="p-3 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              selected={!!selected[order.id]}
              onToggle={(on: boolean) => onToggleOne(order.id, on)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
