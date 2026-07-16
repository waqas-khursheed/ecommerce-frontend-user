"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import type { ProductFilters as ProductFiltersType } from "@/types/product";

interface ProductFiltersProps {
  onChange: (filters: ProductFiltersType) => void;
}

// TODO: add category/brand/price-range controls once those endpoints are wired up.
export function ProductFilters({ onChange }: ProductFiltersProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    onChange({ search: debouncedSearch || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor="search">Search</Label>
      <Input
        id="search"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-11"
      />
    </div>
  );
}
