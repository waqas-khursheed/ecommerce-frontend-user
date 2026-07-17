import { useQuery } from "@tanstack/react-query";
import { tagService } from "@/services/tag.service";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => tagService.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTagDetail(slug: string) {
  return useQuery({
    queryKey: ["tags", slug],
    queryFn: () => tagService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
