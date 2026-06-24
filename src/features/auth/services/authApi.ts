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

export const AuthApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['User'],

  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
    }),

    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (body) => ({
        url: '/users/register',
        method: 'POST',
        body,
      }),
    }),

    completeOnboarding: builder.mutation<UserDetails, FormData>({
      query: (body) => ({
        url: '/users/onboarding',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    getSkills: builder.query<Skill[], { search: string }>({
      query: ({ search }) => `/skills/?search=${search}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useCompleteOnboardingMutation,
  useGetSkillsQuery,
} = AuthApi;
