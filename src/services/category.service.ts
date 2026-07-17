import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { ProductCategory } from "@/types/product";

// Endpoints confirmed against
// backed/src/modules/categories/{controllers,services}/user.category.*.js
// (mounted at /api/categories). `list` returns top-level categories with
// their direct children nested; `getBySlug` returns one category + children.
export const categoryService = {
  async list(): Promise<ProductCategory[]> {
    const { data } = await http.get<ApiSuccessResponse<{ categories: ProductCategory[] }>>("/categories");
    return data.data.categories;
  },

  async getBySlug(slug: string): Promise<ProductCategory> {
    const { data } = await http.get<ApiSuccessResponse<ProductCategory>>(`/categories/${slug}`);
    return data.data;
  },
};
