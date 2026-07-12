// Mirrors JobWriteSerializer and the Job model's choice fields.
import type { BasicLocation } from '@/types/location.types';

export type JobType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'freelance';
export type WorkMode = 'onsite' | 'remote' | 'hybrid';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';
export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';
export type ProfileAccessLevel = 'full' | 'public' | 'limited' | 'private';

export interface JobLocationPayload {
  lat: number | null;
  lng: number | null;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface JobCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface BasicJobCategory {
  id: string;
  name: string;
  icon: string;
}

export interface JobCreatePayload {
  title: string;
  slug?: string;
  description: string;
  thumbnail?: File | null;
  organization?: string;
  job_type: JobType;
  work_mode: WorkMode;
  status?: JobStatus;
  category: string;
  skills_required: string[];
  requirements?: KeyValuePair[];
  experience_level: ExperienceLevel;
  experience_years?: number;
  location?: JobLocationPayload;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  contact_email?: string;
  contact_phone?: string;
  benefits?: KeyValuePair[];
  deadline?: string | null;
}

export interface JobEmployer {
  id: string;
  username: string;
  access_level: ProfileAccessLevel;
  account_type?: 'individual' | 'organization';

  // present on "limited" and above
  full_name?: string;
  profile_picture?: string | null;

  // present on "public" and above
  cover_photo?: string | null;
  bio?: string;
  location?: BasicLocation | null;
  social_links?: Record<string, string>;

  // present on "full" only
  email?: string;
  phone_number?: string;
  date_joined?: string;
  last_login?: string;

  // organization-flavored extras (present when account_type === 'organization',
  // still gated by the same access_level rules)
  industry?: string;
  logo?: string | null;
  employees_count?: number;
  founded_at?: string;
  address?: string;
  is_verified?: boolean;
}

export interface JobDetail {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  job_type: JobType;
  work_mode: WorkMode;
  status: JobStatus;
  location: BasicLocation | null;
  posted_by: string;
  category: JobCategory;
  skills_required: string[];
  salary_min: string;
  salary_max: string;
  currency: string;
  experience_level: ExperienceLevel;
  experience_years: number;
  deadline: string;
  description: string;
  requirements: Record<string, string>[];
  benefits: Record<string, string>[];
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
  employer: JobEmployer;
  is_saved: boolean;
}

export interface JobResult {
  id: string;
  slug: string;
  title: string;
  thumbnail: string | null;
  job_type: JobType;
  work_mode: WorkMode;
  status: JobStatus;
  category: BasicJobCategory | null;
  skills_required: string[];
  experience_level: ExperienceLevel;
  experience_years: number | null;
  location: BasicLocation | null;
  salary_min: string | null;
  salary_max: string | null;
  currency: string;
  deadline: string | null;
  total_applications: number;
  is_saved: boolean;
}

export interface JobListResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: JobResult[];
}

export interface JobListQueryParams {
  search?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  has_location?: string;

  lat?: number;
  lng?: number;
  radius_km?: number;

  salary_min?: number | string;
  salary_max?: number | string;
  currency?: string;

  job_type?: string;

  work_mode?: string;

  experience_level?: string;
  experience_years?: number | string;

  category?: string;
  category_slug?: string;

  skills?: string[];

  deadline_before?: string;
  deadline_after?: string;

  status?: string;

  ordering?: string;

  page?: number;
  page_size?: number;
}

export type JobOrdering =
  | 'salary_min'
  | '-salary_min'
  | 'salary_max'
  | '-salary_max'
  | 'created_at'
  | '-created_at'
  | 'total_applications'
  | '-total_applications'
  | 'experience_years'
  | '-experience_years'
  | 'distance';

export interface JobFilters {
  category: string;
  jobType: JobType | '';
  workMode: WorkMode | '';
  experienceLevel: ExperienceLevel | '';
  experienceYears: number | null;
  /** Skill names — the backend filters jobs by `skills_required__name__in`. */
  skills: string[];
  salaryMin: string;
  salaryMax: string;
  currency: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  hasLocation: boolean | null;
  deadlineBefore: string;
  deadlineAfter: string;
  status?: JobStatus | '';
}

// ── Job Applications ─────────────────────────────────────────

export type ApplicationStatus =
  | 'applied'
  | 'shortlisted'
  | 'under_review'
  | 'interview_scheduled'
  | 'interviewed'
  | 'offered'
  | 'rejected'
  | 'withdrawn';

export interface JobApplicationJob {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  status: JobStatus;
  posted_by: string | null;
  posted_by_name: string | null;
}

export interface JobApplicationUser {
  id: string;
  username: string;
  full_name: string;
  profile_picture: string | null;
}

export interface JobApplicationResult {
  id: string;
  job: JobApplicationJob;
  applicant: JobApplicationUser;
  resume: string | null;
  cover_letter: string;
  status: ApplicationStatus;
  expected_salary: string | null;
  years_of_experience: number | null;
  reviewed_by: JobApplicationUser | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplicationListResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: JobApplicationResult[];
}

export interface JobApplicationQueryParams {
  scope?: 'applied' | 'received';
  job_id?: string;
  status?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
