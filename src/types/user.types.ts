import type { Skill } from './skill.types';

interface BaseUser {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone_number: string | null;
  status: 'active' | 'inactive';
  account_type: 'personal' | 'organization';
  profile_picture: string | null;
  cover_photo: string | null;
  is_onboarded: boolean;
  profile_visibility: 'public' | 'private' | 'limited';
  social_links: Record<string, string>;
  last_active_at: string;
}

export interface PersonalProfile extends BaseUser {
  account_type: 'personal';
  skills: Skill[];
  bio: string | null;
  date_of_birth: string | null;
  access_level: 'full' | 'public' | 'limited' | 'private';
}

export interface BasicUser {
  is_verified: import("react/jsx-runtime").JSX.Element;
  id: string;
  username: string;
  profile_picture: string;
}

export interface OrganizationProfile extends BaseUser {
  account_type: 'organization';
  bio: string | null;
  organization_name: string;
  logo: string | null;
  employees_count: number | null;
  founded_at: string | null;
  address: string | null;
  industry: string | null;
  is_verified: boolean;
  access_level: 'full' | 'public' | 'limited' | 'private';
}

export type UserDetails = PersonalProfile | OrganizationProfile;
