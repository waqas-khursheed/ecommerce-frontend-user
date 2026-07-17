import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryDetail(slug: string) {
  return useQuery({
    queryKey: ["categories", slug],
    queryFn: () => categoryService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
