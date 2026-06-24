import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../../../services/baseQuery';
import type {
  AuthResponse,
  LoginRequest,
  LoginUser,
  SignupRequest,
  SignupResponse,
} from '../types';

export const AuthApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['User'],

  endpoints: (builder) => ({
    // LOGIN
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
    }),

    // SIGNUP
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (body) => ({
        url: '/users/register',
        method: 'POST',
        body,
      }),
    }),

    // REFRESH TOKEN
    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: '/users/token/refresh',
        method: 'POST',
      }),
    }),

    // GET PROFILE
    getProfile: builder.query<LoginUser, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    // UPDATE ONBOARDING / PROFILE SETUP
    completeOnboarding: builder.mutation<LoginUser, FormData>({
      query: (body) => ({
        url: '/users/onboarding',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useCompleteOnboardingMutation,
} = AuthApi;
