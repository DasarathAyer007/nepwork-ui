export interface LoginRequest {
  username: string;
  password: string;
}

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
  id: string;
  full_name: string;
  email: string;
  username: string;
  account_type: 'personal' | 'organization' | null;
  profile_picture: string | null;
  is_onboarded: boolean;
}

export interface Skill {
  id: string;
  name: string;
}
