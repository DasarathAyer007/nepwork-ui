import type { UserDetails } from '@/types/user.types';
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../../../services/baseQuery';

export const ProfileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery,
  tagTypes: ['User'],

  endpoints: (builder) => ({
    getProfileDetails: builder.query<UserDetails, { id: string }>({
      query: ({ id }) => `/users/${id}/details`,
      providesTags: ['User'],
    }),
  }),
});

export const { useGetProfileDetailsQuery } = ProfileApi;
