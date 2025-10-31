"use client"

import React, { useCallback, useMemo } from "react"
import type { OrderSummary } from "@/type/order"
import OrderRow from "./OrderRow"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Inbox } from "lucide-react"

export type OrdersTableProps = {
  orders: OrderSummary[]
  selected: Record<string, boolean>
  onToggleOne: (id: string, on: boolean) => void
  onToggleAll: (on: boolean) => void
  emptyText?: string
}

export default function OrdersTable(props: OrdersTableProps) {
  const { orders, selected, onToggleAll, onToggleOne, emptyText = "Không có dữ liệu" } = props

  const allChecked = useMemo(
    () => orders.length > 0 && orders.every((o) => selected[o.id]),
    [orders, selected]
  )

  const handleToggleAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onToggleAll(e.target.checked)
    },
    [onToggleAll]
  )

  const renderBody = () => {
    if (orders.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={9} className="p-8 text-center text-black/60">
            <div className="flex flex-col items-center gap-2">
              <Inbox className="size-6 text-muted-foreground" aria-hidden />
              <span>{emptyText}</span>
            </div>
          </TableCell>
        </TableRow>
      )
    }
    return orders.map((o) => (
      <OrderRow
        key={o.id}
        order={o}
        selected={!!selected[o.id]}
        onToggle={(on) => onToggleOne(o.id, on)}
      />
    ))
  }

  return (
    <div className="rounded-xl border border-black/10 overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-black/5">
          <TableRow>
            <TableHead className="p-3">
              <input
                aria-label="select all"
                type="checkbox"
                checked={allChecked}
                onChange={handleToggleAll}
              />
            </TableHead>
            <TableHead className="p-3 text-left">Mã</TableHead>
            <TableHead className="p-3 text-left">Loại thanh toán</TableHead>
            <TableHead className="p-3 text-left">Loại khách</TableHead>
            <TableHead className="p-3 text-left">Trạng thái</TableHead>
            <TableHead className="p-3 text-right">Tổng</TableHead>
            <TableHead className="p-3 text-left">Cập nhật trạng thái</TableHead>
            <TableHead className="p-3 text-left">Mã vận chuyển</TableHead>
            <TableHead className="p-3 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderBody()}</TableBody>
      </Table>
    </div>
  )
}
