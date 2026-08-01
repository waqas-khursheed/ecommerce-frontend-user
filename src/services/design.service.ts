import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { SavedDesign } from "@/types/order";

// Mirrors backed/src/modules/customizations (mounted at /api/designs) — a
// single stateless upload-and-return-filenames endpoint. No auth required,
// works the same for guest and logged-in customers.
export const designService = {
  async save(formData: FormData): Promise<SavedDesign> {
    const { data } = await http.post<ApiSuccessResponse<SavedDesign>>("/designs", formData);
    return data.data;
  },
};
