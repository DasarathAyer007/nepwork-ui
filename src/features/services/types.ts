import type { BasicLocation } from '@/types/location.types';
import type { BasicUser } from '@/types/user.types';

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
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
  location: BasicLocation | null;
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

export interface ServiceLocationPayload {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export type ServicePriceType = 'FIXED' | 'HOURLY';
export type ServiceStatus = 'active' | 'inactive';

export interface ServiceCreatePayload {
  title: string;
  slug?: string;
  description: string;
  thumbnail?: File | null;
  category: string;
  availability_status?: string;
  location?: ServiceLocationPayload;
  price_type: ServicePriceType;
  status?: ServiceStatus;
  price?: number;
  currency: string;
  skills: string[];
  radius_km: number;
  available_from?: string | null;
  available_to?: string | null;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  category: string;
  availability_status: string;
  location: ServiceLocationPayload | null;
  price_type: ServicePriceType;
  status: ServiceStatus;
  price: string | null;
  currency: string;
  skills: string[];
  radius_km: number;
  available_from: string | null;
  available_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
}
