import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-10", className)}>
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
