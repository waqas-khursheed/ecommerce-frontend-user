import { useQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand.service";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => brandService.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBrandDetail(slug: string) {
  return useQuery({
    queryKey: ["brands", slug],
    queryFn: () => brandService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
