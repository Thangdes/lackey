"use client";

import { useCancelOrder } from "@/hook/useOrder";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function InlineCancel({ orderId, orderCode }: { orderId: string; orderCode?: string }) {
  const cancelOrder = useCancelOrder(orderId);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={cancelOrder.isPending}
          className="rounded-lg border border-red-200 bg-red-50 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {cancelOrder.isPending ? "Đang hủy..." : "Hủy đơn"}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[calc(100vw-32px)] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base sm:text-lg">Xác nhận hủy đơn hàng</AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
            Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="mt-0 sm:mt-0">Không, giữ đơn</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => cancelOrder.mutate({ orderCode })} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Có, hủy đơn
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
