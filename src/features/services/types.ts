import type { BasicUser } from '@/types/user.types';

// export interface Filters {
//   categories: string[];
//   priceMax: number;
//   minRating: number | null;
//   availableNow: boolean;
// }

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface LocationPoint {
  lat: number;
  lng: number;
}

export interface Location {
  point: LocationPoint;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  label: string;
}

export interface ServiceResult {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  price_type: 'fixed' | 'hourly';
  price: string | null;
  currency: string;
  availability_status: string;
  status: string;
  location: Location | null;
  user: BasicUser;
  category: Category | null;
  skills: string[];
  avg_rating: number;
  total_applies: number;
  is_currently_available: boolean;
  is_saved: boolean;
}

export interface ServicesListResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: ServiceResult[];
}

export interface ServicesQueryParams {
  search?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  category?: string; // category id
  category_slug?: string;
  price_min?: string;
  price_max?: string;
  currency?: string;
  price_type?: string;
  availability_status?: string; // e.g. "available"
  is_available?: string; // "true" or "false"
  has_location?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  skill?: string[];
  lat?: number;
  lng?: number;
  radius_km?: number;
}

export interface Filters {
  category: string; // slug or empty string
  skills: string[]; // array of skill IDs
  priceMin: string;
  priceMax: string;
  priceType: string; // "", "fixed", "hourly"
  availabilityStatus: string; // "", "available", "busy", "unavailable"
  availableNow: boolean;
  hasLocation: boolean | null;
}
