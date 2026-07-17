import { AxiosError } from "axios";
import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { UserAddress, UpsertAddressPayload } from "@/types/address";

// Endpoints confirmed against backed/src/modules/addresses/routes/address.routes.js
// (mounted at /api/address, requires auth). GET 404s (ADDRESS_NOT_FOUND) when
// the user hasn't saved one yet — that's a normal "no address" state, not an
// error, so it's the one case swallowed here; anything else still throws.
export const addressService = {
  async get(): Promise<UserAddress | null> {
    try {
      const { data } = await http.get<ApiSuccessResponse<UserAddress>>("/address");
      return data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) return null;
      throw error;
    }
  },

  async upsert(payload: UpsertAddressPayload): Promise<UserAddress> {
    const { data } = await http.put<ApiSuccessResponse<UserAddress>>("/address", payload);
    return data.data;
  },
};
