import type { BasicLocation } from '@/types/location.types';
import type { BasicUser } from '@/types/user.types';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface PopularCategory extends Category {
  count: number;
}

export interface ServiceResult {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  price_type: 'fixed' | 'hourly';
  price: string | null;
  currency: string;
  availability_status: ServiceAvailability;
  status: ServiceLifecycleStatus;
  location: BasicLocation | null;
  user: BasicUser;
  category: Category | null;
  skills: string[];
  avg_rating: number;
  total_applies: number;
  is_currently_available: boolean;
  is_saved: boolean;
}

export interface ServiceDetail extends ServiceResult {
  description: string;
  created_at: string;
  updated_at: string;
  radius_km: number | null;
  available_from: string | null;
  available_to: string | null;
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
  status?: string; // service status: draft/active/paused/closed (my-services only)
  is_available?: string; // "true" or "false"
  has_location?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  skills?: string[]; // skill IDs — backend filters via `skills__id__in`
  radius_min?: string;
  radius_max?: string;
  available_from?: string;
  available_to?: string;
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
  radiusMin: string;
  radiusMax: string;
  availableFrom: string;
  availableTo: string;
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

// ── Service Requests ─────────────────────────────────────────

export type ServiceRequestStatus =
  | 'open'
  | 'in_review'
  | 'accepted'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ServiceRequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ServiceRequestUser {
  id: string;
  username: string;
  full_name: string;
  profile_picture: string | null;
}

export interface ServiceRequestService {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  status: string;
  user: ServiceRequestUser;
}

export interface ServiceRequestResult {
  id: string;
  user: ServiceRequestUser;
  service: ServiceRequestService;
  status: ServiceRequestStatus;
  priority: ServiceRequestPriority;
  budget: string | null;
  currency: string;
  preferred_date: string | null;
  preferred_time: string | null;
  estimated_duration_hours: number | null;
  is_negotiable: boolean;
  request_message: string;
  response_message: string;
  location: BasicLocation | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequestListResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: ServiceRequestResult[];
}

export interface ServiceRequestQueryParams {
  scope?: 'sent' | 'received';
  service_id?: string;
  status?: string;
  priority?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
export interface ServiceRequestCreatePayload {
  service: string; // service id
  priority?: ServiceRequestPriority;
  budget?: number;
  currency?: string;
  preferred_date?: string | null;
  preferred_time?: string | null;
  estimated_duration_hours?: number;
  is_negotiable?: boolean;
  request_message: string;
}

export interface ServiceUpdatePayload {
  title?: string;
  description?: string;
  category?: string;
  status?: ServiceLifecycleStatus;
  availability_status?: ServiceAvailability;
  price_type?: 'fixed' | 'hourly';
  price?: number;
  currency?: string;
  skills?: string[];
  location?: ServiceLocationPayload;
  radius_km?: number;
  available_from?: string | null;
  available_to?: string | null;
}
export type ServiceLifecycleStatus = 'draft' | 'active' | 'paused' | 'closed';
export type ServiceAvailability =
  'available' | 'unavailable' | 'break' | 'holiday';
