"use client";

import Link from "next/link";
import type { Customer } from "@/type/customer";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Eye, Inbox } from "lucide-react";

interface Props {
  customers: Customer[];
  emptyText?: string;
}

export default function CustomersTable({ customers, emptyText }: Props) {
  if (!customers.length) {
    return (
      <div className="rounded border p-8 text-sm text-muted-foreground text-center">
        <div className="flex flex-col items-center gap-2">
          <Inbox className="size-6 text-muted-foreground" aria-hidden />
          <span>{emptyText || "Không có khách hàng."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableHead className="py-2 px-2">Tên</TableHead>
            <TableHead className="py-2 px-2">Email</TableHead>
            <TableHead className="py-2 px-2">SĐT</TableHead>
            <TableHead className="py-2 px-2">Ngày tạo</TableHead>
            <TableHead className="py-2 px-2 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="py-2 px-2 font-medium">{c.fullName || "(Chưa có tên)"}</TableCell>
              <TableCell className="py-2 px-2">{c.email}</TableCell>
              <TableCell className="py-2 px-2">{c.phone || "-"}</TableCell>
              <TableCell className="py-2 px-2">{new Date(c.createdAt).toLocaleString("vi-VN")}</TableCell>
              <TableCell className="py-2 px-2 text-right">
                <Link href={`/admin/customers/${c.id}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                  <Eye className="size-4" aria-hidden />
                  Xem
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

