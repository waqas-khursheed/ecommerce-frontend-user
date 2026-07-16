import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import type { ProductFilters } from "@/types/product";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters & { page?: number; limit?: number }) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  related: (slug: string) => [...productKeys.all, "related", slug] as const,
};

export function useProducts(filters: ProductFilters & { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.list(filters),
    staleTime: 60 * 1000,
  });
}

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
}

export function useRelatedProducts(slug: string) {
  return useQuery({
    queryKey: productKeys.related(slug),
    queryFn: () => productService.getRelated(slug),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
}
