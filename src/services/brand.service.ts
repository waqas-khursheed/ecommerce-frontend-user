import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { ProductBrand } from "@/types/product";

// Endpoints confirmed against backed/src/modules/brands/controllers/user.brand.controller.js
// (mounted at /api/brands).
export const brandService = {
  async list(): Promise<ProductBrand[]> {
    const { data } = await http.get<ApiSuccessResponse<{ brands: ProductBrand[] }>>("/brands");
    return data.data.brands;
  },

  async getBySlug(slug: string): Promise<ProductBrand> {
    const { data } = await http.get<ApiSuccessResponse<ProductBrand>>(`/brands/${slug}`);
    return data.data;
  },
};
