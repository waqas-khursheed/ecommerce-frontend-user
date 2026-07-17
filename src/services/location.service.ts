import { http } from "@/lib/http";
import type { ApiSuccessResponse } from "@/types/api";
import type { Country, State, City } from "@/types/location";

// Endpoints confirmed against
// backed/src/modules/locations/routes/user.location.routes.js (mounted at
// /api — /countries, /states, /cities — all public).
export const locationService = {
  async listCountries(): Promise<Country[]> {
    const { data } = await http.get<ApiSuccessResponse<{ countries: Country[] }>>("/countries");
    return data.data.countries;
  },

  async listStates(countryId?: number): Promise<State[]> {
    const { data } = await http.get<ApiSuccessResponse<{ states: State[] }>>("/states", {
      params: countryId ? { country_id: countryId } : undefined,
    });
    return data.data.states;
  },

  async listCities(stateId?: number): Promise<City[]> {
    const { data } = await http.get<ApiSuccessResponse<{ cities: City[] }>>("/cities", {
      params: stateId ? { state_id: stateId } : undefined,
    });
    return data.data.cities;
  },
};
