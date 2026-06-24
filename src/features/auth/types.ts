export interface LoginRequest {
  username: string;
  password: string;
}

// export interface SignupRequest {
//   fullName: string;
//   email: string;
//   username: string;
//   password: string;
//   confirmPassword: string;
//   accountType: 'personal' | 'organization';
// }

export interface SignupRequest {
  full_name: string;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  account_type: 'personal' | 'organization';
}

export interface SignupResponse {
  message: string;
  user_id: string;
  username: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: LoginUser;
}

export interface LoginUser {
  id: number;
  full_name: string;
  email: string;
  username: string;
  account_type: 'personal' | 'organization' | null;
  profile_picture: string | null;
  is_onboarded: boolean;
}

interface BaseUser {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  status: 'active' | 'inactive';
  username: string;
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
  skills: string[];
  description: string | null;
  bio: string | null;
  date_of_birth: string | null;
}

export interface OrganizationProfile extends BaseUser {
  account_type: 'organization';
  organization_name: string;
  logo: string | null;
  employees_count: number | null;
  founded_at: string | null;
  address: string | null;
  industry: string | null;
  is_verified: boolean;
}

export type UserDetails = PersonalProfile | OrganizationProfile;

export interface Skill {
  id: string;
  name: string;
}
