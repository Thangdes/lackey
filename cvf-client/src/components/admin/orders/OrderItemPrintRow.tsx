import { useOrderItemPrice } from "@/hook/useOrderItemPrice";
import { formatVND } from "@/utils/format";
import type { OrderItem } from "@/type/order";

interface OrderItemPrintRowProps {
  item: OrderItem;
}

export function OrderItemPrintRow({ item }: OrderItemPrintRowProps) {
  const pv = item.productVariant;
  const name = pv?.product?.name || pv?.name || "Sản phẩm";
  const sku = pv?.sku || "-";
  const pricing = useOrderItemPrice(item);

  return (
    <tr className="border-b border-black/10">
      <td className="py-2 pr-2">
        <div className="font-medium">{name}</div>
      </td>
      <td className="py-2 pr-2 text-black/60">{sku}</td>
      <td className="py-2 pr-2 text-right">
        <div className="font-medium">{formatVND(pricing.effectivePrice)}</div>
      </td>
      <td className="py-2 pr-2 text-right font-medium">{pricing.quantity}</td>
      <td className="py-2 text-right font-bold">{formatVND(pricing.lineTotal)}</td>
    </tr>
  );
}
