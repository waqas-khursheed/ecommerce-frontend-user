"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">Error</p>
      <h1 className="text-2xl font-bold sm:text-3xl">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        This page hit an unexpected error. You can try again, or head back to the homepage.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
