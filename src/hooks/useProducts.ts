import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { productService } from "@/services/product.service";
import { getApiErrorMessage } from "@/lib/apiError";
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

export function useCreateStockAlert(slug: string) {
  return useMutation({
    mutationFn: (payload: { email: string; stock_id?: number }) => productService.notifyStock(slug, payload),
    onSuccess: () => toast.success("We'll email you when this is back in stock"),
    onError: (error) => toast.error(getApiErrorMessage(error, "Couldn't set up that notification")),
  });
}
