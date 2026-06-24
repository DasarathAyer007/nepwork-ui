import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../../../services/baseQuery';
import type { LoginUser, Skill, UserDetails } from '../types';

export const ProfileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery,
  tagTypes: ['User'],

  endpoints: (builder) => ({
    // GET PROFILE
    getProfile: builder.query<LoginUser, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    // UPDATE ONBOARDING / PROFILE SETUP
    completeOnboarding: builder.mutation<UserDetails, FormData>({
      query: (body) => ({
        url: '/users/onboarding',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    getProfileDetails: builder.query<UserDetails, { id: string }>({
      query: ({ id }) => `/users/${id}/details`,
      providesTags: ['User'],
    }),

    getSkills: builder.query<Skill[], { search: string }>({
      query: ({ search }) => `/skills/?search=${search}`,
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetProfileDetailsQuery,
  useCompleteOnboardingMutation,
  useGetSkillsQuery,
} = ProfileApi;
