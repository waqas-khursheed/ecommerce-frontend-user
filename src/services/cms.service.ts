import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { CommonPage, ContactUsPage, FaqCategory } from "@/types/cms";

// Endpoints confirmed against backed/src/modules/home/routes/home.routes.js
// (mounted at /api — /faqs, /contact-us-page, /pages/:slug — all public).
export const cmsService = {
  async getFaqs(): Promise<FaqCategory[]> {
    const { data } = await http.get<ApiSuccessResponse<{ categories: FaqCategory[] }>>("/faqs");
    return data.data.categories;
  },

  async getContactUsPage(): Promise<ContactUsPage> {
    const { data } = await http.get<ApiSuccessResponse<ContactUsPage>>("/contact-us-page");
    return data.data;
  },

  async getPage(slug: string): Promise<CommonPage> {
    const { data } = await http.get<ApiSuccessResponse<CommonPage>>(`/pages/${slug}`);
    return data.data;
  },
};
