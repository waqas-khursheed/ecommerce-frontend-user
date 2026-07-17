// Mirrors backed/src/database/models/{Country,State,City}.js — exposed
// read-only via backed/src/modules/locations/controllers/user.location.controller.js.
export interface Country {
  id: number;
  country_code: string;
  country_name: string;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
}
