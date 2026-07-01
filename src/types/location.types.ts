export interface LocationPoint {
  lat: number;
  lng: number;
}

export interface ExactLocation {
  point: LocationPoint;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  label?: string;
  type: 'exact';
}

export interface StreetLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  type: 'street';
}

export interface AreaLocation {
  city: string;
  state: string;
  country: string;
  postal_code: string;
  type: 'area';
}

export interface CityLocation {
  city: string;
  state: string;
  country: string;
  type: 'city';
}

export interface StateLocation {
  state: string;
  country: string;
  type: 'state';
}

export interface CountryLocation {
  country: string;
  type: 'country';
}

export interface HiddenLocation {
  label: string;
  type: 'hidden';
}

export type Location =
  | ExactLocation
  | StreetLocation
  | AreaLocation
  | CityLocation
  | StateLocation
  | CountryLocation
  | HiddenLocation
  | null;
