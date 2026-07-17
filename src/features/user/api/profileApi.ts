import type { Location } from '@/types/location.types';
import type { UserDetails } from '@/types/user.types';
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '../../../services/baseQuery';

export const ProfileApi = createApi({
  reducerPath: 'profileApi',

  baseQuery,

  tagTypes: ['User'],

  endpoints: (builder) => ({
    getProfileDetails: builder.query<UserDetails, { username: string }>({
      query: ({ username }) =>
        `/users/profile/${username}`,

      providesTags: [
        {
          type: 'User',
          id: 'PROFILE',
        },
      ],
    }),


    getLocationDetails: builder.query<Location, { userid: string }>({
      query: ({ userid }) =>
        `/users/${userid}/location`,

      providesTags: [
        {
          type: 'User',
          id: 'PROFILE',
        },
      ],
    }),


    updateProfile: builder.mutation<UserDetails, FormData>({
      query: (body) => ({
        url: '/users/profile/update/',
        method: 'PATCH',
        body,
      }),

      invalidatesTags: [
        {
          type: 'User',
          id: 'PROFILE',
        },
      ],
    }),
  }),
});


export const {
  useGetProfileDetailsQuery,
  useGetLocationDetailsQuery,
  useUpdateProfileMutation,
} = ProfileApi;