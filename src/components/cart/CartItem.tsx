import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadUrl } from "@/lib/http";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types/order";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
}

export function CartItem({ item, onQuantityChange, onRemove, isUpdating }: CartItemProps) {
  const image = uploadUrl("products", item.product.featured_image);

  return (
    <div className="flex gap-3 py-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted sm:size-20">
        {image && <Image src={image} alt={item.product.title} fill sizes="80px" className="object-cover" />}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <p className="line-clamp-2 text-sm font-medium">{item.product.title}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={isUpdating}
              onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={isUpdating}
              onClick={() => onQuantityChange(item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <span className="text-sm font-semibold">{formatPrice(item.lineTotal)}</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={onRemove} aria-label="Remove item">
        <Trash2 className="size-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
