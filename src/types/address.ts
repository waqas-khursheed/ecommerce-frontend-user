import type { Country, State, City } from "@/types/location";

// Mirrors backed/src/modules/addresses/repositories/address.repository.js —
// one row per user with two address "slots" (address1 = primary/required
// once saved, address2 = optional secondary).
export interface UserAddress {
  id: number;
  user_id: number;
  address1: string;
  country_id1: number;
  state_id1: number;
  city_id1: number;
  code1: string;
  country1?: Country;
  state1?: State;
  city1?: City;
  address2?: string | null;
  country_id2?: number | null;
  state_id2?: number | null;
  city_id2?: number | null;
  code2?: string | null;
  country2?: Country | null;
  state2?: State | null;
  city2?: City | null;
}

export interface UpsertAddressPayload {
  address1?: string;
  country_id1?: number;
  state_id1?: number;
  city_id1?: number;
  code1?: string;
  address2?: string;
  country_id2?: number;
  state_id2?: number;
  city_id2?: number;
  code2?: string;
}
