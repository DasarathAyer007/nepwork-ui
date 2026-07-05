// Mirrors JobWriteSerializer and the Job model's choice fields.

export type JobType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'freelance';
export type WorkMode = 'onsite' | 'remote' | 'hybrid';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';
export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';

export interface JobLocationPayload {
  lat: number;
  lng: number;
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

export interface JobDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  organization: string | null;
  job_type: JobType;
  work_mode: WorkMode;
  status: JobStatus;
  category: string | null;
  skills_required: string[];
  requirements: KeyValuePair[];
  experience_level: ExperienceLevel;
  experience_years: number | null;
  location: JobLocationPayload | null;
  salary_min: string | null;
  salary_max: string | null;
  currency: string;
  contact_email: string;
  contact_phone: string;
  benefits: KeyValuePair[];
  deadline: string | null;
  created_at: string;
  updated_at: string;
}
