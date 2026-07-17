import type { UserDetails } from '@/types/user.types';
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../../../services/baseQuery';
import type {
  AuthResponse,
  LoginRequest,
  OtpVerificationResponse,
  SignupRequest,
  SignupResponse,
  Skill,
} from '../types';
import { authEndpoints } from './authEndpoints';

export const AuthApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['User'],

  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: authEndpoints.LOGIN,
        method: 'POST',
        body,
      }),
    }),

    loginWithGoogle: builder.mutation<AuthResponse, { token: string }>({
      query: (body) => ({
        url: authEndpoints.GOOGLE_LOGIN,
        method: 'POST',
        body,
      }),
    }),

    loginWithFacebook: builder.mutation<AuthResponse, { token: string }>({
      query: (body) => ({
        url: authEndpoints.FACEBOOK_LOGIN,
        method: 'POST',
        body,
      }),
    }),

    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (body) => ({
        url: authEndpoints.SIGNUP,
        method: 'POST',
        body,
      }),
    }),

    completeOnboarding: builder.mutation<UserDetails, FormData>({
      query: (body) => ({
        url: authEndpoints.ONBOARDING,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    getSkills: builder.query<Skill[], { search: string }>({
      query: ({ search }) => `/skills/?search=${search}`,
    }),

    getPopularSkills: builder.query<
      Skill[],
      { limit?: number; type?: 'job' | 'service' | 'personal' | 'all' } | void
    >({
      query: (params) => ({
        url: '/skills/popular/',
        params: params ?? undefined,
      }),
    }),
    verifyOtp: builder.mutation<
      OtpVerificationResponse,
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: authEndpoints.VERIFY_OTP,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    resendOtp: builder.mutation<
      { message: string; cooldown_seconds: number },
      { email: string }
    >({
      query: (body) => ({
        url: authEndpoints.RESEND_OTP,
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<void, { refresh: string }>({
      query: (body) => ({
        url: authEndpoints.LOGOUT,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useLogoutMutation,
  useLoginWithGoogleMutation,
  useLoginWithFacebookMutation,
  useSignupMutation,
  useCompleteOnboardingMutation,
  useGetSkillsQuery,
  useGetPopularSkillsQuery,
} = AuthApi;
