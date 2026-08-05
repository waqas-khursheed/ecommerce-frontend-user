import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_SIZE_CLASSES = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const;

interface LoaderProps {
  className?: string;
  /** Icon size — defaults to "md" (size-6), matching the original fixed size. */
  size?: "sm" | "md" | "lg";
  /**
   * Skip the centering wrapper (`flex items-center justify-center py-10`) and
   * render just the spinning icon — for dropping the loader inline inside a
   * button or next to other content instead of as a full-panel loader.
   */
  inline?: boolean;
}

export function Loader({ className, size = "md", inline = false }: LoaderProps) {
  if (inline) {
    return <Loader2 className={cn(ICON_SIZE_CLASSES[size], "animate-spin text-muted-foreground", className)} />;
  }

  return (
    <div className={cn("flex items-center justify-center py-10", className)}>
      <Loader2 className={cn(ICON_SIZE_CLASSES[size], "animate-spin text-muted-foreground")} />
    </div>
  );
}
