import type { UserDetails } from '@/types/user.types';
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../../../services/baseQuery';
import type {
  AuthResponse,
  LoginRequest,
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
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useCompleteOnboardingMutation,
  useGetSkillsQuery,
  useGetPopularSkillsQuery,
} = AuthApi;
