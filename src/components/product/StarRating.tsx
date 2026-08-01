"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}

export function StarRating({ value, onChange, size = "sm" }: StarRatingProps) {
  const starSize = size === "sm" ? "size-3.5" : "size-6";
  const interactive = !!onChange;

  if (!interactive) {
    return (
      <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(value);
          return (
            <Star
              key={i}
              aria-hidden="true"
              className={cn(starSize, filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(value);
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="cursor-pointer"
            aria-label={`${i + 1} star${i === 0 ? "" : "s"}`}
          >
            <Star className={cn(starSize, filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
          </button>
        );
      })}
    </div>
  );
}
