"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/useProducts";
import { uploadUrl } from "@/lib/http";
import { formatPrice } from "@/lib/utils";

interface SearchAutocompleteProps {
  inputClassName?: string;
  autoFocus?: boolean;
  /** Called after the user navigates away (result click or submit) — lets the
   * mobile full-width search overlay close itself. */
  onNavigate?: () => void;
}

// A single search box shared by the desktop bar and the mobile full-width
// overlay — as the shopper types, a dropdown of matching products (image,
// title, price) appears below, with a "see all results" link, instead of
// making them submit blind and wait for a full results page.
export function SearchAutocomplete({ inputClassName, autoFocus, onNavigate }: SearchAutocompleteProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query.trim(), 300);

  const { data, isFetching } = useProducts({ search: debouncedQuery, limit: 5 });
  const suggestions = debouncedQuery.length >= 2 ? (data?.products ?? []) : [];

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const goToResults = (q: string) => {
    setIsOpen(false);
    onNavigate?.();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    goToResults(query.trim());
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute left-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Search className="size-4" />
        </button>
        <Input
          type="search"
          autoFocus={autoFocus}
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={inputClassName ?? "h-10 pl-9"}
        />
      </form>

      {isOpen && debouncedQuery.length >= 2 && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border bg-popover shadow-lg ring-1 ring-foreground/10">
          {isFetching ? (
            <p className="p-4 text-sm text-muted-foreground">Searching...</p>
          ) : suggestions.length > 0 ? (
            <>
              <div className="max-h-96 divide-y overflow-y-auto">
                {suggestions.map((product) => {
                  const image = uploadUrl("products", product.featured_image);
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        onNavigate?.();
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-muted"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        {image && (
                          <Image src={image} alt={product.title} fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium">{product.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(product.d_price || product.price)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => goToResults(query.trim())}
                className="block w-full border-t p-3 text-center text-sm font-medium text-primary hover:bg-muted"
              >
                See all results for &quot;{query.trim()}&quot;
              </button>
            </>
          ) : (
            <p className="p-4 text-sm text-muted-foreground">No products found for &quot;{debouncedQuery}&quot;</p>
          )}
        </div>
      )}
    </div>
  );
}
