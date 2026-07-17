import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { ProductTag } from "@/types/tag";

// Endpoints confirmed against backed/src/modules/tags/routes/user.tag.routes.js
// (mounted at /api/tags, public — no auth, no status filter since ProductTag
// has no active/inactive column).
export const tagService = {
  async list(): Promise<ProductTag[]> {
    const { data } = await http.get<ApiSuccessResponse<{ tags: ProductTag[] }>>("/tags");
    return data.data.tags;
  },

  async getBySlug(slug: string): Promise<ProductTag> {
    const { data } = await http.get<ApiSuccessResponse<ProductTag>>(`/tags/${slug}`);
    return data.data;
  },
};
