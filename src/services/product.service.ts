import { http } from "@/lib/http";
import type { ApiSuccessResponse, PaginatedData } from "@/types/api";
import type { Product, ProductFilters } from "@/types/product";

// Endpoints confirmed against backed/src/modules/products/routes/user.product.routes.js
// (mounted at /api/products).
export const productService = {
  async list(filters: ProductFilters & { page?: number; limit?: number } = {}): Promise<PaginatedData<Product>> {
    const { data } = await http.get<ApiSuccessResponse<PaginatedData<Product>>>("/products", {
      params: filters,
    });
    return data.data;
  },

  async getBySlug(slug: string): Promise<Product> {
    const { data } = await http.get<ApiSuccessResponse<Product>>(`/products/${slug}`);
    return data.data;
  },

  async getRelated(slug: string): Promise<Product[]> {
    const { data } = await http.get<ApiSuccessResponse<Product[]>>(`/products/${slug}/related`);
    return data.data;
  },

  async checkStock(slug: string, params?: { color_id?: number; size_id?: number; fitting_id?: number }) {
    const { data } = await http.get<ApiSuccessResponse<{ in_stock: boolean; quantity: number }>>(
      `/products/${slug}/stock`,
      { params }
    );
    return data.data;
  },
};
