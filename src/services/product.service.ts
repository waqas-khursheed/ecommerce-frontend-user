import { http } from "@/lib/http";
import type { ApiSuccessResponse, PaginationMeta } from "@/types/api";
import type { Product, ProductFilters } from "@/types/product";

interface ProductListData {
  products: Product[];
  meta: PaginationMeta;
}

// Endpoints + response shapes confirmed against
// backed/src/modules/products/{controllers,services}/user.product.*.js
// (mounted at /api/products).
export const productService = {
  async list(filters: ProductFilters & { page?: number; limit?: number } = {}): Promise<ProductListData> {
    const { data } = await http.get<ApiSuccessResponse<ProductListData>>("/products", {
      params: filters,
    });
    return data.data;
  },

  async getBySlug(slug: string): Promise<Product> {
    const { data } = await http.get<ApiSuccessResponse<Product>>(`/products/${slug}`);
    return data.data;
  },

  async getRelated(slug: string, limit = 8): Promise<Product[]> {
    const { data } = await http.get<ApiSuccessResponse<{ products: Product[] }>>(`/products/${slug}/related`, {
      params: { limit },
    });
    return data.data.products;
  },

  async checkStock(slug: string, params?: { color_id?: number; size_id?: number; fitting_id?: number }) {
    const { data } = await http.get<ApiSuccessResponse<{ id: number; stock_qty: number | null }>>(
      `/products/${slug}/stock`,
      { params }
    );
    return data.data;
  },

  async notifyStock(slug: string, payload: { email: string; stock_id?: number }): Promise<{ subscribed: boolean }> {
    const { data } = await http.post<ApiSuccessResponse<{ subscribed: boolean }>>(
      `/products/${slug}/notify-stock`,
      payload
    );
    return data.data;
  },
};
