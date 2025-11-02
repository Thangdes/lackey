import { useOrderItemPrice } from "@/hook/useOrderItemPrice";
import { formatVND } from "@/utils/format";
import { TableCell, TableRow } from "@/components/ui/table";
import type { OrderItem } from "@/type/order";

interface OrderItemRowProps {
  item: OrderItem;
}

export function OrderItemRow({ item }: OrderItemRowProps) {
  const pv = item.productVariant;
  const name = pv?.product?.name || pv?.name || "Sản phẩm";
  const pricing = useOrderItemPrice(item);

  return (
    <TableRow>
      <TableCell className="max-w-[280px]">
        <div className="font-medium truncate">{name}</div>
      </TableCell>
      <TableCell className="text-xs text-black/60">{pv?.sku || "-"}</TableCell>
      <TableCell className="text-right">
        <div className="flex flex-col items-end gap-1">
          {pricing.hasDiscount ? (
            <>
              <div className="text-sm font-semibold text-[#AE1C2C]">
                {formatVND(pricing.effectivePrice)}
              </div>
              <div className="text-xs text-black/50 line-through">
                {formatVND(pricing.originalPrice)}
              </div>
              <div className="text-[10px] text-green-600 font-medium">
                -{pricing.discountPercent}%
              </div>
            </>
          ) : (
            <div className="text-sm font-medium">
              {formatVND(pricing.effectivePrice)}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-sm font-medium">×{pricing.quantity}</span>
      </TableCell>
      <TableCell className="text-right">
        <div className="text-base font-bold text-[#AE1C2C]">
          {formatVND(pricing.lineTotal)}
        </div>
      </TableCell>
    </TableRow>
  );
}
