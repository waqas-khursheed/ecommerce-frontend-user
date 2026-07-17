"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import { useTags } from "@/hooks/useTags";
import type { ProductFilters as ProductFiltersType } from "@/types/product";

const SORT_OPTIONS: { value: NonNullable<ProductFiltersType["sort"]>; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "best_selling", label: "Best Selling" },
];

interface ProductFiltersProps {
  value: ProductFiltersType;
  onChange: (filters: ProductFiltersType) => void;
  hideCategory?: boolean;
  hideBrand?: boolean;
  hideTag?: boolean;
}

export function ProductFilters({ value, onChange, hideCategory, hideBrand, hideTag }: ProductFiltersProps) {
  const [search, setSearch] = useState(value.search ?? "");
  const debouncedSearch = useDebounce(search, 400);
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: tags } = useTags();

  useEffect(() => {
    if (debouncedSearch === (value.search ?? "")) return;
    onChange({ ...value, search: debouncedSearch || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const update = (patch: Partial<ProductFiltersType>) => onChange({ ...value, ...patch });

  const hasActiveFilters =
    !!value.search ||
    !!value.category ||
    !!value.brand ||
    !!value.tag ||
    !!value.min_price ||
    !!value.max_price ||
    !!value.sort;

  return (
    <div className="space-y-5">
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

      <div className="space-y-1.5">
        <Label>Sort by</Label>
        <Select
          value={value.sort ?? "newest"}
          onValueChange={(v) => update({ sort: v as ProductFiltersType["sort"] })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!hideCategory && categories && categories.length > 0 && (
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select
            value={value.category ?? "all"}
            onValueChange={(v) => update({ category: !v || v === "all" ? undefined : v })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!hideBrand && brands && brands.length > 0 && (
        <div className="space-y-1.5">
          <Label>Brand</Label>
          <Select value={value.brand ?? "all"} onValueChange={(v) => update({ brand: !v || v === "all" ? undefined : v })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.slug}>
                  {b.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!hideTag && tags && tags.length > 0 && (
        <div className="space-y-1.5">
          <Label>Tag</Label>
          <Select value={value.tag ?? "all"} onValueChange={(v) => update({ tag: !v || v === "all" ? undefined : v })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {tags.map((t) => (
                <SelectItem key={t.id} value={t.slug}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Price range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            className="h-10"
            defaultValue={value.min_price ?? ""}
            onBlur={(e) => update({ min_price: e.target.value ? Number(e.target.value) : undefined })}
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            className="h-10"
            defaultValue={value.max_price ?? ""}
            onBlur={(e) => update({ max_price: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            setSearch("");
            onChange({});
          }}
        >
          <X />
          Clear filters
        </Button>
      )}
    </div>
  );
}
