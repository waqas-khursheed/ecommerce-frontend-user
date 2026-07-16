import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subTotal: number;
  shipping?: number;
  onCheckout?: () => void;
}

export function CartSummary({ subTotal, shipping = 0, onCheckout }: CartSummaryProps) {
  const total = subTotal + shipping;

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatPrice(subTotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      <Button className="h-11 w-full" onClick={onCheckout}>
        Checkout
      </Button>
    </div>
  );
}
